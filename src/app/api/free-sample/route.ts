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

// Function to generate a unique coupon code
function generateCouponCode(): string {
  const prefix = 'FREE100';
  const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${randomString}`;
}

export async function POST(req: NextRequest) {
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
    const stripeApiKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeApiKey) {
      console.error('Missing Stripe API Key');
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
    
    // Generate unique coupon code
    const couponCode = generateCouponCode();
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
          console.log(`Created coupon on second attempt: ${newCouponCode}`);
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
      return NextResponse.json({ success: false, error: "Server configuration error: Missing SendGrid API Key" }, { status: 500 });
    }
    
    sgMail.setApiKey(sendgridApiKey);
    
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
          © ${new Date().getFullYear()} Precision Data. All rights reserved.
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
    
    // Send customer email with proper error handling
    const msg = {
      to: escapedEmail,
      from: "peter@precisiondataboost.com", // Use verified sender email
      subject: "Your Free Sample: 100 Address Enrichments",
      text: textContent,
      html: htmlContent,
    };
    
    try {
      const response = await sgMail.send(msg);
      console.log('Customer email sent successfully:', response[0].statusCode);
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
      
      // Check if it's a SendGrid verification error (common with new sender emails)
      const errorObj: any = emailError;
      if (errorObj.response?.body?.errors?.some((e: any) => e.message?.includes('verify')) || 
          errorObj.message?.includes('verify')) {
        return NextResponse.json({ 
          success: false, 
          error: "Email sending failed: Sender email not verified. Please contact support." 
        }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: false, 
        error: "Failed to send email. Please try again later." 
      }, { status: 500 });
    }
    
    // Also send notification to admin
    const adminMsg = {
      to: "peter@bulkupload.info",
      from: "peter@precisiondataboost.com",
      subject: `New Free Sample Request: ${escapedEmail}`,
      text: `New free sample request from ${escapedEmail}. Coupon code: ${couponCode}`,
      html: `
        <h2>New Free Sample Request</h2>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Coupon Code:</strong> ${couponCode}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    };
    
    try {
      await sgMail.send(adminMsg);
      console.log('Admin notification email sent successfully');
    } catch (adminEmailError) {
      // Just log admin email errors but don't fail the request
      console.error('Error sending admin notification email:', adminEmailError);
    }
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: "Success! We've sent the coupon code to your email.",
        couponGenerated: true
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
    return NextResponse.json({ 
      success: false,
      error: "Failed to process request. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}
