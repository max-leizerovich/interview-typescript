import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { App } from './App';

type MockFetchResponse = {
  ok: boolean;
  json?: () => Promise<unknown>;
};

function mockFetchOnce(value: unknown) {
  const response: MockFetchResponse = {
    ok: true,
    json: () => Promise.resolve(value),
  };
  (global.fetch as jest.Mock).mockResolvedValueOnce(response);
}

describe('<App />', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('loads and renders items', async () => {
    mockFetchOnce({
      items: [{ id: '1', name: 'milk', createdAt: new Date().toISOString() }],
    });

    render(<App />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();

    expect(await screen.findByText('milk')).toBeInTheDocument();
  });

  test('can create an item', async () => {
    mockFetchOnce({ items: [] });
    mockFetchOnce({
      item: { id: '1', name: 'eggs', createdAt: new Date().toISOString() },
    });

    render(<App />);
    await waitFor(() => expect(screen.queryByText('Loading…')).not.toBeInTheDocument());

    await userEvent.type(screen.getByLabelText('item-name'), 'eggs');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByText('eggs')).toBeInTheDocument();
    const secondCall = (global.fetch as jest.Mock).mock.calls[1];
    expect(secondCall?.[0]).toBe('/api/items');
  });

  test('shows error on load failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<App />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not load items',
    );
  });

  test('shows error on create failure', async () => {
    mockFetchOnce({ items: [] });
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<App />);
    await waitFor(() =>
      expect(screen.queryByText('Loading…')).not.toBeInTheDocument(),
    );

    await userEvent.type(screen.getByLabelText('item-name'), 'bread');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Could not create item',
    );
  });
});

