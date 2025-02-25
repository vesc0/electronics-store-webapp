"use client";

import { useCart } from '../context/CartContext';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
      };

      await axios.post('http://localhost:5000/api/orders', orderData);

      clearCart();

      toast.success('Your order has been placed successfully! You will get an email soon!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place the order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = totalAmount > 19 ? 0 : 5;
  const totalWithDelivery = totalAmount + deliveryFee;
  const taxAmount = totalAmount - (totalAmount / 1.2);

  return (
    <div>
      <Navbar />
      <div className="p-4 mt-12 min-h-screen flex flex-col items-center">
        <h1 className="text-3xl font-bold mt-3 mb-3">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Your cart is empty.</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 w-1/2">Item</th>
                    <th className="py-2 px-4 w-1/6">Price</th>
                    <th className="py-2 px-4 w-1/6">Quantity</th>
                    <th className="py-2 px-4 w-1/6">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item._id} className="border-b">
                      <td className="py-2 px-4 flex items-center space-x-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-contain"
                        />
                        <span className="truncate">{item.name}</span>
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center space-x-1">
                          <button
                            className="px-2 py-1 bg-gray-200 rounded-md"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="mx-2 w-8 text-center">{item.quantity}</span>
                          <button
                            className="px-2 py-1 bg-gray-200 rounded-md"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-2 px-4 whitespace-nowrap">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeFromCart(item._id)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 w-full max-w-md ml-auto">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-semibold">Subtotal:</span>
                  <span className="ml-4">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-semibold">Included Tax (20%):</span>
                  <span className="ml-4">${(taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-semibold">Delivery:</span>
                  <span className="ml-4">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold mt-3">
                  <span>Total:</span>
                  <span className="ml-4">${totalWithDelivery.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 flex flex-col space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-md p-3"
                  required
                />

                <div className="flex flex-col md:flex-row md:space-x-3 space-y-3 md:space-y-0">
                  <button
                    type="button"
                    onClick={() => router.push("/products")}
                    className="w-full md:w-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-500 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    type="submit"
                    className="w-full md:w-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-gray-500 transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Placing Order..." : "Place Order"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}
        <ToastContainer position="top-center" hideProgressBar />
      </div>
      <Footer />
    </div>
  );

};

export default CartPage;