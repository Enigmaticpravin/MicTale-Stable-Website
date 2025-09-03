'use client'

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, AlertTriangle } from "lucide-react";
import { collection, getDocs, db } from "@/app/lib/firebase";

export default function FailureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [paymentData, setPaymentData] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [participantDetails, setParticipantDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const txnid = searchParams.get("txnid");
    const amount = searchParams.get("amount");
    const firstname = searchParams.get("firstname");
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");
    const status = searchParams.get("status");

    if (txnid) {
      setPaymentData({ txnid, amount, firstname, email, phone, status });
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, router]);

  function formatDateTime(dateTime) {
    const dateObj = new Date(dateTime);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('en-US', { month: 'long' });
    let hours = dateObj.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {
      date: `${day} ${month}`,
      time: `${hours.toString().padStart(2, '0')} ${ampm}`
    };
  }

  const { date, time } = formatDateTime(showDetails?.date || new Date());

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl moving-gradient-1' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl moving-gradient-2' />
      </div>

      <div className="w-full min-h-screen md:min-h-fit md:max-w-4xl bg-white py-4 px-8 rounded-t-xl md:rounded-xl">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="text-gray-500">We could not process your payment for the Open Mic slot</p>
        </div>

        {paymentData ? (
          <div className="space-y-6 mt-5">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <div className="flex items-center space-x-2 text-red-700 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Transaction Failed</span>
              </div>
              <p className="text-sm text-red-600">
                Your payment was unsuccessful. You have not been charged.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-medium text-gray-900">{paymentData.txnid}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount</p>
                  <p className="font-medium text-gray-900">₹{paymentData.amount}</p>
                </div>
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{paymentData.firstname}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 truncate">{paymentData.email}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Automatically redirecting in {countdown} seconds...
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        )}
      </div>
    </div>
  );
}
