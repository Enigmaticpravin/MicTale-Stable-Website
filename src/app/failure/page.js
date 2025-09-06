"use client";

import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCw, Home } from "lucide-react";
import Footer from "../components/Footer";

export default function FailurePage() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get("txnid");
  const amount = searchParams.get("amount");
  const orderId = searchParams.get("orderId");
  const firstname = searchParams.get("firstname");
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");
  const status = searchParams.get("status");

  return (
   
    <> <div className="min-h-screen bg-gradient-to-br md:mr-4 md:ml-4 rounded-2xl md:mb-2 from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
        {/* Failure Icon */}
        <div className="relative mb-6">
          <XCircle className="mx-auto text-red-500 w-20 h-20" />
        </div>

        {/* Failure Message */}
        <h1 className="text-2xl font-light text-gray-800 mb-2">
          Sorry, {firstname}
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your book order could not be completed. Please try again or contact our support team for assistance.
        </p>

        {/* Transaction Details */}
        <div className="bg-gray-50/70 rounded-xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Order ID</span>
            <span className="font-mono text-sm text-gray-800">{orderId || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Amount</span>
            <span className="font-semibold text-red-600">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Transaction ID</span>
            <span className="font-mono text-xs text-gray-600">{txnid || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Status</span>
            <span className="text-red-500 text-sm font-medium">{status || "Failed"}</span>
          </div>
        </div>

     <div className="flex flex-row gap-3 w-full">
  <button
    onClick={() => window.location.reload()}
    className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
  >
    <RefreshCw className="w-4 h-4" />
    Try Again
  </button>

  <button
    onClick={() => (window.location.href = "/")}
    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
  >
    <Home className="w-4 h-4" />
    Go Home
  </button>
</div>


        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact us at support@example.com
        </p>
      </div>
    </div>
      <Footer />
    </>
  );
}