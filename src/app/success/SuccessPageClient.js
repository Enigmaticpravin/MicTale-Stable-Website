'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Truck } from 'lucide-react';

export default function SuccessPageClient() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || 'Processing';
  const amount = searchParams.get('amount') || '0';
  const orderId = searchParams.get('orderId') || 'N/A';
  const firstname = searchParams.get('firstname') || 'Customer';

  return (
    <div className="min-h-screen md:mx-4 rounded-2xl md:mb-2 bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full w-20 h-20 mx-auto animate-ping opacity-20"></div>
          <CheckCircle2 className="mx-auto text-emerald-500 w-20 h-20 relative z-10" />
        </div>

        <h1 className="text-2xl font-light text-gray-800 mb-2">
          Thank you, {firstname}!
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your book purchase was successful. We will deliver your order soon.
        </p>

        <div className="bg-gray-50/70 rounded-xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Order ID</span>
            <span className="font-mono text-sm text-gray-800">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Amount</span>
            <span className="font-semibold text-emerald-600">₹{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Transaction ID</span>
            <span className="font-mono text-xs text-gray-600">{txnid}</span>
          </div>
        </div>

        <div className="gap-3 flex flex-row w-full">
          <button
            onClick={() => alert('Order tracking functionality would be implemented here')}
            className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <Truck className="w-4 h-4" />
            Track Your Order
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact us at{' '}
          <span className="font-semibold text-blue-800 cursor-pointer">
            contact@mictale.in
          </span>
        </p>
      </div>
    </div>
  );
}
