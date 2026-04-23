import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimelineVisualizer from '../components/TimelineVisualizer';

describe('TimelineVisualizer Component', () => {
  const mockEvents = [
    {
      id: '1',
      date: '2026-11-03',
      title: 'General Election Day',
      description: 'The main voting day for federal and state representatives.',
      type: 'Federal Election'
    },
    {
      id: '2',
      date: '2026-10-05',
      title: 'Voter Registration Deadline',
      description: 'Last day to register to vote online or by mail.',
      type: 'Deadline'
    }
  ];

  it('renders a fallback message when no events are provided', () => {
    render(<TimelineVisualizer events={[]} />);
    
    // Assert that the empty state message is shown
    expect(screen.getByText(/No election events available to display/i)).toBeInTheDocument();
  });

  it('renders events chronologically using useMemo optimization', () => {
    render(<TimelineVisualizer events={mockEvents} />);
    
    // The component should sort them chronologically (Oct 5 before Nov 3)
    const eventTitles = screen.getAllByRole('heading', { level: 3 });
    
    expect(eventTitles[0]).toHaveTextContent('Voter Registration Deadline');
    expect(eventTitles[1]).toHaveTextContent('General Election Day');
  });

  it('renders all event properties correctly (title, description, date, type)', () => {
    render(<TimelineVisualizer events={mockEvents} />);
    
    // Verify specific properties of the first event (General Election Day)
    expect(screen.getByText('General Election Day')).toBeInTheDocument();
    expect(screen.getByText('The main voting day for federal and state representatives.')).toBeInTheDocument();
    expect(screen.getByText('Federal Election')).toBeInTheDocument();
    
    // Verify specific properties of the second event (Deadline)
    expect(screen.getByText('Voter Registration Deadline')).toBeInTheDocument();
    expect(screen.getByText('Last day to register to vote online or by mail.')).toBeInTheDocument();
    expect(screen.getByText('Deadline')).toBeInTheDocument();
  });

  it('renders the timeline track and dots for accessibility', () => {
    render(<TimelineVisualizer events={mockEvents} />);
    
    // Verify the ordered list container exists and has an aria-label
    const timelineContainer = screen.getByRole('list', { name: /Timeline of election events/i });
    expect(timelineContainer).toBeInTheDocument();
    
    // Verify the correct number of list items were rendered
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
  });
});
