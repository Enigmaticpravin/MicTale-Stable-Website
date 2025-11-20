'use client'

import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Check,
  Star,
  Users,
  BookOpen,
  Clock,
  Award,
  Target,
  Loader2
} from 'lucide-react'
import { getDoc, doc, db, addDoc, collection } from '@/app/lib/firebase'
import { serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const PoetrySubmissionForm = () => {
  const [formData, setFormData] = useState({
    phoneNumber: '',
    contentType: '',
    title: '',
    content: ''
  })
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)

  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const contentTypes = ['English Prose', 'Poem', 'Muktak', 'Ghazal', 'Nazm']

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

useEffect(() => {
  let unsubscribe = () => {};

  async function loadAuth() {
    const { getAuth, onAuthStateChanged } = await import("firebase/auth");
    const auth = getAuth();

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUser(userSnap.data());
          }
        } catch (err) {
          setError("Failed to load user data");
          setUser(null);
        }
      }
    });
  }

  loadAuth();

  return () => unsubscribe();
}, []);


  const handleSubmit = async () => {
    try {
      if (currentUser) {
        if (
          !formData.phoneNumber ||
          !formData.contentType ||
          !formData.title ||
          !formData.content
        ) {
          return
        }
        
        setIsLoading(true)
        
        await addDoc(collection(db, 'submission'), {
          ...formData,
          uid: currentUser.uid,
          userName: user.name,
          userEmail: user.email,
          date: serverTimestamp()
        })
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/emailForSub`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              submissionTitle: formData.title
            })
          }
        )

        if (!response.ok) {
          console.log(`Email API responded with status ${response.status}`)
        }

        console.log('Email sent:', await response.json())
        setIsLoading(false)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        localStorage.setItem('authRedirect', window.location.pathname)
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
      }
    } catch (error) {
      console.error('Authentication error:', error)
      setIsLoading(false)
    }
  }

  const LoadingPopup = () => {
    if (!isLoading) return null

    return (
      <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
        <div className='bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-in fade-in duration-300'>
          <div className='w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Loader2 className='w-8 h-8 text-blue-600 animate-spin' />
          </div>
          <h3 className='text-xl font-semibold text-gray-900 mb-3'>
            Submitting Your Work
          </h3>
          <p className='text-gray-600 mb-4'>
            Please wait while we process your submission...
          </p>
          <div className='w-full bg-gray-200 rounded-full h-2'>
            <div className='bg-blue-600 h-2 rounded-full animate-pulse w-3/4'></div>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
        <div className='max-w-md w-full text-center'>
          <div className='w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm'>
            <Check className='w-10 h-10 text-emerald-600' />
          </div>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
            Submission Received
          </h2>
          <p className='text-gray-600 mb-8 leading-relaxed'>
            Thank you for sharing your work with us. We will personally review
            your submission and respond within 7 days.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setFormData({
                phoneNumber: '',
                contentType: '',
                title: '',
                content: ''
              })
            }}
            className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors'
          >
            Submit another piece
            <ArrowRight className='w-4 h-4 ml-2' />
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoadingPopup />
      <div className='min-h-screen bg-slate-950'>
        <div className='max-w-4xl mx-auto md:px-4 md:py-20'>
        
          <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden md:mb-16'>
            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 px-6 lg:px-12 py-12 text-center border-b border-gray-100'>
              <img
                src='/images/MicTale Originals.png'
                alt='Poetry Hero'
                className='w-36 h-fit object-cover rounded-lg mx-auto'
              />
              <p className='text-black mt-2'>opens its gate for you.</p>
            </div>
            <div className='px-6 lg:px-12 py-12'>
              <div className='text-center mb-12'>
                <div className='w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6'>
                  <Clock className='w-7 h-7 text-gray-700' />
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  How It Works
                </h3>
                <p className='text-gray-600 max-w-md mx-auto'>
                  A transparent, professional process designed for your success
                </p>
              </div>

              {/* Desktop Process */}
              <div className='hidden lg:grid grid-cols-3 gap-12 mb-12'>
                <div className='text-center relative'>
                  <div className='w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative'>
                    <BookOpen className='w-10 h-10 text-blue-600' />
                    <div className='absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                      1
                    </div>
                  </div>
                  <h4 className='text-lg font-bold text-gray-900 mb-3'>
                    Submit Your Work
                  </h4>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Share your best poetry, prose, or creative writing using our
                    secure submission form
                  </p>

                  {/* Arrow */}
                  <div className='absolute top-10 -right-6 hidden xl:block'>
                    <ArrowRight className='w-6 h-6 text-gray-300' />
                  </div>
                </div>

                <div className='text-center relative'>
                  <div className='w-20 h-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative'>
                    <Users className='w-10 h-10 text-purple-600' />
                    <div className='absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                      2
                    </div>
                  </div>
                  <h4 className='text-lg font-bold text-gray-900 mb-3'>
                    Personal Review
                  </h4>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Our experienced team personally evaluates every submission
                    with care and attention
                  </p>

                  {/* Arrow */}
                  <div className='absolute top-10 -right-6 hidden xl:block'>
                    <ArrowRight className='w-6 h-6 text-gray-300' />
                  </div>
                </div>

                <div className='text-center'>
                  <div className='w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 relative'>
                    <Star className='w-10 h-10 text-emerald-600' />
                    <div className='absolute -top-2 -right-2 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                      3
                    </div>
                  </div>
                  <h4 className='text-lg font-bold text-gray-900 mb-3'>
                    Begin Your Journey
                  </h4>
                  <p className='text-gray-600 text-sm leading-relaxed'>
                    Start your path to professional content creation or
                    personalized mentorship
                  </p>
                </div>
              </div>

              {/* Mobile Process */}
              <div className='md:hidden space-y-8 mb-12'>
                <div className='flex items-start space-x-4'>
                  <div className='w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 relative'>
                    <BookOpen className='w-8 h-8 text-blue-600' />
                    <div className='absolute -top-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                      1
                    </div>
                  </div>
                  <div className='pt-2'>
                    <h4 className='font-bold text-gray-900 mb-2'>
                      Submit Your Work
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Share your best creative writing using our form below
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0 relative'>
                    <Users className='w-8 h-8 text-purple-600' />
                    <div className='absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                      2
                    </div>
                  </div>
                  <div className='pt-2'>
                    <h4 className='font-bold text-gray-900 mb-2'>
                      Personal Review
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      We personally evaluate every submission within 7 days
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 relative'>
                    <Star className='w-8 h-8 text-emerald-600' />
                    <div className='absolute -top-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold'>
                      3
                    </div>
                  </div>
                  <div className='pt-2'>
                    <h4 className='font-bold text-gray-900 mb-2'>
                      Begin Your Journey
                    </h4>
                    <p className='text-gray-600 text-sm'>
                      Start your professional or growth track immediately
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className='bg-gray-50 rounded-2xl p-2 md:p-6'>
                <div className='flex flex-row items-center justify-center text-sm text-gray-600'>
                  <div className='flex items-center space-x-3'>
                    <div className='w-3 h-3 bg-blue-500 rounded-full animate-pulse'></div>
                    <span className='text-xs md:text-sm md:font-medium'>
                      Submit Today
                    </span>
                  </div>
                  <div className='block w-8 h-px bg-gray-300'></div>
                  <div className='flex items-center space-x-3'>
                    <Clock className='w-4 h-4 text-gray-500' />
                    <span className='text-xs md:text-sm'>7-Day Review</span>
                  </div>
                  <div className='block w-8 h-px bg-gray-300'></div>
                  <div className='flex items-center space-x-3'>
                    <div className='w-3 h-3 bg-emerald-500 rounded-full'></div>
                    <span className='text-xs md:text-sm font-medium'>
                      Start Growing
                    </span>
                  </div>
                </div>
              </div>
              <div className='h-[2px] my-10 w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent'></div>
              <div className='px-0 md:px-12 pb-12'>
                <div className='text-center mb-12'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                    Ready to Submit?
                  </h3>
                  <p className='text-gray-600 max-w-md mx-auto'>
                    Share your best work and take the first step toward
                    professional growth
                  </p>
                </div>

                <div className='max-w-2xl mx-auto space-y-8'>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Phone Number
                    </label>
                <input
                      type='tel'
                      name='phoneNumber'
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className='w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50 focus:bg-white'
                      placeholder='Enter your phone number'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Content Type
                    </label>
                    <select
                      name='contentType'
                      value={formData.contentType}
                      onChange={handleInputChange}
                      className='w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50 focus:bg-white'
                    >
                      <option value=''>Select the type of your work</option>
                      {contentTypes.map(type => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Title
                    </label>
                    <input
                      type='text'
                      name='title'
                      value={formData.title}
                      onChange={handleInputChange}
                      className='w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-gray-50 focus:bg-white'
                      placeholder='Give your work a compelling title'
                      required
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-700 mb-3'>
                      Your Content
                    </label>
                    <textarea
                      name='content'
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={16}
                      className='w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 bg-gray-50 focus:bg-white leading-relaxed'
                      placeholder='Share your poetry, prose, or creative writing here. Take your time to present your best work...'
                    />
                    <div className='flex items-center justify-between mt-3'>
                      <p className='text-sm text-gray-500'>
                        Quality over quantity. Share your most impactful piece.
                      </p>
                      <p className='text-xs text-gray-400'>
                        {formData.content.length} characters
                      </p>
                    </div>
                  </div>

                  <div className='pt-0 md:pt-8'>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className='w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold md:py-5 md:px-8 py-3 px-5 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:shadow-md'
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          <span className='md:text-lg text-sm'>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span className='md:text-lg text-sm'>Submit My Work</span>
                          <ArrowRight className='md:w-5 md:h-5 h-4 w-4' />
                        </>
                      )}
                    </button>

                    <p className='text-center text-xs text-gray-500 mt-6'>
                      By submitting, you agree to let MicTale review and
                      potentially feature your work. We respect your creative
                      rights and will discuss any usage beforehand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PoetrySubmissionForm