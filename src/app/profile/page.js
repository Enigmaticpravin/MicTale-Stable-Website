'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { db } from '@/app/lib/firebase-db'
import { getFirebaseAuth } from '@/app/lib/firebase-auth'
import { signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { Edit2Icon, PhoneCall } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'
import Footer from '@/app/components/Footer'
import Image from 'next/image'

export default function Profile() {
  const [auth, setAuth] = useState(null)   // NEW
  const [userData, setUserData] = useState({
    isLoading: true,
    user: null,
    formData: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      phoneNumber: '',
      profilePicture: ''
    },
    error: '',
    success: '',
    imageLoading: false
  })

  const fileInputRef = useRef(null)
  const router = useRouter()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [particles, setParticles] = useState([])
  const [cursorSpot, setCursorSpot] = useState([])

  // Load firebase auth dynamically
  useEffect(() => {
    const loadAuth = async () => {
      const { auth } = await getFirebaseAuth()
      setAuth(auth)
    }
    loadAuth()
  }, [])

  const handleMouseMove = useCallback(e => {
    const { clientX, clientY } = e
    setMousePosition({ x: clientX, y: clientY })

    setCursorSpot(prev =>
      [
        ...prev,
        {
          x: clientX,
          y: clientY,
          timestamp: Date.now()
        }
      ].slice(-50)
    )
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    setIsLoaded(true)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Auth listener (only runs after auth loads)
  useEffect(() => {
    if (!auth) return

    const unsubscribe = auth.onAuthStateChanged(async currentUser => {
      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid)
          const userSnap = await getDoc(userRef)

          if (userSnap.exists()) {
            const user = userSnap.data()
            const nameParts = (user.name || '').split(' ')

            setUserData({
              isLoading: false,
              user,
              formData: {
                firstName: nameParts[0] || '',
                lastName: nameParts.slice(1).join(' ') || '',
                email: user.email || '',
                username: user.username || '',
                phoneNumber: user.phoneNumber || '',
                profilePicture: user.profilePicture || ''
              },
              error: '',
              success: '',
              imageLoading: false
            })
          } else {
            throw new Error('User not found')
          }
        } catch (error) {
          setUserData(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to load user data'
          }))

          setTimeout(() => {
            setUserData(prev => ({ ...prev, error: '' }))
          }, 3000)
        }
      } else {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [auth, router])

  const handleInputChange = e => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }))
  }

  const handleUpdateProfile = async () => {
    if (!auth?.currentUser) return

    try {
      setUserData(prev => ({ ...prev, isLoading: true }))

      const { formData } = userData
      const userRef = doc(db, 'users', auth.currentUser.uid)

      const updatedUserData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        profilePicture: formData.profilePicture
      }

      await updateDoc(userRef, updatedUserData)

      setUserData(prev => ({
        ...prev,
        isLoading: false,
        user: {
          ...prev.user,
          ...updatedUserData
        },
        success: 'Profile updated successfully!'
      }))

      setTimeout(() => {
        setUserData(prev => ({ ...prev, success: '' }))
      }, 3000)
    } catch (error) {
      setUserData(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to update profile'
      }))
      setTimeout(() => {
        setUserData(prev => ({ ...prev, error: '' }))
      }, 3000)
    }
  }

  const handleLogout = async () => {
    try {
      const { auth } = await getFirebaseAuth()
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      setUserData(prev => ({
        ...prev,
        error: 'Failed to log out'
      }))
    }
  }

  const handleChangeProfilePicture = async (e) => {
    const file = e.target.files[0]
    if (!file) return
  
    setUserData(prev => ({
      ...prev,
      imageLoading: true,
      success: 'Compressing image...'
    }))
  
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        initialQuality: 0.85 
      })
      
      setUserData(prev => ({
        ...prev,
        success: 'Uploading image...'
      }))
  
      const storage = getStorage()
      const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`)
      await uploadBytes(storageRef, compressedFile)
      
      const downloadURL = await getDownloadURL(storageRef)
      
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        profilePicture: downloadURL
      })
      
      setUserData(prev => ({
        ...prev,
        imageLoading: false,
        formData: {
          ...prev.formData,
          profilePicture: downloadURL
        },
        user: {
          ...prev.user,
          profilePicture: downloadURL
        },
        success: 'Profile picture updated!'
      }))
      
      setTimeout(() => {
        setUserData(prev => ({ ...prev, success: '', error: '' }))
      }, 3000)
    } catch (error) {
      console.error('Image upload error:', error)
      setUserData(prev => ({
        ...prev,
        imageLoading: false,
        error: 'Failed to upload profile picture'
      }))
      
      setTimeout(() => {
        setUserData(prev => ({ ...prev, success: '', error: '' }))
      }, 3000)
    }
  }

  if (userData.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative w-16 h-16 animate-spin">
          <div className="absolute border-t-4 border-blue-500 border-solid rounded-full inset-0"></div>
          <div className="absolute border-t-4 border-solid rounded-full inset-0 border-l-4 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const { formData, success, error } = userData
  const fullName = `${formData.firstName} ${formData.lastName}`.trim()

  return (
    <>
      <div className='min-h-screen flex items-center bg-gray-950 justify-center md:p-4'>
        <div className='fixed inset-0 pointer-events-none'>
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl moving-gradient-1' />
          <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl moving-gradient-2' />
        </div>

        <div className='fixed inset-0 pointer-events-none'>
          <div
            className='absolute inset-0 opacity-30'
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, 
                rgba(56, 189, 248, 0.15),
                transparent 40%
              )`
            }}
          />
        </div>
        {particles.map(particle => (
          <div
            key={particle.id}
            className='absolute w-1 h-1 bg-white rounded-full animate-float opacity-40'
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
        <div className='w-full md:max-w-2xl bg-slate-900 rounded-3xl backdrop-blur-xl overflow-hidden border border-gray-700/30 text-white transition-all duration-300 hover:shadow-indigo-500/10 shadow-xl'>
          {/* Header with clouds background */}
          <div className='h-40 bg-gradient-to-r from-purple-300 to-yellow-200 relative'>
            {/* Edit button */}
            <button
              className='absolute top-4 right-4 text-gray-700 hover:text-gray-900'
              onClick={handleLogout}
            >
              <Edit2Icon size={24} />
            </button>
          </div>

          {/* Profile content */}
          <div className='px-6 pb-6 -mt-12 relative'>
            {/* Profile picture */}
            <div className='flex justify-between items-start mb-4'>
              <div
                className='relative w-20 h-20 rounded-full bg-gray-800 border-4 border-black overflow-hidden group cursor-pointer'
                onClick={() => fileInputRef.current.click()}
              >
                {formData.profilePicture ? (
                  <Image
                    src={formData.profilePicture}
                    alt='Profile'
                    width={80}
                    height={80}
                    className='w-full h-full object-cover'
                    priority
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center bg-blue-600 text-xl font-bold'>
                    {formData.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}

                {/* Hover icon */}
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Edit2Icon size={24} className='text-white' />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleChangeProfilePicture}
                  className="hidden"
                />
              </div>
              
              {success && (
                <p className="text-green-500 text-sm mb-2 absolute top-24 left-0">{success}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm mb-2 absolute top-24 left-0">{error}</p>
              )}
            </div>

            <div className='mb-2'>
              <div className='flex items-center gap-2'>
                <h1 className='text-xl font-bold'>{fullName}</h1>
              </div>
              <p className='text-sm text-gray-400'>{formData.email}</p>
            </div>

            <div className='space-y-6 mt-10'>
              {/* Name fields */}
              <div className='text-sm'>
                <label className='block text-gray-500 mb-1'>Name</label>
                <div className='grid grid-cols-2 gap-4'>
                  <input
                    type='text'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    name='firstName'
                    className='w-full bg-gray-900 border border-gray-800 rounded p-3 text-white'
                    placeholder='First name'
                  />
                  <input
                    type='text'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    name='lastName'
                    className='w-full bg-gray-900 border border-gray-800 rounded p-3 text-white'
                    placeholder='Last name'
                  />
                </div>
              </div>

              {/* Email address */}
              <div className='text-sm'>
                <label className='block text-gray-500 mb-1'>Email address</label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 flex items-center pl-3'>
                    <Mail size={16} className='text-gray-500' />
                  </div>
                  <input
                    type='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    name='email'
                    className='w-full bg-gray-900 border border-gray-800 rounded p-3 pl-10 text-white cursor-not-allowed'
                    placeholder='Email address'
                    disabled
                  />
                </div>
                {/* Verification badge */}
                <div className='flex items-center gap-2 mt-2 text-xs text-gray-400'>
                  <CheckCircle size={14} className='text-blue-400' />
                  <span>VERIFIED 2 JAN, 2025</span>
                </div>
              </div>

              <div className="md:flex md:items-start md:gap-4">
                {/* Phone Number */}
                <div className="text-sm w-full md:w-1/2 mb-4 md:mb-0">
                  <label className="block text-gray-500 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="flex items-center p-3 bg-gray-900 border border-gray-800 rounded text-white justify-between cursor-pointer">
                      <div className="flex items-center gap-2 flex-1">
                        <PhoneCall size={16} className="text-gray-500" />
                        <input
                          type="number"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          name="phoneNumber"
                          className="text-white bg-gray-900 placeholder-gray-500 focus:outline-none w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Username */}
                <div className="text-sm w-full md:w-1/2">
                  <label className="block text-gray-500 mb-1">Username</label>
                  <div className="flex">
                    <div className="bg-gray-800 p-3 rounded-l border border-gray-700 text-gray-400">
                      mictale.in/
                    </div>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={handleInputChange}
                      name="username"
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-r p-3 text-white"
                      placeholder="Username"
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className='flex justify-end space-x-4 pt-4'>
                <button
                  className='px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700'
                  onClick={() => router.push('/')}
                >
                  Cancel
                </button>
                <button
                  className='px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2'
                  onClick={handleUpdateProfile}
                  disabled={userData.isLoading}
                >
                  {userData.isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className='fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg'
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className='fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg'
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  )
}