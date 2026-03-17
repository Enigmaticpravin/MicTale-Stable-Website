'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Footer from '@/app/components/Footer'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { 
  Mail, 
  Loader2,
  Check,
  User as UserIcon,
  Globe,
  Shield
} from 'lucide-react'

export default function Profile() {
  const router = useRouter()
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    city: '',
    avatar_url: ''
  })
  const [status, setStatus] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          city: data.city || '',
          avatar_url: data.avatar_url || ''
        })
      }
      setLoading(false)
    }
    loadProfile()
  }, [router])

    const confirmLogout = () => {
    supabase.auth.signOut().then(() => {
      router.push('/login')
    })
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true)
  }

  const handleUpdate = async () => {
    setSaving(true)
    const { error } = await supabase
      .from('users')
      .update({
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        city: formData.city
      })
      .eq('id', user.id)

    if (error) {
      setSaving(false)
      return
    }

    setStatus('Success')
    setTimeout(() => setStatus(''), 3000)
    setSaving(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />

      <nav className="relative z-10 max-w-5xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center group-hover:border-white/20 transition-all">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-medium tracking-tight text-slate-100">Profile</span>
        </div>
        <button 
         onClick={handleLogoutClick}
          className="text-xs font-semibold uppercase tracking-widest text-white hover:text-white hover:bg-red-700 bg-red-500 px-3 py-2 cursor-pointer rounded-4xl transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-8 md:pb-24">
        <div className="bg-slate-900 border border-white/[0.08] rounded-3xl p-4 md:p-12 shadow-2xl">
          
          <div className="flex flex-row md:flex-row gap-5 items-center md:items-start">
            <div className="relative">
              <div className="w-32 h-32 rounded-[32px] bg-slate-900 border border-white/10 p-1">
                <div className="w-full h-full rounded-[28px] overflow-hidden relative bg-slate-800 flex items-center justify-center">
                  {formData.avatar_url ? (
                    <Image src={formData.avatar_url} alt="User" fill className="object-cover" />
                  ) : (
                    <UserIcon className="w-10 h-10 text-slate-600" />
                  )}
                </div>
              </div>
              
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className='text-left'>
                  <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">{formData.full_name || 'Your Name'}</h1>
                  <p className="text-slate-400  mt-1 flex items-center md:text-sm text-xs justify-start md:justify-start gap-1">
                    <Mail className="md:w-4 w-3 h-3 md:h-4" /> {formData.email}
                  </p>
                </div>
                <button 
                  onClick={handleUpdate}
                  disabled={saving}
                  className="md:px-8 px-5 py-2 md:py-3 cursor-pointer bg-white text-slate-950 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : status === 'Success' ? <Check className="w-4 h-4" /> : null}
                  {status === 'Success' ? 'Saved' : 'Update Profile'}
                </button>
              </div>

               <div className="bg-white/[0.02] hidden md:block mt-2 border border-white/[0.05] rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">Location</p>
                  <p className="text-sm font-medium text-slate-200 truncate">{formData.city || 'Not set'}</p>
                </div>
            </div>
          </div>

          <div className="mt-4 md:mt-8 grid grid-cols-2 md:grid-cols-2 gap-x-2 md:gap-x-12 gap-y-4 md:gap-y-10">
            <div className="md:space-y-2">
              <label className="text-[10px] md:text-xs md:font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <input 
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-3 text-sm md:text-lg focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-xs md:font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Mobile</label>
              <input 
                  value={formData.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                className="w-full bg-transparent border-b border-white/10 py-3 text-sm md:text-lg focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] md:text-xs md:font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">City</label>
              <div className="relative">
                <input 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-sm md:text-lg focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800"
                  placeholder="New York, NY"
                />
                <Globe className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
              </div>
            </div>

            <div className="space-y-2 opacity-50">
              <label className="text-[10px] md:text-xs md:font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="w-full py-3 text-sm md:text-lg text-slate-400 flex items-center justify-between cursor-not-allowed">
              {formData.email
    ? (() => {
        const [name, domain] = formData.email.split('@')
        return `${name.slice(0, 3)}...@${domain}`
      })()
    : ''}
                <Shield className="w-4 h-4 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-7 md:px-0 px-10 md:mt-12 text-xs md:text-sm text-slate-400">
          Need to change your email or delete your account? <span className="text-blue-400 hover:underline cursor-pointer font-medium">Contact Support</span>
        </p>
      </main>
       <AnimatePresence>
        {showLogoutConfirmation && (
          <>
            <motion.button
              type='button'
              aria-label='Close dialog backdrop'
              className='fixed inset-0 z-40 bg-black/40 backdrop-blur-md'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirmation(false)}
            />
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
              <motion.div
                role='dialog'
                aria-modal='true'
                className='inline-block w-full max-w-lg overflow-hidden rounded-lg border border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl'
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 200, damping: 20 }
                }}
                exit={{
                  opacity: 0,
                  scale: 0.98,
                  y: 8,
                  transition: { duration: 0.15 }
                }}
              >
                <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-6 w-6 text-red-600'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                        />
                      </svg>
                    </div>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <h3 className='text-lg font-medium leading-6 text-white'>
                        Sign out
                      </h3>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-300'>
                          Are you sure you want to sign out? You will need to
                          sign in again to access your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

<div className='bg-gray-900 px-4 py-3 flex flex-row-reverse gap-3 sm:px-6 items-center'>
  <button
    type='button'
    className='flex-1 sm:flex-none inline-flex cursor-pointer justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto'
    onClick={confirmLogout}
  >
    Sign out
  </button>
  <button
    type='button'
    className='flex-1 sm:flex-none inline-flex cursor-pointer justify-center items-center rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:w-auto'
    onClick={() => setShowLogoutConfirmation(false)}
  >
    Cancel
  </button>
</div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
      <Footer />
    </div>
  )
}