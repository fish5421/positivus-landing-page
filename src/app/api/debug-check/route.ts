import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

/**
 * This endpoint is for debugging email delivery issues in production
 * It checks if the SendGrid API key is configured properly and attempts to send a test email
 */
export async function GET(req: NextRequest) {
  try {
    // Check for SendGrid API key
    const sendgridApiKey = process.env.SENDGRID_API_KEY;
    const hasKey = !!sendgridApiKey;
    
    let testEmailResult = null;
    
    // Only attempt to send if the key is present
    if (hasKey) {
      sgMail.setApiKey(sendgridApiKey!);
      
      try {
        // Attempt to send a test email to check if the sender is verified
        const response = await sgMail.send({
          to: 'peter@bulkupload.info',  // Your admin email
          from: 'peter@precisiondataboost.com', // The sender you're trying to use
          subject: 'Debug Check - Email Delivery Test',
          text: 'This is a test email to verify email delivery is working properly.',
          html: '<p>This is a test email to verify email delivery is working properly.</p>',
        });
        
        testEmailResult = {
          success: true,
          statusCode: response[0].statusCode,
          headers: response[0].headers,
        };
      } catch (emailError) {
        const errorObj: any = emailError;
        testEmailResult = {
          success: false,
          error: errorObj?.message || 'Unknown error',
          response: errorObj?.response ? {
            body: errorObj.response.body,
            statusCode: errorObj.response.statusCode,
          } : null,
        };
      }
    }
    
    // Return diagnostic information
    return NextResponse.json({
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      sendgrid: {
        hasKey,
        // Don't expose the actual key
        keyLength: hasKey ? sendgridApiKey!.length : 0,
        testEmail: testEmailResult,
      },
      stripe: {
        hasKey: !!process.env.STRIPE_SECRET_KEY,
        // Don't expose the actual key
        keyLength: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
      },
      server: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
      }
    });
  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ 
      error: 'Debug check failed',
      details: (error as Error).message
    }, { status: 500 });
  }
}
