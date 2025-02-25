import axios from "axios";
import ProductCard from "./components/ProductCard";
import Navbar from "./components/Navbar";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Banner from "./components/Banner";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
}

const Home = async () => {
  let accessories: Product[] = [];
  let sensors: Product[] = [];

  try {
    const [accessoriesRes, sensorsRes] = await Promise.all([
      axios.get<Product[]>("http://localhost:5000/api/products/category/Accessories"),
      axios.get<Product[]>("http://localhost:5000/api/products/category/Sensors"),
    ]);

    accessories = accessoriesRes.data;
    sensors = sensorsRes.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const renderCategory = (categoryProducts: Product[], categoryLabel: string) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold ml-8 mb-4">{categoryLabel}</h3>
      <div className="relative">
        <div id={`${categoryLabel}-scroll`} className="flex overflow-x-auto space-x-4 scrollbar-hide ml-8 mr-8">
          {categoryProducts.map((product) => (
            <div
              key={product._id}
              className="min-w-[250px] max-w-[250px] flex-shrink-0"
            >
              <ProductCard
                _id={product._id}
                name={product.name}
                category={product.category}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            </div>
          ))}
        </div>
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none"
        >
          <FaChevronLeft className="w-5 h-5" />
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none"
        >
          <FaChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <Banner />
      <div className="px-4 mt-4 ml-4 mr-4">
        <h1 className="text-2xl font-semibold mb-4">Popular categories</h1>
        {renderCategory(accessories, "Accessories")}
        {renderCategory(sensors, "Sensors")}
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Home;