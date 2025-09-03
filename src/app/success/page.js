'use client'

import { Suspense } from "react"
import SuccessContent from "./SuccessContent"

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
