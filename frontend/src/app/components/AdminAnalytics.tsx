"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler, } from "chart.js";
import { FaDollarSign, FaBox, FaTags } from "react-icons/fa";
import { parseCookies } from "nookies";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, PointElement, LineElement, Filler);

const Analytics = () => {
  const [sales, setSales] = useState<number>(0);
  const [last7DaysSales, setLast7DaysSales] = useState<number[]>([]);
  const [orderCount, setOrderCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [mostOrderedItems, setMostOrderedItems] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState<any>({});
  const [paymentStatusData, setPaymentStatusData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get token
    const getToken = () => parseCookies().token;

    if (!getToken) {
      console.error("Unauthorized: Please log in as admin.");
      return;
    }

    // Fetch Analytics Data
    axios
      .get("http://localhost:5000/api/analytics", { withCredentials: true },)
      .then((response) => {
        const data = response.data;

        setSales(data.sales ?? 0);
        setLast7DaysSales(data.last7DaysSales ?? []);
        setOrderCount(data.orderCount ?? 0);
        setProductCount(data.productCount ?? 0);
        setMostOrderedItems(data.mostOrderedItems ?? []);
        setOrderStatusData(data.orderStatusData ?? {});
        setPaymentStatusData(data.paymentStatusData ?? {});
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="p-6">Loading analytics data...</div>;
  }

  const salesChartData = {
    labels: [
      "6 Days Ago",
      "5 Days Ago",
      "4 Days Ago",
      "3 Days Ago",
      "2 Days Ago",
      "Yesterday",
      "Today",
    ],
    datasets: [
      {
        label: "Sales",
        data: last7DaysSales,
        borderColor: "#3B82F6",
        backgroundColor: (context: any) => {
          const canvas = context.chart.canvas;
          const ctx = canvas.getContext("2d");

          // Define the gradient (from top to bottom)
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, "rgba(59, 131, 246, 0.48)"); // Start color (top)
          gradient.addColorStop(1, "rgba(228, 228, 228, 0)");   // End color (bottom)
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#3B82F6",
        tension: 0.2,
        fill: true,
      },
    ],
  };

  const deliveryChartData = {
    labels: ["Delivered", "Canceled", "Processing"],
    datasets: [
      {
        label: "Orders",
        data: [
          orderStatusData?.delivered || 0,
          orderStatusData?.canceled || 0,
          orderStatusData?.processing || 0,
        ],
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          const { dataIndex } = context;

          // Define the gradients for each status
          const gradients = [
            { start: "#2D9B6C", middle: "#34D399", end: "#6EE7B7" }, // Green for Delivered
            { start: "#D94C4C", middle: "#F87171", end: "#FCA5A5" }, // Red for Canceled
            { start: "#1E40AF", middle: "#60A5FA", end: "#93C5FD" }, // Blue for Processing
          ];

          if (!chartArea) {
            return gradients[dataIndex].start;
          }

          // Create the gradient for the current bar
          const gradient = ctx.createLinearGradient(
            chartArea.left,
            chartArea.top,
            chartArea.left,
            chartArea.bottom
          );
          gradient.addColorStop(0, gradients[dataIndex].start);
          gradient.addColorStop(0.5, gradients[dataIndex].middle);
          gradient.addColorStop(1, gradients[dataIndex].end);
          return gradient;
        },
        borderRadius: 5,
        barThickness: 40,
      },
    ],
  };

  const paymentChartData = {
    labels: ["Payed", "Failed", "Awaiting"],
    datasets: [
      {
        label: "Orders",
        data: [
          paymentStatusData?.payed || 0,
          paymentStatusData?.failed || 0,
          paymentStatusData?.awaiting || 0,
        ],
        backgroundColor: ["#10B981", "#F87171", "#60A5FA"],
        hoverOffset: 10,
      },
    ],
  };

  const doughnutChartData = {
    labels: (mostOrderedItems || []).map((item: { name: string }) => item.name),
    datasets: [
      {
        label: "Ordered",
        data: (mostOrderedItems || []).map(
          (item: { quantity: number }) => item.quantity
        ),
        backgroundColor: [
          "#10B981",
          "#3B82F6",
          "#F59E0B",
          "#EF4444",
          "#9CA3AF",
        ],
        hoverOffset: 10,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        bodyColor: "#F9FAFB",
        titleColor: "#F9FAFB",
        borderColor: "#4B5563",
        borderWidth: 1,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#E5E7EB" }, beginAtZero: true },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        bodyColor: "#F9FAFB",
        titleColor: "#F9FAFB",
        borderColor: "#4B5563",
        borderWidth: 1,
      },
    },
  };

  const salesChartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        title: { display: false },
        border: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { display: false },
        title: { display: false },
        border: { display: false },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-gray-800 min-h-screen">
      {/* Sales Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold">Sales</h3>
              <p className="text-xl font-bold">${sales.toFixed(2)}</p>
            </div>
            <FaDollarSign className="text-blue-600 text-3xl" />
          </div>
          <div className="w-full h-48 mt-4">
            <Line data={salesChartData} options={salesChartOptions} />
          </div>
        </div>

        {/* Products and Orders */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Products</h3>
              <p className="text-2xl font-bold">{productCount}</p>
            </div>
            <FaTags className="text-yellow-600 text-4xl" />
          </div>
          <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Orders</h3>
              <p className="text-2xl font-bold">{orderCount}</p>
            </div>
            <FaBox className="text-green-600 text-4xl" />
          </div>
        </div>

        {/* Most Ordered Items */}
        <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Most Ordered Items</h3>
          <div className="w-full h-64 flex items-center justify-center">
            <Doughnut data={doughnutChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>

      {/* Order Delivery Status and Payment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Order Delivery Status Overview
          </h3>
          <div className="w-full h-64">
            <Bar data={deliveryChartData} options={barChartOptions} />
          </div>
        </div>
        <div className="bg-gray-400 bg-opacity-30 backdrop-blur-md shadow-lg rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">
            Order Payment Status Overview
          </h3>
          <div className="w-full h-64 flex items-center justify-center">
            <Pie data={paymentChartData} options={pieChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;