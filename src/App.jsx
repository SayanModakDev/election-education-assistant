import { useState } from 'react';
import Layout from './components/Layout';
import TimelineVisualizer from './components/TimelineVisualizer';
import ChatInterface from './components/ChatInterface';
import PrivacyPolicy from './components/PrivacyPolicy';
import AccessibilityStatement from './components/AccessibilityStatement';
import ContactUs from './components/ContactUs';

const sampleElectionEvents = [
  {
    id: 1,
    date: '2026-11-03',
    title: 'General Election Day',
    description: 'The main voting day for federal, state, and local representatives. Polls are typically open from 7 AM to 8 PM.',
    type: 'Federal Election'
  },
  {
    id: 2,
    date: '2026-10-05',
    title: 'Voter Registration Deadline',
    description: 'Last day to register to vote online, by mail, or in-person for the upcoming General Election.',
    type: 'Deadline'
  },
  {
    id: 3,
    date: '2026-10-15',
    title: 'Early Voting Begins',
    description: 'Registered voters can begin casting their ballots at designated early voting locations across the state.',
    type: 'Voting Period'
  }
];

/**
 * The root application component.
 * It coordinates the main layout and basic state-based routing.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderContent = () => {
    switch(currentPage) {
      case 'privacy':
        return <PrivacyPolicy setPage={setCurrentPage} />;
      case 'accessibility':
        return <AccessibilityStatement setPage={setCurrentPage} />;
      case 'contact':
        return <ContactUs setPage={setCurrentPage} />;
      case 'home':
      default:
        return (
          <>
            <div className="bg-white p-8 shadow-sm border border-slate-200 rounded-md mb-8">
              <h1 className="text-4xl font-extrabold text-[#0b2b5e] mb-6">
                Welcome to the Election Education Assistant
              </h1>
              <p className="text-lg text-slate-700 leading-relaxed mb-4">
                This platform is designed to provide clear, accessible, and highly accurate information regarding upcoming elections, voting procedures, and civic resources.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                Navigate through the resources above to learn more about your rights and responsibilities as a voter.
              </p>
              <button
                onClick={() => {
                  document.getElementById('chat-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#c02a2a] hover:bg-[#a02222] text-white font-bold py-3 px-6 rounded-md transition-colors focus:outline-none focus:ring-4 focus:ring-[#c02a2a] focus:ring-offset-2 shadow-sm"
                aria-label="Start learning about the electoral process"
              >
                Start Learning Now
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
              <div id="chat-section" className="scroll-mt-8">
                <h2 className="text-3xl font-extrabold text-[#0b2b5e] mb-6 border-b-2 border-slate-200 pb-2">
                  Ask the Assistant
                </h2>
                <ChatInterface />
              </div>

              <div id="timeline-section" className="scroll-mt-8">
                <TimelineVisualizer events={sampleElectionEvents} />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <Layout setPage={setCurrentPage}>
      {renderContent()}
    </Layout>
  );
}

export default App;
