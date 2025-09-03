'use client'

import { Suspense } from "react"
import FailureContent from "./FailureContent"

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Loading...</div>}>
      <FailureContent />
    </Suspense>
  )
}
