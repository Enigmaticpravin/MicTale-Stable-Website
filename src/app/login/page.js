'use client';

import Image from 'next/image';
import mobilelogo from '@/app/images/logo.png';
import { useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BentoSocialAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleloading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [success, setSuccess] = useState('');

  const switchCard = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError('');
      setTimeout(() => setIsFlipping(false), 300);
    }, 300);
  };

  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = serverTimestamp();

      try {
        await setDoc(userRef, {
          name: displayName || additionalData.displayName || '',
          email,
          profilePicture: photoURL || '',
          createdAt,
          lastLogin: createdAt,
          ...additionalData
        });
      } catch (err) {
        console.error('Error creating user document', err);
        throw err;
      }
    } else {
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
    }

    return userRef;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(userCredential.user);
      router.push(redirectPath);
    } catch (err) {
      console.error('Error signing in', err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: name });

      await createUserDocument(userCredential.user, {
        name,
        isNewUser: true,
        preferences: { notifications: true, theme: 'dark' }
      });

      router.push(redirectPath);
    } catch (err) {
      console.error('Error signing up', err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setError('');
    setSuccess('');
    setResetEmail(email);
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setSuccess('Password reset email sent! Check your inbox.');
      setTimeout(() => setShowForgotPassword(false), 5000);
    } catch (err) {
      console.error('Error sending reset email', err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const isNewUser = userCredential._tokenResponse.isNewUser;

      await createUserDocument(userCredential.user, {
        isNewUser,
        authProvider: 'google',
        preferences: isNewUser ? { notifications: true, theme: 'dark' } : {}
      });

      router.push(redirectPath);
    } catch (err) {
      console.error('Error with Google sign in', err);
      setError(getAuthErrorMessage(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  const getAuthErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      case 'auth/email-already-in-use':
        return 'This email is already in use.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed.';
      case 'auth/account-exists-with-different-credential':
        return 'Account exists with different sign-in method.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const poppinsStyle = {
    fontFamily: 'Poppins, sans-serif',
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden">
     
      <div className="absolute inset-0 bg-[#0a0a12] overflow-hidden">
      
        <div className="absolute inset-0 animate-twinkle" 
             style={{
               backgroundImage: 'radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px)',
               backgroundSize: '50px 50px',
               opacity: 0.2,
             }}>
        </div>
        
        <div className="absolute inset-0 animate-twinkle-delayed" 
             style={{
               backgroundImage: 'radial-gradient(white, rgba(255,255,255,.1) 1px, transparent 2px)',
               backgroundSize: '100px 100px',
               opacity: 0.15,
               animationDelay: '1s',
             }}>
        </div>
        
        <div className="absolute inset-0 opacity-30 animate-pulse-slow"
             style={{
               background: 'radial-gradient(circle at 30% 50%, rgba(91, 33, 182, 0.4) 0%, rgba(15, 23, 42, 0) 60%)'
             }}>
        </div>
        
        <div className="absolute inset-0 opacity-20 animate-pulse-slower"
             style={{
               background: 'radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.4) 0%, rgba(15, 23, 42, 0) 60%)',
               animationDelay: '2s'
             }}>
        </div>
      </div>

      <div className={`w-full mx-4 md:mx-0 md:max-w-md z-10 transition-all duration-1000 transform translate-y-0 opacity-100 perspective`}>
        <div 
          className={`relative transition-all duration-500 preserve-3d ${
            isFlipping ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
          } ${isLogin ? '' : 'rotate-y-180'}`}
        >
          <div className={`w-full mx-auto backdrop-blur-xl bg-gray-900/40 rounded-2xl md:rounded-2xl overflow-hidden border border-gray-700/30 text-white shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 backface-hidden`}>
            <div className="flex flex-col items-center py-10">
              <div className="rounded-full flex items-center justify-center mb-1 shadow-lg relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Image src={mobilelogo} className='h-fit w-[190px] z-10' 
                         priority={true} alt="Logo"/>
              </div>
              <p style={poppinsStyle} className='uppercase tracking-[0.1rem] text-[10px] rounded-full'>where voices find a stage</p>
            </div>
            <div className='h-[1px] w-full bg-gradient-to-r from-gray-900/40 via-white to-gray-900/40 -mt-5 m-auto mb-5'></div>
           
          {showForgotPassword ? (
              <div className="px-8 pb-10">
                <div className="mb-4 text-center">
                  <h4 className="text-lg font-medium mb-2">Reset Password</h4>
                  <p className="text-sm text-gray-400">Enter your email address and we will send you a link to reset your password.</p>
                </div>
                
                {success && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md text-green-300 text-sm">
                    {success}
                  </div>
                )}
                
             
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-300 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handlePasswordReset}>
                  <div className="mb-5 transform transition-all duration-300 hover:translate-x-1 focus-within:translate-x-1">
                    <input
                      type="email"
                      placeholder="Email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full py-3 px-4 bg-gray-800/30 border border-gray-700/30 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full cursor-pointer py-3.5 bg-gradient-to-r from-indigo-600/80 to-blue-600/80 hover:from-indigo-600/90 hover:to-blue-600/90 text-gray-100 font-medium rounded-md mb-4 transition-all duration-300 transform hover:translate-y-px hover:shadow-lg shadow-md shadow-indigo-800/20 relative overflow-hidden group"
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={toggleForgotPassword}
                    className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-200 text-sm hover:underline"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <>
                <form onSubmit={handleSignIn} className="px-8 pb-10">
       
                  {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-300 text-sm">
                      {error}
                    </div>
                  )}
                  
                  <div className="mb-5 transform transition-all duration-300 hover:translate-x-1 focus-within:translate-x-1">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 px-4 bg-gray-800/30 border border-gray-700/30 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                      required
                    />
                  </div>
                  <div className="mb-2 relative transform transition-all duration-300 hover:translate-x-1 focus-within:translate-x-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 px-4 bg-gray-800/30 border border-gray-700/30 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute cursor-pointer right-3 top-3.5 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                 
                  <div className="mb-7 text-right">
                    <button 
                      type="button"
                      onClick={toggleForgotPassword}
                      className="text-blue-400 cursor-pointer hover:text-blue-300 transition-colors duration-200 text-sm hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                 
                  <button 
                    type="submit" 
                    className="w-full py-3.5 bg-gradient-to-r cursor-pointer from-indigo-600/80 to-blue-600/80 hover:from-indigo-600/90 hover:to-blue-600/90 text-gray-100 font-medium rounded-md transition-all duration-300 transform hover:translate-y-px hover:shadow-lg shadow-md shadow-indigo-800/20 relative overflow-hidden group"
                    disabled={loading}
                  >
                    <div className="absolute cursor-pointer inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>

             
                <div className="px-8 pb-10 -mt-6">
                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleloading}
                    className="w-full py-3.5 cursor-pointer bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30 text-gray-200 font-medium rounded-md flex items-center justify-center gap-3 transition-all duration-300 transform hover:translate-y-px group"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
                      <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                      <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
                      <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5717 17.5742 13.3037 18.0011 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
                      <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.785L18.7045 19.404C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                    </svg>
                    <span>{googleloading ? 'Processing...' : 'Sign in with Google'}</span>
                  </button>

                  <div className="text-center mt-7 text-sm text-gray-400">
                    Don&apos;t have an account? <button type="button" onClick={switchCard} className="text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline cursor-pointer">Sign up, it&apos;s free!</button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-full h-fit backdrop-blur-xl bg-gray-900/40 rounded-2xl border border-gray-700/30 text-white shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 rotate-y-180 backface-hidden absolute inset-0">
         
            <div className="flex flex-col items-center py-10">
              <div className="rounded-full flex items-center justify-center mb-1 shadow-lg relative group">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Image src={mobilelogo} className='h-fit w-[190px] z-10' 
                         priority={true} alt="Logo"/>
              </div>
              <p style={poppinsStyle} className='uppercase tracking-[0.1rem] text-[10px] rounded-full'>where voices find a stage</p>
            </div>
            <div className='h-[1px] w-full bg-gradient-to-r from-gray-900/40 via-white to-gray-900/40 -mt-5 m-auto mb-5'></div>
           
            <form onSubmit={handleSignUp} className="px-8 pb-10">
        
              {error && (
                <div className="mb-4 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              
              <div className="mb-4 transform transition-all duration-300 hover:translate-x-1 focus-within:translate-x-1">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-800/30 border border-gray-700/30 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  required
                />
              </div>
              
              <div className="mb-4 transform transition-all duration-300 hover:translate-x-1 focus-within:translate-x-1">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-800/30 border border-gray-700/30 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  required
                />
              </div>

              <div className="mb-7 relative transform transition-all duration-300 hover:translate-x-1 focus-within:translate-x-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 px-4 bg-gray-800/30 cursor-pointer border border-gray-700/30 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 cursor-pointer hover:text-gray-200 transition-colors duration-200"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.45825 12C3.73253 7.94288 7.52281 5 12.0004 5C16.4781 5 20.2684 7.94291 21.5426 12C20.2684 16.0571 16.4781 19 12.0005 19C7.52281 19 3.73251 16.0571 2.45825 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 cursor-pointer bg-gradient-to-r from-indigo-600/80 to-blue-600/80 hover:from-indigo-600/90 hover:to-blue-600/90 text-gray-100 font-medium rounded-md mb-4 transition-all duration-300 transform hover:translate-y-px hover:shadow-lg shadow-md shadow-indigo-800/20 relative overflow-hidden group"
                disabled={loading}
              >
                <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine"></div>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="px-8 pb-10 -mt-6">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 cursor-pointer bg-gray-800/40 hover:bg-gray-800/60 border border-gray-700/30 text-gray-200 font-medium rounded-md flex items-center justify-center gap-3 transition-all duration-300 transform hover:translate-y-px group"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-110">
                  <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#FFC107"/>
                  <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill="#FF3D00"/>
                  <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5717 17.5742 13.3037 18.0011 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill="#4CAF50"/>
                  <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.785L18.7045 19.404C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill="#1976D2"/>
                </svg>
                <span>{loading ? 'Processing...' : 'Sign up with Google'}</span>
              </button>

              <div className="text-center text-sm text-gray-400 mt-5 -mb-3">
                Already have an account? <button type="button" onClick={switchCard} className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200 hover:underline">Sign in</button>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-16 hidden text-center text-gray-400 transition-all duration-1000 delay-300 transform translate-y-0 opacity-100}`}>
          <p className="mb-4">Join over <span className="text-blue-400 font-medium">2M</span> global social media users</p>
          
          <div className="flex justify-center -space-x-2">
            {[
              { delay: '0ms', gradient: 'from-orange-400 to-red-600' },
              { delay: '100ms', gradient: 'from-blue-400 to-indigo-600' },
              { delay: '200ms', gradient: 'from-green-400 to-emerald-600' },
              { delay: '300ms', gradient: 'from-purple-400 to-fuchsia-600' },
              { delay: '400ms', gradient: 'from-yellow-400 to-amber-600' },
              { delay: '500ms', gradient: 'from-pink-400 to-rose-600' }
            ].map((avatar, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full border border-gray-900 overflow-hidden transform transition-all duration-700 hover:scale-110 hover:z-10`}
                style={{ 
                  transitionDelay: avatar.delay,
                  animationDelay: avatar.delay
                }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${avatar.gradient} animate-pulse-slow`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        
        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.3; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.08); }
        }
        
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(1.5); opacity: 0; }
        }
        
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-slow-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        
        @keyframes shine {
          to {
            transform: translateX(250%) skewX(-12deg);
          }
        }
        
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .animate-twinkle-delayed {
          animation: twinkle-delayed 5s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
        
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 10s linear infinite;
        }
        
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
        
        /* 3D card flip styles */
        .perspective {
          perspective: 1500px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}