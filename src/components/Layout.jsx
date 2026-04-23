/**
 * A foundational layout component that provides a consistent 'Gov-Tech' aesthetic.
 * It includes an accessible header, main content area, and footer.
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to render within the main content area
 * @returns {JSX.Element} The rendered Layout component
 */
const Layout = ({ children, setPage }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-blue-900 focus:text-white font-bold rounded-br-md"
      >
        Skip to main content
      </a>

      <header className="bg-[#0b2b5e] text-white shadow-md border-b-[6px] border-[#c02a2a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Branding */}
            <div className="flex-shrink-0 flex items-center">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-2xl font-extrabold tracking-tight focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#0b2b5e] rounded-sm px-2 py-1 flex items-center gap-2"
                aria-label="Home - Election Education Assistant"
              >
                {/* Placeholder for an official seal/logo */}
                <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/40" aria-hidden="true">
                  🏛️
                </span>
                Election Assistant
              </a>
            </div>

            {/* Main Navigation */}
            <nav aria-label="Main Navigation">
              <ul className="flex space-x-2 md:space-x-6">
                <li>
                  <a
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setPage('home'); 
                      setTimeout(() => document.getElementById('timeline-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
                    }}
                    className="hover:bg-white/10 px-4 py-3 rounded-md text-base font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#0b2b5e]"
                    aria-label="View Upcoming Elections"
                  >
                    Elections
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setPage('home'); 
                      setTimeout(() => document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' }), 50);
                    }}
                    className="hover:bg-white/10 px-4 py-3 rounded-md text-base font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 focus:ring-offset-[#0b2b5e]"
                    aria-label="Educational Resources"
                  >
                    Resources
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full" role="main">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-10 border-t-4 border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-base font-medium text-white mb-2">
              Official Election Education Portal
            </p>
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Election Education Assistant. All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage('privacy'); window.scrollTo(0, 0); }}
                  className="hover:text-white underline underline-offset-4 focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-sm px-1 py-0.5"
                  aria-label="Read Privacy Policy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage('accessibility'); window.scrollTo(0, 0); }}
                  className="hover:text-white underline underline-offset-4 focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-sm px-1 py-0.5"
                  aria-label="View Accessibility Statement"
                >
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setPage('contact'); window.scrollTo(0, 0); }}
                  className="hover:text-white underline underline-offset-4 focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-sm px-1 py-0.5"
                  aria-label="Contact Us"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
