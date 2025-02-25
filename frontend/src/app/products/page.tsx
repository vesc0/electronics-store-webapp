"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import { FaSearch } from "react-icons/fa";
import Footer from "../components/Footer";

interface Product {
    _id: string;
    name: string;
    category: string;
    price: number;
    imageUrl: string;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("price-asc");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [visibleCount, setVisibleCount] = useState<number>(12);

    useEffect(() => {
        axios
            .get<Product[]>("http://localhost:5000/api/products")
            .then((response) => {
                setProducts(response.data);
                setFilteredProducts(response.data);

                const uniqueCategories = Array.from(
                    new Set(response.data.map((p) => p.category))
                );
                setCategories(uniqueCategories);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = [...products];

        if (selectedCategory !== "") {
            result = result.filter((product) => product.category === selectedCategory);
        }

        if (searchQuery) {
            result = result.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortOrder === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        }

        setFilteredProducts(result);
    }, [selectedCategory, sortOrder, searchQuery, products]);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 12);
    };

    return (

        <div>
            <Navbar />

            <div className="mb-2 mt-16 p-4 flex flex-col md:flex-row md:items-center md:gap-8 ml-10 mr-10">

                <div className="flex-1 mb-6 md:mb-0 md:w-3/4">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="block w-full md:w-full lg:w-2/3 border border-gray-300 rounded-md shadow-sm focus:ring-gray-700 focus:border-gray-700 sm:text-lg pl-10 pr-4 py-2"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                            <FaSearch className="w-5 h-5" />
                        </span>
                    </div>
                </div>

                <div className="md:w-1/8 mb-6 md:mb-0 md:ml-20">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-lg p-2"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="md:w-1/8 mb-6 md:mb-0">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-lg p-2"
                    >
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
                    {Array(8)
                        .fill(0)
                        .map((_, index) => (
                            <div
                                key={index}
                                className="animate-pulse p-4 border rounded-md shadow-sm bg-gray-200"
                            >
                                <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
                                <div className="h-6 bg-gray-300 rounded-md mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded-md mb-2"></div>
                                <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
                            </div>
                        ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-10">
                        {filteredProducts.slice(0, visibleCount).map((product) => (
                            <ProductCard
                                key={product._id}
                                _id={product._id}
                                name={product.name}
                                category={product.category}
                                price={product.price}
                                imageUrl={product.imageUrl}
                            />
                        ))}
                    </div>

                    {visibleCount < filteredProducts.length && (
                        <div className="flex justify-center mb-10">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                            >
                                Load More
                            </button>
                        </div>

                    )}
                </>
            )}
            <Footer />
        </div>
    );

};

export default ProductsPage;