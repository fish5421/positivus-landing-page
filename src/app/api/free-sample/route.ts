import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import { getClientIp, simpleRateLimit } from '@/lib/simple-rate-limit';

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  interval: 60 * 60 * 1000, // 1 hour (in milliseconds)
  maxRequests: 3           // 3 requests per hour
};

// Function to escape HTML special characters to prevent XSS attacks
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Function to generate a unique coupon code with timestamp to reduce collision chance
function generateCouponCode(): string {
  const prefix = 'FREE100';
  // Add timestamp in the code to reduce chance of duplicates
  const timestamp = Date.now().toString(36).substring(4, 8).toUpperCase();
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}${randomString}`;
}

// Function to safely log an object without circular references
function safeJsonLog(obj: any): string {
  try {
    const cache: any[] = [];
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.includes(value)) return '[Circular]';
        cache.push(value);
      }
      return value;
    }, 2);
  } catch (err) {
    return '[Unable to stringify object]';
  }
}

export async function POST(req: NextRequest) {
  // Track if either the primary or backup email method succeeded
  let emailDelivered = false;
  let couponCode = '';
  
  try {
    // Apply simple in-memory rate limiting only
    const clientIp = getClientIp(req);
    
    // Use only simple in-memory rate limiting
    const { isLimited, reset, remaining } = simpleRateLimit(clientIp, RATE_LIMIT_CONFIG);
    
    // If rate limited, return 429 Too Many Requests
    if (isLimited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(reset / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + reset / 1000).toString()
          }
        }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { email } = body;
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Escape user input
    const escapedEmail = escapeHtml(email);
    
    // Initialize Stripe with better error handling
    const stripeApiKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
    if (!stripeApiKey) {
      console.error('Missing Stripe API Key. Ensure STRIPE_SECRET_KEY or STRIPE_API_KEY is set in .env.local');
      return NextResponse.json({ success: false, error: "Server configuration error: Missing Stripe API Key" }, { status: 500 });
    }
    
    let stripe;
    try {
      stripe = new Stripe(stripeApiKey, {
        apiVersion: '2025-02-24.acacia', // Use the correct API version
      });
    } catch (stripeInitError) {
      console.error('Error initializing Stripe:', stripeInitError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to initialize payment system. Please try again later." 
      }, { status: 500 });
    }
    
    // Check if customer already exists in Stripe
    let existingCustomers;
    try {
      existingCustomers = await stripe.customers.list({
        email: escapedEmail,
        limit: 1
      });
    } catch (customerListError) {
      console.error('Error checking existing customers:', customerListError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to verify customer status. Please try again later." 
      }, { status: 500 });
    }
    
    let customer;
    
    try {
      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        
        // Check if they've already used a free trial
        if (customer.metadata.free_trial_sent === 'true') {
          console.log(`Email ${escapedEmail} has already received a free sample`);
          return NextResponse.json({ 
            success: false, 
            error: "This email has already received a free sample." 
          }, { status: 200 });
        }
        
        // Update existing customer metadata
        customer = await stripe.customers.update(customer.id, {
          metadata: { 
            free_trial_sent: 'true',
            free_trial_date: new Date().toISOString()
          }
        });
        console.log(`Updated existing customer: ${customer.id}`);
      } else {
        // Create new customer
        customer = await stripe.customers.create({
          email: escapedEmail,
          metadata: { 
            free_trial_sent: 'true',
            free_trial_date: new Date().toISOString()
          }
        });
        console.log(`Created new customer: ${customer.id}`);
      }
    } catch (customerError) {
      console.error('Error creating/updating customer:', customerError);
      return NextResponse.json({ 
        success: false, 
        error: "Failed to process customer information. Please try again later." 
      }, { status: 500 });
    }
    
    // Generate unique coupon code - storing in outer scope variable for error handling
    couponCode = generateCouponCode();
    console.log(`Generated coupon code: ${couponCode} for email: ${escapedEmail}`);
    
    // Create the coupon in Stripe (assuming $10 covers 100 records at $0.10 each)
    try {
      await stripe.coupons.create({
        id: couponCode,
        name: '100 Free Records',
        amount_off: 1000, // $10.00 in cents
        currency: 'usd',
        duration: 'once',
        max_redemptions: 1,
        redeem_by: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        metadata: {
          customer_id: customer.id,
          free_records: '100'
        }
      });
      console.log(`Created coupon in Stripe: ${couponCode}`);
    } catch (couponError) {
      console.error('Error creating coupon:', couponError);
      
      // Check if it's a duplicate coupon error (meaning we somehow generated the same code)
      const cError: any = couponError;
      if (cError.message?.includes('already exists')) {
        // Try one more time with a different code
        const newCouponCode = generateCouponCode() + Math.floor(Math.random() * 1000);
        try {
          await stripe.coupons.create({
            id: newCouponCode,
            name: '100 Free Records',
            amount_off: 1000,
            currency: 'usd',
            duration: 'once',
            max_redemptions: 1,
            redeem_by: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
            metadata: {
              customer_id: customer.id,
              free_records: '100'
            }
          });
          couponCode = newCouponCode;
          console.log(`Created coupon on second attempt: ${couponCode}`);
        } catch (secondCouponError) {
          console.error('Error creating coupon on second attempt:', secondCouponError);
          return NextResponse.json({ 
            success: false, 
            error: "Failed to generate your coupon. Please try again later." 
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({ 
          success: false, 
          error: "Failed to create coupon. Please try again later." 
        }, { status: 500 });
      }
    }
    
    // Initialize SendGrid with better error handling
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    if (!sendgridApiKey) {
      console.error('Missing SendGrid API Key');
      // Don't fail here - we'll still create the coupon and return it directly to the user
    } else {
      sgMail.setApiKey(sendgridApiKey);
    }
    
    // Prepare email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Your Free Data Enrichment Sample</h2>
        
        <p>Thanks for your interest in our real estate data enrichment service!</p>
        
        <p>Here's your exclusive coupon code for <strong>100 FREE addresses</strong>:</p>
        
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <span style="font-size: 18px; font-weight: bold; color: #333;">${couponCode}</span>
        </div>
        
        <p>To use your free sample:</p>
        <ol style="margin-bottom: 20px;">
          <li>Visit <a href="https://bulkupload.info">bulkupload.info</a></li>
          <li>Upload your address file</li>
          <li>Map your address fields</li>
          <li>At checkout, enter the coupon code above</li>
        </ol>
        
        <p>This coupon is valid for 30 days and covers up to 100 addresses. If your file contains more than 100 addresses, you'll only be charged for the additional records.</p>
        
        <p>Questions? Reply to this email and we'll help you out.</p>
        
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          ${new Date().getFullYear()} Precision Data. All rights reserved.
        </p>
      </div>
    `;
    
    const textContent = `
      Your Free Data Enrichment Sample
      
      Thanks for your interest in our real estate data enrichment service!
      
      Here's your exclusive coupon code for 100 FREE addresses:
      
      ${couponCode}
      
      To use your free sample:
      1. Visit bulkupload.info
      2. Upload your address file
      3. Map your address fields
      4. At checkout, enter the coupon code above
      
      This coupon is valid for 30 days and covers up to 100 addresses.
      
      Questions? Reply to this email and we'll help you out.
    `;
    
    // Only try to send emails if SendGrid API key is set
    if (sendgridApiKey) {
      // PRIMARY EMAIL METHOD: Using the preferred sender
      try {
        console.log(`[ATTEMPT 1] Sending with primary sender: peter@bulkupload.info to: ${escapedEmail}`);
        
        const msg = {
          to: escapedEmail,
          from: "peter@bulkupload.info",
          replyTo: "peter@precisiondataboost.com",
          subject: "Your Free Sample: 100 Address Enrichments",
          text: textContent,
          html: htmlContent
        };
        
        const response = await sgMail.send(msg);
        console.log(`[SUCCESS] Primary email sent. Status code: ${response[0].statusCode}`);
        emailDelivered = true;
      } catch (primaryError: any) {
        console.error(`[FAIL] Primary email failed:`, primaryError.message);
        console.error(`More details:`, primaryError.response?.body ? safeJsonLog(primaryError.response.body) : 'No response body');
        
        // BACKUP EMAIL METHOD 1: Try sending from the admin email with reply-to set
        try {
          console.log(`[ATTEMPT 2] Sending with admin email as sender: peter@bulkupload.info to: ${escapedEmail}`);
          
          const fallbackMsg = {
            to: escapedEmail,
            from: "peter@bulkupload.info", // Admin email as sender
            replyTo: "peter@precisiondataboost.com",
            subject: "Your Free Sample: 100 Address Enrichments",
            text: textContent,
            html: htmlContent
          };
          
          const fallbackResponse = await sgMail.send(fallbackMsg);
          console.log(`[SUCCESS] Fallback email sent. Status code: ${fallbackResponse[0].statusCode}`);
          emailDelivered = true;
        } catch (fallbackError: any) {
          console.error(`[FAIL] Fallback email failed:`, fallbackError.message);
          console.error(`More details:`, fallbackError.response?.body ? safeJsonLog(fallbackError.response.body) : 'No response body');

          // BACKUP EMAIL METHOD 2: Try sending a completely generic email from a Gmail address
          try {
            console.log(`[ATTEMPT 3] Trying SendGrid default sender...`);
            
            // Last resort - use a completely generic template without fancy formatting
            const lastResortMsg = {
              to: escapedEmail,
              from: "peter@bulkupload.info", // This should be a verified sender
              subject: "Your Free Sample Coupon Code",
              text: `
Your free sample coupon code is: ${couponCode}

Use this at bulkupload.info for 100 free address enrichments.

Questions? Reply to this email.
              `,
              // Very simple HTML to avoid any rendering issues
              html: `
<p>Your free sample coupon code is: <strong>${couponCode}</strong></p>
<p>Use this at bulkupload.info for 100 free address enrichments.</p>
<p>Questions? Reply to this email.</p>
              `
            };
            
            const finalResponse = await sgMail.send(lastResortMsg);
            console.log(`[SUCCESS] Simple fallback email sent. Status code: ${finalResponse[0].statusCode}`);
            emailDelivered = true;
          } catch (finalError: any) {
            console.error(`[FAIL] All email attempts failed:`, finalError.message);
            console.error(`Final error details:`, finalError.response?.body ? safeJsonLog(finalError.response.body) : 'No response body');
          }
        }
      }
    } else {
      console.warn('SendGrid API key not set - skipping email sending');
    }
    
    // Always try to send admin notification
    if (sendgridApiKey) {
      try {
        // Always use the admin email as the sender for the admin notification
        const adminMsg = {
          to: "peter@bulkupload.info",
          from: "peter@bulkupload.info", // This should definitely be verified
          subject: `[IMPORTANT] New Free Sample Request: ${escapedEmail}`,
          text: `
CRITICAL ADMIN NOTIFICATION

New free sample request from: ${escapedEmail}
Coupon code: ${couponCode}
Date: ${new Date().toISOString()}
Email successfully sent to user: ${emailDelivered ? "YES" : "NO - USER DID NOT RECEIVE EMAIL"}

${!emailDelivered ? "ACTION REQUIRED: Please manually send the coupon code to the user!" : ""}
`,
          html: `
<h2>CRITICAL ADMIN NOTIFICATION</h2>
<p><strong>New free sample request from:</strong> ${escapedEmail}</p>
<p><strong>Coupon code:</strong> ${couponCode}</p>
<p><strong>Date:</strong> ${new Date().toISOString()}</p>
<p><strong>Email successfully sent to user:</strong> ${emailDelivered ? "YES" : "<span style='color: red; font-weight: bold;'>NO - USER DID NOT RECEIVE EMAIL</span>"}</p>
${!emailDelivered ? "<p style='color: red; font-weight: bold;'>ACTION REQUIRED: Please manually send the coupon code to the user!</p>" : ""}
`
        };
        
        await sgMail.send(adminMsg);
        console.log('Admin notification email sent successfully');
      } catch (adminError) {
        console.error('Failed to send admin notification:', adminError);
      }
    }
    
    // Return success response, showing the coupon code directly if email failed
    return NextResponse.json(
      { 
        success: true, 
        message: emailDelivered 
          ? "Success! We've sent the coupon code to your email. Please check your inbox and spam folder."
          : `Success! Your coupon code is ${couponCode}. Please save this code - you'll need it at checkout.`,
        couponCode: emailDelivered ? undefined : couponCode,
        couponGenerated: true,
        emailDelivered
      }, 
      { 
        status: 200,
        headers: {
          'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(Date.now() / 1000 + reset / 1000).toString()
        }
      }
    );
  } catch (error) {
    console.error("Free Sample API Error:", error);
    
    // If we generated a coupon but something else failed, still return it to the user
    if (couponCode) {
      return NextResponse.json({ 
        success: true,
        message: `Success! Your coupon code is ${couponCode}. Please save this code - you'll need it at checkout.`,
        couponCode,
        couponGenerated: true,
        emailDelivered: false,
        note: "We encountered an issue sending the email, but your coupon has been generated successfully."
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      success: false,
      error: "Failed to process request. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
