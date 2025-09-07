import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BuyNowButton } from '@/components/product/BuyNowButton';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('@clerk/nextjs', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

describe('BuyNowButton', () => {
  const mockProduct = {
    _id: '123',
    name: 'Test Product',
    price: 100,
    stock: 10,
    images: [{ asset: { url: 'test.jpg' } }],
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockToast = {
    toast: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast.toast });
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clear sessionStorage
    sessionStorage.clear();
  });

  it('should render the Buy Now button', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });

    render(<BuyNowButton product={mockProduct} />);

    expect(screen.getByText('Buy Now')).toBeInTheDocument();
  });

  it('should show login dialog when user is not signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: false });

    render(<BuyNowButton product={mockProduct} />);

    fireEvent.click(screen.getByText('Buy Now'));

    expect(screen.getByText('Log in to complete your purchase quickly')).toBeInTheDocument();
  });

  it('should redirect to cart when user has items in cart', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });

    // Mock localStorage to have items in cart
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'luminaire-haven-cart') {
        return JSON.stringify([{ _id: '456', name: 'Existing Product', quantity: 1 }]);
      }
      return null;
    });

    render(<BuyNowButton product={mockProduct} />);

    fireEvent.click(screen.getByText('Buy Now'));

    expect(mockToast.toast).toHaveBeenCalledWith({
      title: 'Cart Has Items',
      description: 'Your cart already has items. You\'ll be redirected to the cart page.',
      variant: 'default',
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/cart');
  });

  it('should create express cart and redirect to checkout when user is signed in and cart is empty', () => {
    (useAuth as jest.Mock).mockReturnValue({ isSignedIn: true });

    // Mock empty cart
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'luminaire-haven-cart') {
        return JSON.stringify([]);
      }
      return null;
    });

    render(<BuyNowButton product={mockProduct} />);

    fireEvent.click(screen.getByText('Buy Now'));

    expect(sessionStorage.getItem('expressCheckoutCart')).toBeTruthy();
    expect(mockRouter.push).toHaveBeenCalledWith('/checkout?express=true');
  });

  it('should show out of stock message when product is out of stock', () => {
    const outOfStockProduct = {
      ...mockProduct,
      stock: 0,
    };

    render(<BuyNowButton product={outOfStockProduct} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Out of Stock')).toBeDisabled();
  });
});