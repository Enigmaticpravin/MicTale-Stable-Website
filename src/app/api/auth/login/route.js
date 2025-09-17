import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/app/lib/firebaseAdmin";

export async function POST(req) {
  try {    
    const { idToken, userData } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No ID token provided" }, { status: 400 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const { uid, email, name, picture } = decodedToken;
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const newUserData = {
        name: userData.name || name || '',
        email: email,
        profilePicture: userData.profilePicture || picture || '',
        createdAt: new Date(),
        lastLogin: new Date(),
        isNewUser: userData.isNewUser || false,
        authProvider: userData.authProvider || 'email',
        preferences: userData.preferences || { notifications: true, theme: 'dark' }
      };

      await userRef.set(newUserData);
    } else {
      await userRef.update({
        lastLogin: new Date(),
        ...(userData.profilePicture && { profilePicture: userData.profilePicture })
      });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ success: true });
    res.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return res;
  } catch (err) {
    
    return NextResponse.json({ 
      error: "Auth failed", 
      details: err.message,
      code: err.code 
    }, { status: 401 });
  }
}