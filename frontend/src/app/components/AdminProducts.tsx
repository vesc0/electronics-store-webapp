"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

const Products = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleProductDelete = (productId: string) => {
    axios
      .delete(`http://localhost:5000/api/products/${productId}`, { withCredentials: true })
      .then(() => {
        setProducts(products.filter((p) => p._id !== productId));
      })
      .catch((error) => console.error("Error deleting product:", error));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload

    // Input validation
    if (name.length > 24) {
      setError("Name should not exceed 24 characters.");
      return;
    }
    if (category.length > 15) {
      setError("Category should not exceed 15 characters.");
      return;
    }
    if (typeof price !== "number" || price < 0 || price > 9999) {
      setError("Price should be a number between 0 and 9999.");
      return;
    }

    // Create product
    const productData = { name, category, price, imageUrl };

    // Clear any previous error messages
    setError("");

    // If the product is being edited make a PUT, if not make a POST request
    const apiCall = editingProduct
      ? axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        productData,
        { withCredentials: true },
      )
      : axios.post("http://localhost:5000/api/products", productData,
        { withCredentials: true });

    // If editing, update product, if not add a new one to the array
    apiCall
      .then((response) => {
        if (editingProduct) {
          setProducts(
            products.map((p) => (p._id === editingProduct._id ? response.data : p))
          );
        } else {
          setProducts([...products, response.data]);
        }
        closePopup();
      })
      .catch((error) => console.error("Error saving product:", error));
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingProduct(null);
    setName("");
    setCategory("");
    setPrice("");
    setImageUrl("");
  };

  const openPopup = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setImageUrl(product.imageUrl);
    }
    setIsPopupOpen(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleImageUpload = async (file: File) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/cloudinary-signature",
        { withCredentials: true },
      );

      const { signature, timestamp } = response.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "product_images");
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("api_key", "531999378434348");

      const uploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/di1iro2u2/image/upload",
        formData
      );

      setImageUrl(uploadResponse.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products"
          className="border rounded-md px-4 py-2 w-1/2"
        />
        <button
          onClick={() => openPopup()}
          className="bg-gray-800 text-white hover:bg-gray-500 transition-colors px-4 py-2 rounded-md"
        >
          Add Product
        </button>
      </div>

      {currentProducts.length === 0 ? (
        <p className="text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentProducts.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 text-center">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-32 object-contain mb-2"
              />
              <h3 className="font-bold">{product.name}</h3>
              <p>{product.category}</p>
              <p>${product.price.toFixed(2)}</p>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={() => openPopup(product)}
                  className="bg-gray-800 text-white hover:bg-gray-500 transition-colors px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleProductDelete(product._id)}
                  className="bg-red-600 text-white hover:bg-red-400 transition-colors px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <button
              onClick={closePopup}
              className="text-red-500 text-right w-full mb-3"
            >
              Close
            </button>
            <form onSubmit={handleSubmit} className="space-y-4 text-center">
              {error && <div className="text-red-500 text-center">{error}</div>}
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={24}
                placeholder="Product name"
                className="block w-full border rounded-md px-4 py-2"
              />
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={15}
                placeholder="Product category"
                className="block w-full border rounded-md px-4 py-2"
              />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                max="9999"
                placeholder="Product price"
                className="block w-full border rounded-md px-4 py-2"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                className="block w-full border rounded-md px-4 py-2"
              />

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="w-full h-32 object-contain my-2"
                />
              )}
              <button
                type="submit"
                className="bg-gray-800 text-white hover:bg-gray-500 transition-colors px-4 py-2 rounded-md w-1/2"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;