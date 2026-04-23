import React from 'react';

/**
 * Privacy Policy component explaining data usage and collection.
 * 
 * @returns {JSX.Element}
 */
const PrivacyPolicy = ({ setPage }) => {
  return (
    <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-md max-w-4xl mx-auto my-8 relative">
      <button 
        onClick={() => { setPage('home'); window.scrollTo(0,0); }}
        className="mb-6 text-[#0b2b5e] hover:text-[#c02a2a] font-bold flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] rounded-sm px-1 py-0.5"
        aria-label="Go back to the main dashboard"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-extrabold text-[#0b2b5e] mb-6 border-b-2 border-slate-200 pb-2">Privacy Policy</h1>
      <div className="space-y-4 text-slate-700 leading-relaxed">
        <p>Your privacy is important to us. This privacy statement explains the personal data we process, how we process it, and for what purposes in the context of the Election Education Assistant.</p>
        
        <h2 className="text-xl font-bold text-[#0b2b5e] mt-6">Data Collection</h2>
        <p>We do not collect any personally identifiable information unless you explicitly provide it (e.g., via the Contact Us form). Chat interactions with the AI assistant are processed securely to provide real-time answers but are not permanently linked to your personal identity.</p>
        
        <h2 className="text-xl font-bold text-[#0b2b5e] mt-6">Data Usage</h2>
        <p>Data provided is used solely for the purpose of improving election education and assistant functionality. We do not sell, rent, or share your data with third parties or external marketing agencies.</p>

        <h2 className="text-xl font-bold text-[#0b2b5e] mt-6">Data Security</h2>
        <p>We implement standard security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
