import { describe, it, expect, vi } from 'vitest';
import { N8nProductDetail } from '@/types';

// Mock the supabaseAdmin client
const mockSupabaseAdmin = {
  from: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
};

vi.mock('@/utils/supabaseAdminClient', () => ({
  supabaseAdmin: mockSupabaseAdmin,
}));

// Import the function to test
import { POST as processOrderRoute } from '@/app/api/process-order/route';

describe('Order Processing - NOT NULL constraint validation', () => {
  it('should reject orders with missing product_id', async () => {
    // Create a mock request with a product that has no id
    const mockRequest = {
      json: async () => ({
        order_number: 'UDL-TEST123',
        confirmation_code: 'CONF123',
        payment_status: 'paid',
        amount: 100,
        payment_method: 'card',
        created_date: new Date().toISOString(),
        payment_account: 'ACC123',
        customer_email: 'test@example.com',
        customer_name: 'Test User',
        customer_phone: '1234567890',
        shipping_location: 'Nairobi',
        clerk_id: 'clerk123',
        city_town: 'Nairobi',
        products: [
          {
            // Missing id field - this should cause validation to fail
            name: 'Test Product',
            quantity: 1,
            price: 50,
            image_url: 'test.jpg',
          }
        ],
      }),
    };

    // Mock the response
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock the supabase response for order creation
    mockSupabaseAdmin.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: 'order123' },
        error: null,
      }),
    });

    // Call the route handler
    try {
      await processOrderRoute(mockRequest as unknown as Request);
      // Should not reach here
      expect(true).toBe(false);
    } catch (error) {
      // Should throw an error about missing product_id
      expect(error.message).toContain('product_id cannot be null or undefined');
    }
  });

  it('should successfully process orders with valid product_id', async () => {
    // Create a mock request with valid products
    const mockRequest = {
      json: async () => ({
        order_number: 'UDL-TEST123',
        confirmation_code: 'CONF123',
        payment_status: 'paid',
        amount: 100,
        payment_method: 'card',
        created_date: new Date().toISOString(),
        payment_account: 'ACC123',
        customer_email: 'test@example.com',
        customer_name: 'Test User',
        customer_phone: '1234567890',
        shipping_location: 'Nairobi',
        clerk_id: 'clerk123',
        city_town: 'Nairobi',
        products: [
          {
            id: 'prod123',  // Valid id
            name: 'Test Product',
            quantity: 1,
            price: 50,
            image_url: 'test.jpg',
          }
        ],
      }),
    };

    // Mock the response
    const mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    // Mock the supabase responses
    mockSupabaseAdmin.from.mockReturnValueOnce({
      insert: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValueOnce({
        data: { id: 'order123' },
        error: null,
      }),
    }).mockReturnValueOnce({
      insert: vi.fn().mockResolvedValueOnce({
        error: null,
      }),
    });

    // Call the route handler
    const result = await processOrderRoute(mockRequest as unknown as Request);

    // Should return success
    expect(result.status).toBe(200);
    const data = await result.json();
    expect(data.success).toBe(true);
  });
});