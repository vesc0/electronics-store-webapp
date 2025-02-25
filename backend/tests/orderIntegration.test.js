const request = require('supertest');        
const mongoose = require('mongoose');        
const app = require('../server');            
const Order = require('../models/OrderModel'); 
const Product = require('../models/ProductModel');

let testProduct; // Will hold a product to use in order tests

// Setup & teardown hooks
beforeAll(async () => {
  const dbUri = process.env.MONGO_URI;
  await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a test product
  testProduct = new Product({
    name: 'Test Product',
    price: 50,
    category: 'Test Category',
  });
  await testProduct.save();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();   
  await mongoose.connection.close();          
  await new Promise(resolve => setTimeout(resolve, 500)); 
});

afterEach(async () => {
  await Order.deleteMany(); 
});

// Test Suite
describe('Integration Test - Order Creation', () => {
  it('should create an order and return 201 with confirmation message', async () => {
    const orderData = {
      items: [{ _id: testProduct._id.toString(), quantity: 2 }], // Use real product ID
      name: 'Name Test',
      address: '123 Address',
      phone: '+12345678',
      email: 'test@test.com',
    };

    const response = await request(app)
      .post('/api/orders')   
      .send(orderData);

    // Assertions
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Order placed successfully');

    // Verify order is saved in the database
    const savedOrder = await Order.findOne({ email: 'dejan@test.com' });
    expect(savedOrder).not.toBeNull();
    expect(savedOrder.name).toBe('Dejan Veselinovic');
    expect(savedOrder.totalAmount).toBe(100); // 50 (price) * 2 (quantity)
  });

  it('should return 400 if product does not exist', async () => {
    const orderData = {
      items: [{ _id: new mongoose.Types.ObjectId(), quantity: 1 }], // Non-existent product ID
      name: 'Name Test',
      address: '123 Address',
      phone: '+12345678',
      email: 'test@test.com',
    };

    const response = await request(app)
      .post('/api/orders')
      .send(orderData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Some products do not exist'); // Error from middleware
  });
});