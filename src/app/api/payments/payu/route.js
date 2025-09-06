import crypto from "crypto";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, productInfo, firstname, email, phone, orderId } = body;

    const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY;
    const PAYU_SALT = process.env.PAYU_SALT;
    const PAYU_URL = "https://secure.payu.in/_payment";
    const txnId = "Txn" + new Date().getTime();

    const hashString = `${PAYU_MERCHANT_KEY}|${txnId}|${amount}|${productInfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

    const paymentData = {
      key: PAYU_MERCHANT_KEY,
      txnid: txnId,
      amount: amount,
      productinfo: productInfo,
      firstname: firstname,
      email: email,
      phone: phone,
      orderId: orderId,
      surl: `${baseUrl}/api/payments/status?txnid=${txnId}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=success`,
      furl: `${baseUrl}/api/payments/status?txnid=${txnId}&amount=${amount}&orderId=${orderId}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failure`,
      hash: hash,
      action: PAYU_URL,
    };

    return NextResponse.json(paymentData);
  } catch (err) {
    console.error("PAYU POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
