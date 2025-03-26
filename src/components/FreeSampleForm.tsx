"use client";

import { useState } from 'react';

interface FreeSampleFormProps {
  onClose?: () => void;
}

export default function FreeSampleForm({ onClose }: FreeSampleFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<{
    status: 'success' | 'error';
    message: string;
    couponCode?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setResponse({
        status: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }
    
    setIsSubmitting(true);
    setResponse(null);
    
    try {
      // Add a brief delay to show loading state (also prevents multiple rapid submissions)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const res = await fetch('/api/free-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      // Ensure we handle timeouts and network issues gracefully
      if (!res) {
        throw new Error('Network response was not received');
      }
      
      if (res.ok) {
        // Even if the HTTP status is "ok", we need to check if the operation actually succeeded
        if (data.success === false) {
          console.error('API reported failure:', data.error);
          setResponse({
            status: 'error',
            message: data.error || 'Unable to process your request.'
          });
        } else {
          // Check if we need to display the coupon code directly in the UI
          if (data.couponCode) {
            setResponse({
              status: 'success',
              message: data.message || 'Success! Please save your coupon code:',
              couponCode: data.couponCode
            });
          } else {
            setResponse({
              status: 'success',
              message: data.message || 'Success! Check your email for your free sample coupon. (It may take a few minutes to arrive, please check your spam folder if you don\'t see it.)'
            });
          }
          setEmail('');
        }
      } else {
        console.error('API error response:', data);
        setResponse({
          status: 'error',
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setResponse({
        status: 'error',
        message: 'Failed to submit request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Get Your Free Sample</h3>
        <p className="text-gray-600">Enter your email to receive a coupon for 100 free address enrichments.</p>
      </div>
      
      {response && (
        <div 
          className={`p-4 mb-4 rounded-lg ${
            response.status === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300 font-medium'
          }`}
        >
          <p>{response.message}</p>
          
          {/* Display coupon code prominently if provided */}
          {response.couponCode && (
            <div className="mt-4 p-3 bg-white border-2 border-green-500 rounded-md text-center">
              <p className="text-sm text-gray-600 mb-1">Your Coupon Code:</p>
              <p className="text-xl font-bold font-mono tracking-wide">{response.couponCode}</p>
              <p className="mt-2 text-xs text-gray-500">Please save this code - you'll need it at checkout</p>
            </div>
          )}
        </div>
      )}
      
      {!response?.status || response.status === 'error' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B9FF66] focus:border-transparent transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 text-black font-medium rounded-lg transition-colors ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#B9FF66] hover:bg-opacity-90'
            }`}
          >
            {isSubmitting ? 'Sending...' : 'Get Free Sample'}
          </button>
        </form>
      ) : (
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      )}
    </div>
  );
}
