"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { parseCookies } from "nookies";

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  name: string;
  address: string;
  phone: string;
  totalAmount: number;
  date: string;
  paymentStatus: string;
  deliveryStatus: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 4;
  const getToken = () => parseCookies().token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        if (!getToken) {
          setError("Unauthorized: Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/orders", { withCredentials: true });
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (id: string, field: string, value: string) => {
    try {

      await axios.patch(
        `http://localhost:5000/api/orders/${id}`,
        { [field]: value },
        { withCredentials: true },
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, [field]: value } : order
        )
      );
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
    }
  };

  const removeOrder = async (id: string) => {
    try {

      await axios.delete(`http://localhost:5000/api/orders/${id}`, { withCredentials: true });
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err) {
      console.error("Error removing order:", err);
    }
  };

  const getPaymentIcon = (status: string) => {
    switch (status) {
      case "payed":
        return <FaCheckCircle className="text-green-500" />;
      case "failed":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-blue-500" />;
    }
  };

  const paymentStatusOptions = ["awaiting", "payed", "failed"];
  const deliveryStatusOptions = ["processing", "delivered", "canceled"];

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders
    .filter((order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(
    orders.filter((order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / ordersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search orders by customer name"
        className="block w-full max-w-lg mx-auto border rounded-md px-4 py-2 mb-4"
      />

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center">No orders found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-gray-300 mb-4 min-w-[800px]">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-3 py-2 border-b">Date</th>
                  <th className="px-3 py-2 border-b">Customer</th>
                  <th className="px-3 py-2 border-b">Ordered Items</th>
                  <th className="px-3 py-2 border-b">Delivery Fee</th>
                  <th className="px-3 py-2 border-b">Total Amount</th>
                  <th className="px-3 py-2 border-b">Payment</th>
                  <th className="px-3 py-2 border-b">Delivery</th>
                  <th className="px-3 py-2 border-b">Remove</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="text-center">
                    <td className="px-3 py-2 border-b break-words max-w-[120px]">
                      {new Date(order.date).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 border-b break-words max-w-[200px]">
                      <div>{order.name}</div>
                      <div>{order.address}</div>
                      <div>{order.phone}</div>
                    </td>
                    <td className="px-3 py-2 border-b break-words max-w-[250px]">
                      <ul className="pl-4 list-disc text-left">
                        {order.items.map((item) => (
                          <li key={item._id}>
                            {item.name} - {item.quantity}x ${item.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-3 py-2 border-b break-words max-w-[100px]">
                      ${order.totalAmount >= 19 ? 0 : 5}
                    </td>
                    <td className="px-3 py-2 border-b break-words max-w-[100px]">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-3 py-2 text-center border-b break-words max-w-[150px]">
                      <div className="flex items-center justify-center gap-2">
                        {getPaymentIcon(order.paymentStatus)}
                        <select
                          className="border rounded-md px-2 py-1"
                          value={order.paymentStatus}
                          onChange={(e) =>
                            updateStatus(order._id, "paymentStatus", e.target.value)
                          }
                        >
                          {paymentStatusOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center border-b break-words max-w-[150px]">
                      <select
                        className={`px-2 py-1 rounded ${order.deliveryStatus === "delivered"
                          ? "bg-green-500 text-white"
                          : order.deliveryStatus === "canceled"
                            ? "bg-red-500 text-white"
                            : "bg-blue-500 text-white"
                          }`}
                        value={order.deliveryStatus}
                        onChange={(e) =>
                          updateStatus(order._id, "deliveryStatus", e.target.value)
                        }
                      >
                        {deliveryStatusOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-center border-b break-words max-w-[100px]">
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={() => removeOrder(order._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`px-3 py-1 rounded ${currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
                  }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );


};

export default Orders;