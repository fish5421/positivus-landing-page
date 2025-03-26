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
      const res = await fetch('/api/free-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setResponse({
          status: 'success',
          message: data.message || 'Success! Check your email for your free sample coupon.'
        });
        setEmail('');
      } else {
        setResponse({
          status: 'error',
          message: data.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
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
            response.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {response.message}
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
