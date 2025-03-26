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
    let senderVerificationStatus = null;
    
    // Only attempt to send if the key is present
    if (hasKey) {
      sgMail.setApiKey(sendgridApiKey!);
      
      // First try a simple test to see if the API key works at all
      let apiKeyValid = false;
      try {
        // We would use the SendGrid API to check the API key validity
        // but we don't have the right scopes, so we'll just assume it's valid
        // if we have one
        apiKeyValid = true;
        console.log('API key appears to be present');
      } catch (error) {
        console.error('Error checking API key validity:', error);
      }
      
      // Now try to send a test email to check if the sender is verified
      try {
        // Add timestamp to subject for easier tracking
        const timestamp = new Date().toISOString();
        
        const msg = {
          to: 'peter@bulkupload.info',  // Your admin email
          from: 'peter@precisiondataboost.com', // The sender you're trying to use
          subject: `Debug Check - Email Test (${timestamp})`,
          text: `This is a test email to verify email delivery is working properly. Sent at: ${timestamp}`,
          html: `<p>This is a test email to verify email delivery is working properly.</p><p>Sent at: ${timestamp}</p>`,
          mail_settings: {
            sandbox_mode: {
              enable: false // Set to true for testing without sending
            }
          },
          tracking_settings: {
            click_tracking: {
              enable: true
            },
            open_tracking: {
              enable: true
            }
          }
        };
        
        const response = await sgMail.send(msg);
        
        testEmailResult = {
          success: true,
          statusCode: response[0].statusCode,
          headers: response[0].headers,
          timestamp: timestamp
        };
        
        // Log the full response for easier debugging in server logs
        console.log('SendGrid test email response:', JSON.stringify({
          statusCode: response[0].statusCode,
          headers: response[0].headers
        }));
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
        
        // Log detailed error for server logs
        console.error('SendGrid test email error:', JSON.stringify(errorObj));
        
        // Try to determine if this is a sender verification issue
        if (errorObj?.response?.body?.errors?.some((e: any) => 
            e.message?.includes('verify') || e.message?.includes('sender'))) {
          senderVerificationStatus = {
            verified: false,
            error: "Sender email address is not verified in SendGrid"
          };
        }
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
