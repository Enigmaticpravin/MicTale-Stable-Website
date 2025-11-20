"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";

const ContactForm = () => {
  const [feedback, setFeedback] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!res.ok) throw new Error("Failed");

      setFeedback("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const poppinsStyle = { fontFamily: "Poppins, sans-serif" };

  return (
    <div className="flex items-center justify-center p-4 mt-5 md:mt-20 md:mb-24">
      <div className="w-full flex flex-col items-center justify-center max-w-6xl gap-6">
        <div className="justify-center items-center flex flex-col">
          <p
            className="uppercase text-transparent bg-clip-text bg-gradient-to-t font-semibold text-[12px] md:text-[18px] from-yellow-700 via-yellow-500 to-yellow-900"
            style={poppinsStyle}
          >
            Give us a feedback
          </p>
          <p className="md:hidden text-transparent bg-clip-text bg-gradient-to-t font-semibold text-2xl md:text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular">
            We take you very seriously, unlike our government
          </p>
          <p className="hidden md:flex text-transparent bg-clip-text bg-gradient-to-t font-semibold text-4xl text-center from-slate-200 via-gray-400 to-white elsie-regular">
            We take you very seriously, <br></br> unlike our government
          </p>
        </div>

        {showSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ease-in-out animate-slide-in">
            Thank you for your feedback!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-8 space-y-6"
        >
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback..."
            className="w-full bg-gray-700/50 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full cursor-pointer bg-blue-600/50 hover:bg-blue-700/60 text-white py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <Send size={20} />
            <span>Submit Feedback</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
