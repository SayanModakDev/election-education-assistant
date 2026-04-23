import React, { useState } from 'react';

/**
 * Contact Us component with a functional form state.
 * 
 * @returns {JSX.Element}
 */
const ContactUs = ({ setPage }) => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to an API endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white p-12 shadow-sm border border-slate-200 rounded-md max-w-2xl mx-auto my-12 text-center">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
          ✓
        </div>
        <h1 className="text-3xl font-extrabold text-[#0b2b5e] mb-4">Message Sent Successfully!</h1>
        <p className="text-lg text-slate-700 mb-8">Thank you for reaching out. A representative will get back to you shortly.</p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setSubmitted(false)}
            className="bg-[#0b2b5e] hover:bg-[#082046] text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Send Another Message
          </button>
          <button 
            onClick={() => { setPage('home'); window.scrollTo(0,0); }}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-6 rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-md max-w-2xl mx-auto my-8 relative">
      <button 
        onClick={() => { setPage('home'); window.scrollTo(0,0); }}
        className="mb-6 text-[#0b2b5e] hover:text-[#c02a2a] font-bold flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] rounded-sm px-1 py-0.5"
        aria-label="Go back to the main dashboard"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-extrabold text-[#0b2b5e] mb-6 border-b-2 border-slate-200 pb-2">Contact Us</h1>
      <p className="text-slate-700 mb-6">Have questions or need assistance with your voting registration? Fill out the form below and we'll get in touch.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            id="name" 
            required 
            placeholder="Jane Doe"
            className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] focus:border-transparent transition-all shadow-sm" 
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            id="email" 
            required 
            placeholder="jane@example.com"
            className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] focus:border-transparent transition-all shadow-sm" 
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Your Message <span className="text-red-500">*</span></label>
          <textarea 
            id="message" 
            rows="5" 
            required 
            placeholder="How can we help you?"
            className="w-full border border-slate-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] focus:border-transparent transition-all shadow-sm"
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-[#c02a2a] hover:bg-[#a02222] text-white font-bold py-4 px-4 rounded-md transition-colors focus:outline-none focus:ring-4 focus:ring-red-300 shadow-sm text-lg"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
