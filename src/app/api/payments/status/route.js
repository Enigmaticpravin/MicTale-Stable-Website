// app/api/payments/status/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData);

    const {
      txnid,
      amount,
      firstname,
      email,
      phone,
      status,
      orderId,
      productinfo,
    } = data;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    const successUrl = `${baseUrl}/success?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=success`;
    const failureUrl = `${baseUrl}/failure?txnid=${txnid}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failure`;

    console.log("Payment callback:", data);

    // 🔹 Optional: send email
    try {
      const emailResp = await fetch(`${baseUrl}/api/sendEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: status,
          email,
          name: firstname,
          orderId,
          txnid,
          amount,
          productInfo: productinfo || "",
          phone,
        }),
      });

      if (!emailResp.ok) {
        console.warn("Email API returned status", emailResp.status);
      } else {
        console.log("Email sent successfully");
      }
    } catch (err) {
      console.error("Error sending email:", err);
    }

    return NextResponse.redirect(status === "success" ? successUrl : failureUrl, 303);
  } catch (err) {
    console.error("Status handler error:", err);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
    return NextResponse.redirect(`${baseUrl}/failure`, 303);
  }
}
