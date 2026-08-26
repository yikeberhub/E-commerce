import React, { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiCheckCircle } from "react-icons/fi";
import { inputClass } from "../common/formStyles";

const API_URL = process.env.REACT_APP_API_URL;

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const response = await fetch(`${API_URL}/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error("Failed to send your message. Please try again.");
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="text-sm text-slate-500 mt-1">
          We'd love to hear from you
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Get in Touch
          </h2>

          {sent ? (
            <div className="flex flex-col items-center text-center gap-2 py-6">
              <FiCheckCircle className="text-emerald-500 text-4xl" />
              <p className="text-sm text-slate-600">
                Thanks for reaching out! We'll get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline mt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="text-red-500 text-xs bg-red-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClass} min-h-[110px]`}
                  placeholder="Your Message"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Contact Information
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                <FiMapPin className="text-sm" />
              </span>
              <p className="text-sm text-slate-700">Bahir Dar, Ethiopia</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                <FiPhone className="text-sm" />
              </span>
              <a href="tel:+251946472687" className="text-sm text-slate-700 hover:text-primary-600 transition">
                +251 94 647 2687
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                <FiMail className="text-sm" />
              </span>
              <a href="mailto:yikeber50@gmail.com" className="text-sm text-slate-700 hover:text-primary-600 transition">
                yikeber50@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
