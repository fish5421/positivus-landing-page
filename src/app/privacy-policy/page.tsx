"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:text-primary-dark flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-8 italic">Last updated: June 18, 2024</p>

        <div className="prose prose-lg max-w-none">
          <p>
            This privacy notice for <strong>Precision Data</strong> ("we," "us," or "our") describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you:
          </p>
          <ul>
            <li>Visit our website, or any website of ours that links to this privacy notice</li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
          
          <p>
            <strong>Questions or concerns?</strong> Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:support@precision-data.com">support@precision-data.com</a>.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4">Summary of Key Points</h2>
          <p>
            This summary provides key points from our privacy notice, but you can find out more details about any of these topics within the policy below.
          </p>
          
          <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with Precision Data and the Services, the choices you make, and the products and features you use.</p>
          
          <p><strong>Do we process any sensitive personal information?</strong> We may process sensitive personal information when necessary with your consent or as otherwise permitted by applicable law.</p>
          
          <p><strong>Do we receive any information from third parties?</strong> We do not receive any information from third parties.</p>
          
          <p><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
          
          <p><strong>In what situations and with which types of parties do we share personal information?</strong> We may share information in specific situations and with specific categories of third parties.</p>
          
          <p><strong>How do we keep your information safe?</strong> We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. What Information Do We Collect?</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Personal information you disclose to us</h3>
          <p><strong>In Short:</strong> We collect personal information that you provide to us.</p>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
          </p>
          <p>
            <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
          </p>
          <ul>
            <li>names</li>
            <li>phone numbers</li>
            <li>email addresses</li>
            <li>mailing addresses</li>
            <li>contact or authentication data</li>
            <li>billing addresses</li>
            <li>debit/credit card numbers</li>
            <li>passwords</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Sensitive Information</h3>
          <p>
            When necessary, with your consent or as otherwise permitted by applicable law, we process the following categories of sensitive information:
          </p>
          <ul>
            <li>financial data</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Information automatically collected</h3>
          <p><strong>In Short:</strong> Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</p>
          <p>
            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information), but it may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, and location, as well as information about how and when you use our Services. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. How Do We Process Your Information?</h2>
          <p><strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
          <p>
            We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
          </p>
          <ul>
            <li>To facilitate account creation and authentication and otherwise manage user accounts.</li>
            <li>To deliver and facilitate delivery of services to the user.</li>
            <li>To respond to user inquiries/offer support to users.</li>
            <li>To send administrative information to you.</li>
            <li>To fulfill and manage your orders.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have questions or comments about this notice, you may contact us at:
          </p>
          <address className="not-italic">
            <strong>Precision Data</strong><br />
            11000 W McNichols Rd<br />
            Suite 323 - 1567<br />
            Detroit, MI 48221<br />
            United States<br />
            Phone: (918) 517-6821<br />
            Email: <a href="mailto:support@precision-data.com">support@precision-data.com</a>
          </address>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;