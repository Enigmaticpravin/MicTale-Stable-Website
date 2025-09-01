import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export const runtime = "nodejs";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const qp = url.searchParams;

    const txnid = qp.get("txnid");
    const amount = qp.get("amount");
    const firstname = qp.get("firstname");
    const email = qp.get("email");
    const phone = qp.get("phone");
    const status = qp.get("status");
    const bookingId = qp.get("bookingId");

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
    const successUrl = `${baseUrl}/success?txnid=${txnid}&amount=${amount}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=success`;
    const failureUrl = `${baseUrl}/failure?txnid=${txnid}&amount=${amount}&firstname=${encodeURIComponent(firstname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&status=failure`;

    console.log("Payment callback:", { txnid, amount, status, bookingId });

    if (status === "success") {
      try {
        const emailResp = await fetch(`${baseUrl}/api/sendEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            name: firstname,
            txnid,
            amount,
          }),
        });

        if (!emailResp.ok) {
          console.warn("Email API returned status", emailResp.status);
        } else {
          console.log("Email API response:", await emailResp.json());
        }

        const q = query(collection(db, "tickets"), where("bookingId", "==", bookingId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const ticketDoc = snapshot.docs[0];
          await updateDoc(ticketDoc.ref, { paymentStatus: "successful" });
          console.log(`Updated booking ${bookingId} to 'successful'`);
        } else {
          console.warn(`No booking found for bookingId: ${bookingId}`);
        }
      } catch (error) {
        console.error("Error handling success flow:", error);
      }
    } else if (status === "failure") {
      try {
        const q = query(collection(db, "tickets"), where("bookingId", "==", bookingId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const ticketDoc = snapshot.docs[0];
          await updateDoc(ticketDoc.ref, { paymentStatus: "failed" });
          console.log(`Updated booking ${bookingId} to 'failed'`);
        } else {
          console.warn(`No booking found for bookingId: ${bookingId}`);
        }
      } catch (error) {
        console.error("Error handling failure flow:", error);
      }
    } else {
      console.warn("Unknown payment status:", status);
    }

    return NextResponse.redirect(status === "success" ? successUrl : failureUrl, 303);
  } catch (err) {
    console.error("Status handler error:", err);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
    return NextResponse.redirect(`${baseUrl}/failure`, 303);
  }
}
