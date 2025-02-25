import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { Metadata } from "next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

interface ProductDetailsProps {
  searchParams: { id?: string };
}

export const metadata: Metadata = {
  title: "Product Details",
};

const ProductDetails = async ({ searchParams }: ProductDetailsProps) => {
  const id = searchParams.id;

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500">Product not found.</p>
      </div>
    );
  }

  let product: Product | null = null;
  let similarProducts: Product[] = [];

  try {
    // Fetch the main product details
    const productResponse = await axios.get(
      `http://localhost:5000/api/products/${id}`
    );

    // Check that data exists
    if (!productResponse.data) {
      throw new Error("Product not found");
    }
    product = productResponse.data as Product;

    // Fetch similar products based on the product category
    const similarResponse = await axios.get(
      `http://localhost:5000/api/products/category/${product.category}`
    );
    similarProducts = similarResponse.data.filter(
      (p: Product) => p._id !== id
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 mt-14">
        {/* Breadcrumb Navigation */}
        <div className="text-sm text-gray-600 mb-6 text-center">
          <p>
            <span className="font-bold">Home</span> &gt;{" "}
            <span className="font-bold">{product.category}</span> &gt;{" "}
            <span className="font-bold">{product.name}</span>
          </p>
        </div>

        {/* Main Product Section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {/* Left: Large product image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full h-auto object-contain"
              style={{ maxHeight: "400px" }}
            />
          </div>
          {/* Right: Product details card (without image) */}
          <div className="w-full md:w-1/3">
            <ProductCard
              _id={product._id}
              name={product.name}
              category={product.category}
              price={product.price}
              imageUrl={product.imageUrl}
              hideImage={true} // Tells ProductCard not to render the image
            />
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-10 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Similar Products
          </h2>
          <div className="relative">
            {/* Horizontal scroll container */}
            <div
              id="similar-products-container"
              className="flex overflow-x-auto gap-4 px-4 scrollbar-hide"
            >
              {similarProducts.map((similarProduct) => (
                <div key={similarProduct._id} className="min-w-[250px] flex-shrink-0">
                  <ProductCard
                    _id={similarProduct._id}
                    name={similarProduct.name}
                    category={similarProduct.category}
                    price={similarProduct.price}
                    imageUrl={similarProduct.imageUrl}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows (display only; no click behavior) */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
            <FaChevronLeft className="w-5 h-5" />
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
            <FaChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;