import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase-db";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { feedback } = await req.json();

    await addDoc(collection(db, "feedbacks"), {
      feedback,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding feedback", error);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}