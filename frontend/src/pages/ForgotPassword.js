import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiKey, FiExternalLink } from "react-icons/fi";
import { inputClass } from "../common/formStyles";

const API_URL = process.env.REACT_APP_API_URL;

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users/password_reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      const data = await response.json();
      setSent(true);
      setDevResetUrl(data.reset_url || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-50 text-primary-600 mb-3">
              <FiKey className="text-xl" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900">
              Forgot your password?
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Enter your email and we'll send you a link to reset it.
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-4 py-3">
                If an account exists for <strong>{email}</strong>, we've sent
                a password reset link to that address.
              </p>

              {devResetUrl && (
                <div className="text-xs text-amber-700 bg-amber-50 rounded-lg px-4 py-3">
                  <p className="font-semibold mb-1">
                    Development mode — no email server configured
                  </p>
                  <p className="mb-2">
                    Use this link directly to test the reset flow:
                  </p>
                  <a
                    href={devResetUrl}
                    className="inline-flex items-center gap-1 text-primary-600 font-medium hover:underline break-all"
                  >
                    <FiExternalLink className="shrink-0" /> {devResetUrl}
                  </a>
                </div>
              )}

              <Link
                to="/login"
                className="text-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`${inputClass} pl-9`}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs mt-1.5">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <Link
                to="/login"
                className="text-center text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
              >
                Back to login
              </Link>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
