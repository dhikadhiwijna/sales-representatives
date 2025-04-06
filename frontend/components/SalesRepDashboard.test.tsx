import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SalesRepDashboard from './SalesRepDashboard';

global.fetch = jest.fn();

describe('SalesRepDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(); // Directly mock global.fetch
  });

  it('renders loading state initially', () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      json: async () => ({ salesReps: [] }),
    } as Response);

    render(<SalesRepDashboard />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders sales representatives after fetching data', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      json: async () => ({
        salesReps: [
          { id: 1, name: 'John Doe', role: 'Manager', region: 'North', skills: [], deals: [], clients: [] },
        ],
      }),
    } as Response);

    render(<SalesRepDashboard />);
    await waitFor(() => expect(screen.getByText(/john doe/i)).toBeInTheDocument());
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(new Error('API Error'));

    render(<SalesRepDashboard />);
    await waitFor(() => expect(screen.getByText(/failed to load sales data/i)).toBeInTheDocument());
  });

  it('sends a question to the AI assistant and displays the response', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>)
      .mockResolvedValueOnce({
        json: async () => ({ salesReps: [] }),
      } as Response)
      .mockResolvedValueOnce({
        json: async () => ({ response: 'AI Response' }),
      } as Response);

    render(<SalesRepDashboard />);
    await waitFor(() => expect(screen.queryByText(/loading/i)).not.toBeInTheDocument());

    const input = screen.getByPlaceholderText(/ask a question/i);
    const button = screen.getByText(/ask ai/i);

    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText(/ai response/i)).toBeInTheDocument());
  });
});
