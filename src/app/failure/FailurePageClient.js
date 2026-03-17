'use client'

import { useSearchParams } from 'next/navigation'
import { XCircle, RefreshCw, Home } from 'lucide-react'
import { useEffect } from 'react'

export default function FailurePageClient() {
  const params = useSearchParams()

  const txnid = params.get('txnid')
  const amount = params.get('amount') || '0'
  const orderId = params.get('orderId')
  const firstname = params.get('firstname') || 'Customer'

  useEffect(() => {
    if (!orderId || !txnid) return

    fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        txnid,
        status: 'failed'
      })
    })
  }, [orderId, txnid])

  return (
    <div className="min-h-screen bg-gradient-to-br md:mx-4 rounded-2xl md:mb-2 from-red-50 via-white to-rose-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center">

        <XCircle className="mx-auto text-red-500 w-20 h-20 mb-6" />

        <h1 className="text-2xl text-gray-800 mb-2">
          Sorry, {firstname}
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment failed. You can retry or return home.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-6 text-left space-y-3">
          <div className="flex justify-between">
            <span>Order</span>
            <span className="font-mono text-sm">{orderId}</span>
          </div>

          <div className="flex justify-between">
            <span>Amount</span>
            <span className="text-red-600">₹{amount}</span>
          </div>

          <div className="flex justify-between">
            <span>Txn</span>
            <span className="font-mono text-xs">{txnid}</span>
          </div>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white py-3 rounded-xl flex justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="w-full border py-3 rounded-xl flex justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Home
          </button>

        </div>

      </div>
    </div>
  )
}
