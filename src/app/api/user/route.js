// app/api/user/route.js
import { NextResponse } from "next/server";
import { getUser } from "@/app/lib/getUser";
import { adminDb } from "@/app/lib/firebaseAdmin";

export async function GET() {
  try {
    const sessionUser = await getUser();
    
    if (!sessionUser) {
      return NextResponse.json({ user: null });
    }

    const userRef = adminDb.collection('users').doc(sessionUser.uid);
    const userDoc = await userRef.get();

    let userData;

    if (userDoc.exists) {
      const firestoreData = userDoc.data();
      userData = {
        uid: sessionUser.uid,
        email: sessionUser.email,
        name: firestoreData.name || sessionUser.name || '',
        displayName: firestoreData.name || sessionUser.name || '',
        profilePicture: firestoreData.profilePicture || sessionUser.picture || '/default-avatar.png',
        createdAt: firestoreData.createdAt,
        lastLogin: firestoreData.lastLogin,
        preferences: firestoreData.preferences,
        authProvider: firestoreData.authProvider,
        ...firestoreData
      };
    } else {
      userData = {
        uid: sessionUser.uid,
        email: sessionUser.email,
        name: sessionUser.name || '',
        displayName: sessionUser.name || '',
        profilePicture: sessionUser.picture || '/default-avatar.png'
      };
    }

    return NextResponse.json({ user: userData });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}