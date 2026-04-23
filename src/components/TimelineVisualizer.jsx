import React, { useMemo } from 'react';

/**
 * @typedef {Object} ElectionEvent
 * @property {string|number} id - Unique identifier for the event
 * @property {string} date - ISO date string for the event (e.g., '2026-11-03')
 * @property {string} title - The name of the event
 * @property {string} description - Details about the event
 * @property {string} [type] - Optional category badge (e.g., 'Deadline')
 */

/**
 * Renders a vertical, responsive timeline of election events.
 * Wrapped in React.memo to prevent unnecessary re-renders when parent state changes but events array reference remains the same.
 * 
 * @param {Object} props - Component props
 * @param {ElectionEvent[]} props.events - Array of election events to display
 * @returns {JSX.Element} The rendered timeline component
 */
const TimelineVisualizer = React.memo(({ events = [] }) => {
  // Optimize rendering by using useMemo to sort the events chronologically 
  // only when the 'events' array changes, rather than on every render.
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  if (!sortedEvents || sortedEvents.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-md border border-slate-200 shadow-sm">
        No election events available to display.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-4">
      <h2 className="text-3xl font-extrabold text-[#0b2b5e] mb-8 border-b-2 border-slate-200 pb-4">
        Election Timeline
      </h2>
      
      {/* The Timeline Container */}
      <ol className="relative border-l-4 border-[#0b2b5e] ml-4 md:ml-6" aria-label="Timeline of election events">
        {sortedEvents.map((event, index) => (
          <li key={event.id || index} className="mb-10 ml-8 relative group">
            {/* The Timeline Node / Dot */}
            <span 
              className="absolute flex items-center justify-center w-6 h-6 bg-[#c02a2a] rounded-full -left-[46px] ring-4 ring-white group-hover:scale-125 transition-transform"
              aria-hidden="true"
            >
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </span>

            {/* The Event Content Card */}
            <div className="bg-white p-6 rounded-md shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <time 
                dateTime={event.date}
                className="block mb-2 text-sm font-bold leading-none text-[#c02a2a] uppercase tracking-wide"
              >
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              
              <h3 className="text-xl font-extrabold text-[#0b2b5e] mb-3">
                {event.title}
              </h3>
              
              <p className="text-base text-slate-700 leading-relaxed mb-4">
                {event.description}
              </p>
              
              {event.type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
                  {event.type}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
});

// Adding displayName for React DevTools since we used React.memo anonymously
TimelineVisualizer.displayName = 'TimelineVisualizer';

export default TimelineVisualizer;
