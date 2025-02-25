import { FaFacebookF, FaInstagram, FaTwitter, FaGithub, FaYoutube, FaTiktok } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-900 py-8 border-t">
      <div className="container text-center mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* Logo and Description */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <div className="flex justify-center space-x-2">
              <span className="text-xl font-bold px-4">ELECTRONICS STORE</span>
            </div>
            <p className="text-gray-600 p-4">
              Explore cutting-edge devices and unbeatable deals. Shop the latest gadgets now.
            </p>
            <div className="flex justify-center space-x-4 mt-4 px-3">
              {/* Social icons */}
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaX className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaTiktok className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          <div className="w-full md:w-3/4 flex flex-wrap justify-between px-4">
            <div className="w-1/2 md:w-1/4">
              <h5 className="font-bold mb-3">Store</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Products</a></li>
                <li><a href="#" className="hover:text-gray-900">Orders</a></li>
                <li><a href="#" className="hover:text-gray-900">Delivery</a></li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/4">
              <h5 className="font-bold mb-3">Support</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Submit a ticket</a></li>
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">Guides</a></li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/4">
              <h5 className="font-bold mb-3">Company</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Jobs</a></li>
              </ul>
            </div>
            <div className="w-1/2 md:w-1/4">
              <h5 className="font-bold mb-3">Legal</h5>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Terms of service</a></li>
                <li><a href="#" className="hover:text-gray-900">Privacy policy</a></li>
                <li><a href="#" className="hover:text-gray-900">License</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <hr className="my-4 border-gray-300 ml-8 mr-8 mt-10" />
        <div className="text-center text-gray-600">
          &copy; 2025 Electronics Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
