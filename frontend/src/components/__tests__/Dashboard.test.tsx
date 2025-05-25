import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SierpinskiDashboard from '../Dashboard';

global.fetch = jest.fn();

describe('SierpinskiDashboard', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('renders dashboard header', () => {
    render(<SierpinskiDashboard />);
    expect(screen.getByText(/Sierpinski Triangle Blockchain/i)).toBeInTheDocument();
  });

  test('fetches and displays token data', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token_name: 'Władysłaium',
        symbol: 'WŁ',
        initial_supply: 1000000,
        owner: 'owner_ABC123',
        creation_time: 1672531200
      }),
    });

    render(<SierpinskiDashboard />);
    await waitFor(() => expect(screen.getByText(/Token Name/i)).toBeInTheDocument());
    expect(screen.getByText('Władysłaium')).toBeInTheDocument();
  });

  test('handles token creation button click', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Token not found' }),
    });

    render(<SierpinskiDashboard />);
    const createButton = await screen.findByTestId('create-token-button');
    expect(createButton).toBeInTheDocument();

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        token: {
          token_name: 'Władysłaium',
          symbol: 'WŁ',
          initial_supply: 1000000,
          owner: 'owner_ABC123',
          creation_time: 1672531200
        }
      }),
    });

    fireEvent.click(createButton);
    await waitFor(() => expect(screen.getByText(/Token Name/i)).toBeInTheDocument());
  });
});
