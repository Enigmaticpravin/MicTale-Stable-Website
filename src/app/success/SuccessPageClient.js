'use client'

import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Truck } from 'lucide-react'

export default function SuccessPageClient() {
  const params = useSearchParams()

  const txnid = params.get('txnid')
  const amount = params.get('amount') || '0'
  const orderId = params.get('orderId')
  const firstname = params.get('firstname') || 'Customer'


  return (
    <div className="min-h-screen md:mx-4 rounded-2xl md:mb-2 bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20">

        <CheckCircle2 className="mx-auto text-emerald-500 w-20 h-20 mb-6" />

        <h1 className="text-2xl font-light text-gray-800 mb-2">
          Thank you, {firstname}!
        </h1>

        <p className="text-gray-600 mb-8">
          Your book purchase was successful.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span>Order ID</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span>Amount</span>
            <span className="text-emerald-600 font-semibold">₹{amount}</span>
          </div>

          <div className="flex justify-between">
            <span>Txn</span>
            <span className="font-mono text-xs">{txnid}</span>
          </div>
        </div>

        <button className="w-full bg-emerald-600 text-white py-3 rounded-xl flex justify-center gap-2">
          <Truck className="w-4 h-4" />
          Track Order
        </button>

      </div>
    </div>
  )
}
