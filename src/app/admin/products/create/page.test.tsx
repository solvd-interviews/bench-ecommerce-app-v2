import { render, screen, fireEvent, act } from '@testing-library/react';
import Page from './page';

describe('Product Creation Page', () => {
  const setup = () => render(<Page />);

  it('should render the product creation form without crashing', () => {
    setup();
    expect(screen.getByText(/Create a Product/i)).toBeInTheDocument();
  });

  it('should allow entering a name', () => {
    setup();
    const inputElement = screen.getByPlaceholderText('Pedro') as HTMLInputElement;
    fireEvent.change(inputElement, { target: { value: 'New Product' } });
    expect(inputElement.value).toBe('New Product');
  });

  it('should handle form submission with empty inputs', async () => {
    setup();
    const NextButton = screen.getByText(/Next/i);
    await act(async () => {
      fireEvent.click(NextButton);
    })
    expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
  });
});
