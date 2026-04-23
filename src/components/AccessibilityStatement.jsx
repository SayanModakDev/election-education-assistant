import React from 'react';

/**
 * Accessibility Statement component detailing WCAG conformance.
 * 
 * @returns {JSX.Element}
 */
const AccessibilityStatement = ({ setPage }) => {
  return (
    <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-md max-w-4xl mx-auto my-8 relative">
      <button 
        onClick={() => { setPage('home'); window.scrollTo(0,0); }}
        className="mb-6 text-[#0b2b5e] hover:text-[#c02a2a] font-bold flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0b2b5e] rounded-sm px-1 py-0.5"
        aria-label="Go back to the main dashboard"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-3xl font-extrabold text-[#0b2b5e] mb-6 border-b-2 border-slate-200 pb-2">Accessibility Statement</h1>
      <div className="space-y-4 text-slate-700 leading-relaxed">
        <p>We are committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards to all features.</p>
        
        <h2 className="text-xl font-bold text-[#0b2b5e] mt-6">Conformance Status</h2>
        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We strive to be fully compliant with <strong>WCAG 2.1 level AA</strong>.</p>
        
        <h2 className="text-xl font-bold text-[#0b2b5e] mt-6">Features</h2>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>High contrast ratio color schemes ('Gov-Tech' styling)</li>
          <li>Full keyboard navigability and "Skip to content" links</li>
          <li>ARIA live regions for dynamic AI response announcements</li>
          <li>Semantic HTML structure to support screen readers</li>
        </ul>

        <h2 className="text-xl font-bold text-[#0b2b5e] mt-6">Feedback</h2>
        <p>We welcome your feedback on the accessibility of the Election Education Assistant. Please let us know if you encounter accessibility barriers via our Contact Us page.</p>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
