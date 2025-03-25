import { NextRequest, NextResponse } from 'next/server';
import sgMail from "@sendgrid/mail";
import { rateLimit, getClientIp } from '@/lib/rate-limit';

// Function to escape HTML special characters to prevent XSS attacks
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Rate limit configuration - adjust these values based on your requirements
const RATE_LIMIT_CONFIG = {
  interval: 60 * 1000,    // 1 minute (in milliseconds)
  maxRequests: 5          // 5 requests per minute
};

export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const clientIp = getClientIp(req);
    const { isLimited, reset, remaining } = await rateLimit(clientIp, RATE_LIMIT_CONFIG);
    
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
    
    // Initialize SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('Missing SendGrid API Key');
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    sgMail.setApiKey(apiKey);
    
    // Parse the request body
    const body = await req.json();
    const { name, email, phone, message, formType } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate form type (ensure it's one of the expected values)
    const validFormTypes = ['contact', 'strategy', 'onboarding'];
    const validatedFormType = validFormTypes.includes(formType) ? formType : 'contact';
    
    // Escape all user inputs to prevent XSS
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedPhone = phone ? escapeHtml(phone) : '';
    const escapedMessage = escapeHtml(message);
    
    // Construct email content based on form type
    let subject, htmlContent, textContent;
    
    if (validatedFormType === 'onboarding') {
      // Onboarding form submission
      subject = `New Onboarding Registration: ${escapedName}`;
      
      // Use the pre-formatted message for plain text (no escaping needed for text content)
      textContent = message;
      
      // Convert text message to HTML with proper formatting
      htmlContent = `
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Phone:</strong> ${escapedPhone || 'Not provided'}</p>
        <hr />
        <pre style="font-family: Arial, sans-serif; white-space: pre-wrap;">${escapedMessage}</pre>
      `;
    } else {
      // Regular contact or strategy call form
      subject = validatedFormType === 'strategy' 
        ? `Strategy Call Request from ${escapedName}`
        : `New Contact Form Message from ${escapedName}`;

      // Create a more detailed message with all available information
      const phoneInfo = phone ? `Phone: ${escapedPhone}` : 'No phone provided';
      const formTypeInfo = `Form Type: ${validatedFormType === 'strategy' ? 'Strategy Call Request' : 'Contact Form'}`;
      
      // First escape the message, then replace newlines with <br> tags
      const messageWithLineBreaks = escapedMessage.replace(/\n/g, '<br>');
      
      htmlContent = `
        <h2>${subject}</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>${phoneInfo}</strong></p>
        <p><strong>${formTypeInfo}</strong></p>
        <p><strong>Message:</strong></p>
        <p>${messageWithLineBreaks}</p>
      `;
      
      textContent = `${name} (${email}) - ${phone ? `Phone: ${phone}` : 'No phone provided'} - Form Type: ${validatedFormType === 'strategy' ? 'Strategy Call Request' : 'Contact Form'}\n\n${message}`;
    }

    const content = {
      to: "peter@bulkupload.info",
      from: "peter@partnerup.online", // This should be a verified sender in your SendGrid account
      subject: subject,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(content);
    
    // Return rate limit headers with successful response
    return NextResponse.json(
      { status: "Success", message: "Email sent successfully" }, 
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
    console.error("SendGrid Error:", error);
    return NextResponse.json({ 
      error: "Failed to send email",
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    }, { status: 500 });
  }
}