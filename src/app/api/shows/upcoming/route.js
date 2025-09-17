import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function GET() {
  try {
    const showsRef = adminDb.collection('shows');
    const today = new Date().toISOString();
    
    const snapshot = await showsRef
      .where('date', '>', today)
      .orderBy('date', 'asc')
      .get();

    const shows = [];
    snapshot.forEach(doc => {
      shows.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return NextResponse.json({ shows });
  } catch (error) {
    console.error('Shows API error:', error);
    return NextResponse.json({ shows: [] }, { status: 500 });
  }
}