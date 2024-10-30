import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-gray-800 py-6 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                About Us
              </a>
            </p>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                Careers
              </a>
            </p>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                Privacy Policy
              </a>
            </p>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                Terms of Service
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                Shop
              </a>
            </p>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                Contact Us
              </a>
            </p>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                FAQ
              </a>
            </p>
            <p className="mb-2">
              <a href="#" className="hover:text-blue-600">
                Returns
              </a>
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="mb-2">
              Email:{" "}
              <a
                href="mailto:support@example.com"
                className="hover:text-blue-600"
              >
                support@example.com
              </a>
            </p>
            <p className="mb-2">Phone: (123) 456-7890</p>
            <p className="mb-2">
              Address: 123 E-commerce St, Suite 100, City, Country
            </p>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="mb-2">
              Sign up for our newsletter to receive updates and offers.
            </p>
            <input
              type="email"
              placeholder="Your Email"
              className="p-2 rounded bg-white border border-gray-300 w-full mb-2"
            />
            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-full">
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-400 pt-4 text-center">
          <div className="flex justify-center space-x-4 mb-2">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaFacebook />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaTwitter />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaLinkedin />
            </a>
          </div>
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Your Company Name. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
