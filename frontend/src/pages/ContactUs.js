import React, { useState } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }
    // Handle form submission logic here
    console.log("Form submitted:", { name, email, message });
    setName("");
    setEmail("");
    setMessage("");
    setError("");
  };

  return (
    <div className="container mx-auto my-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>

      <div className="md:flex md:justify-between">
        <div className="md:w-1/2 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                placeholder="Your Email"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                rows="4"
                placeholder="Your Message"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 w-full"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="md:w-1/2 md:ml-6">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="flex items-center mb-4">
            <FaMapMarkerAlt className="text-blue-500 mr-2" />
            <p>123 E-commerce St, Suite 100, City, Country</p>
          </div>
          <div className="flex items-center mb-4">
            <FaPhone className="text-blue-500 mr-2" />
            <p>(123) 456-7890</p>
          </div>
          <div className="flex items-center mb-4">
            <FaEnvelope className="text-blue-500 mr-2" />
            <p>support@example.com</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a
                href="facebook link"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaFacebook className="mr-1" /> Facebook
              </a>
              <a
                href="twitter link"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaTwitter className="mr-1" /> Twitter
              </a>
              <a
                href="Instagram link"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaInstagram className="mr-1" /> Instagram
              </a>
              <a
                href="linkdin link"
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaLinkedin className="mr-1" /> LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
