import crypto from "crypto"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

export async function POST(req) {
  const formData = await req.formData()

  const status = formData.get("status")
  const txnid = formData.get("txnid")
  const amount = formData.get("amount")
  const firstname = formData.get("firstname")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const productinfo = formData.get("productinfo")
  const receivedHash = formData.get("hash")
  const orderId = formData.get("udf1")

  console.log("🔥 PAYU CALLBACK RECEIVED:", {
    status,
    txnid,
    amount,
    orderId
  })

  if (!orderId || !txnid || !receivedHash) {
    console.error("Missing critical PayU fields")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/failure?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failed`
    )
  }


  const PAYU_SALT = process.env.PAYU_SALT

  const reverseHashString =
    `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_MERCHANT_KEY}`

  const calculatedHash = crypto
    .createHash("sha512")
    .update(reverseHashString)
    .digest("hex")

  if (calculatedHash !== receivedHash) {
    console.error("⚠️ HASH MISMATCH - POSSIBLE TAMPERING")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/failure?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failed`
    )
  }


  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("status")
    .eq("order_id", orderId)
    .single()

  if (!existingOrder) {
    console.error("Order not found:", orderId)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/failure?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failed`
    )
  }

  if (existingOrder.status === "paid") {
    console.log("Order already marked paid")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/success?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=success`
    )
  }

  if (status === "success") {
    await supabase
      .from("orders")
      .update({
        status: "paid",
        txnid,
        paid_at: new Date().toISOString()
      })
      .eq("order_id", orderId)

    console.log("✅ Order marked as PAID")

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? ""
    try {
      await fetch(`${baseUrl}/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: firstname,
          txnid,
          amount: amount ?? "0"
        })
      })
    } catch (err) {
      console.error("Failed to send order confirmation email:", err)
    }

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/success?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=success`
    )
  }

  await supabase
    .from("orders")
    .update({
      status: "failed",
      txnid
    })
    .eq("order_id", orderId)

  console.log("❌ Order marked as FAILED")

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/failure?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failed`
  )
}
