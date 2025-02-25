const express = require('express');
const request = require('supertest'); // For simulating HTTP requests in tests
const orderRoutes = require('../routes/orderRoutes');
const Order = require('../models/OrderModel');

// Mock the Order model to avoid real database interactions during tests
jest.mock('../models/OrderModel');

// Mock the validateOrder middleware to always pass validation without actual logic
jest.mock('../middlewares/validateOrderMiddleware', () => (req, res, next) => next());

// Set up an isolated Express app for testing
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
app.use('/api/orders', orderRoutes); // Mount the order routes on the /api/orders path

// Test suite
describe('Unit Test - POST /api/orders', () => {

  // Test case: Successful order placement
  it('should return 201 when an order is placed successfully', async () => {
    const mockOrder = {
      save: jest.fn().mockResolvedValue({ id: 'order123' }), // Simulate successful save
    };
    Order.mockImplementation(() => mockOrder); // Replace real implementation with the mock

    // Sample order data to send in the request
    const orderData = {
      items: [{ productId: 'product123', quantity: 2 }],
      name: 'Name Test',
      address: '123 Address',
      phone: '+12345678',
      email: 'test@test.com',
      totalAmount: 100,
    };

    const response = await request(app).post('/api/orders').send(orderData);

    // Assertions to verify the response and behavior
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Order placed successfully'); // Check success message
    expect(mockOrder.save).toHaveBeenCalled(); // Ensure the save method was called
  });

  // Test case: Error handling when saving the order fails
  it('should return 500 if saving order fails', async () => {
    Order.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Database error')), // Simulate a database error
    }));

    // Sample order data to trigger the error scenario
    const orderData = {
      items: [{ productId: 'product123', quantity: 1 }],
      name: 'Name Test',
      address: '123 Address',
      phone: '+12345678',
      email: 'test@test.com',
      totalAmount: 50,
    };

    const response = await request(app).post('/api/orders').send(orderData);

    // Assertions to verify the error handling
    expect(response.status).toBe(500); // Check if the response status is 500 (Server Error)
    expect(response.body.message).toBe('Error placing order'); // Check error message
  });
});