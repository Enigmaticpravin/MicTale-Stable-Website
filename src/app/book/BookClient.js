'use client'

import { useState } from 'react'
import { ArrowRight, Lock, Star } from 'lucide-react'
import Image from 'next/image'
import first from '@/app/images/1.jpg'
import second from '@/app/images/2.jpg'
import third from '@/app/images/3.jpg'
import Book3D from '@/app/components/Book3D'
import Footer from '@/app/components/Footer'
import LiteYouTube from '../components/LiteYouTube'

export default function BookClient ({ book, error, url }) {
  const [quantity, setQuantity] = useState(1)
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  zip: '',
  state: '',
  country: ''
})

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)

  if (error) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-3xl font-bold text-red-500'>Book not found</h1>
        <p className='text-gray-600'>{error}</p>
      </div>
    )
  }

  const isSpecialBook =
    book.title === 'Kaalikh (Author-signed, Revised Edition)' ||
    book.title === 'Kaalikh (Author-signed, Paperback)'

      const generateBookingId = () => {
    const timestamp = Date.now().toString(36)
    const randomString = Math.random().toString(36).substring(2, 8)
    return `MTL-${timestamp}-${randomString}`.toUpperCase()
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

const handleSubmit = async e => {
  e.preventDefault()

  if (!formData.name || !formData.email || !formData.phone) {
    setErrorMsg('Please fill all required fields')
    return
  }

  setLoading(true)
  setErrorMsg('')

    const newOrder = {
      ...formData,
      quantity,
      book,
      orderId: generateBookingId(),
      timestamp: new Date()
    }

  try {
       const bookPrice = book.price * quantity + 50
      const totalAmount = bookPrice.toString()
    const res = await fetch('/api/payments/payu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
          amount: totalAmount,
          productInfo: `Book Order: ${book.title}`,
          firstname: formData.name,
          email: formData.email,
          phone: formData.phone,
          orderId: newOrder.orderId
        })
    })

    const data = await res.json()

    if (!res.ok) throw new Error(data.error || 'Order failed')

    const form = document.createElement('form')
    form.method = 'POST'
form.action = data.action

Object.entries(data).forEach(([k, v]) => {
  if (k === 'action') return

  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = k
  input.value = v
  form.appendChild(input)
})


    document.body.appendChild(form)
    form.submit()
  } catch (err) {
    console.error(err)
    setErrorMsg('Payment initiation failed')
    setLoading(false)
  }
}



  const toggleDeliveryForm = () => {
    setShowDeliveryForm(!showDeliveryForm)

    if (!showDeliveryForm) {
      setTimeout(() => {
        const formContainer = document.querySelector('#delivery-form-container')
        if (formContainer) {
          formContainer.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 100)
    }
  }

  const discountPercentage = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
  )

  const FloatingInput = ({ label, ...props }) => (
    <div className='relative group'>
      <input
        {...props}
        placeholder=' '
        className='peer w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all duration-500 text-gray-900 font-light'
      />
      <label className='absolute left-0 top-3 text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 pointer-events-none peer-focus:-top-6 peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-black'>
        {label}
      </label>
    </div>
  )

  return (
    <>
      <div className='ml-1 mr-1 mb-1 md:mr-5 md:ml-5 md:mb-5 rounded-2xl text-dark overflow-x-hidden opacity-95 relative min-h-screen'>
        {loading && (
          <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'>
            <div className='bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 text-center'>
              <div className='flex justify-center mb-4'>
                <div className='w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin'></div>
              </div>

              <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                Processing Your Order
              </h2>

              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Please wait while we finalize your purchase.
              </p>

              <div className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
                <div className='h-full bg-blue-500 animate-[progress_2s_ease-in-out_infinite]'></div>
              </div>
            </div>
          </div>
        )}

        <div className='absolute inset-0 z-0 w-full h-full'>
          <Image
            src='https://res.cloudinary.com/drwvlsjzn/image/upload/v1756650304/newspaper_yesgsf.webp'
            alt='A newspaper'
            fill
            style={{
              objectFit: 'cover',
              backgroundBlendMode: 'overlay'
            }}
          />
        </div>

        <div className='absolute inset-0 bg-white opacity-80' />
        <main className='relative z-10  mx-auto md:px-6 py-5 md:py-12'>
          {isSpecialBook && (
            <div className='relative p-5 mx-auto overflow-hidden justify-center items-center flex flex-col'>
              <span
                className="relative bg-yellow-400 text-black text-xs md:text-2xl font-bold px-5 py-1 rounded-full uppercase shadow-md 
       animate-[wiggle_1s_ease-in-out_infinite] before:content-['🔥'] before:absolute before:-left-4 before:animate-[slideIn_1.5s_ease-in-out_infinite] after:content-['🔥'] after:absolute after:-right-4 after:animate-[slideIn_1.5s_ease-in-out_infinite]"
              >
                🎉 Bestseller
              </span>
              <style>
                {`
         @keyframes wiggle {
           0%, 100% { transform: rotate(-3deg); }
           50% { transform: rotate(3deg); }
         }
         @keyframes slideIn {
           0% { transform: translateX(-10px); opacity: 0; }
           50% { opacity: 1; }
           100% { transform: translateX(10px); opacity: 0; }
         }
       `}
              </style>
            </div>
          )}

          <div className='flex flex-col lg:flex-row justify-between gap-8 w-full p-4 lg:p-8 mx-auto'>
            <div className='flex-1 flex justify-center lg:justify-start items-start'>
              {isSpecialBook ? (
                <Book3D
                  frontCover='/images/1.webp'
                  backCover='/images/2.webp'
                  spineCover='/images/spine.webp'
                  className='max-w-[180px] md:max-w-[320px] shadow-2xl transition-transform duration-500 hover:scale-105'
                />
              ) : (
                <Book3D
                  backCover='/images/back.webp'
                  frontCover='/images/front.webp'
                  spineCover='/images/sspine.webp'
                  className='max-w-[180px] md:max-w-[320px] shadow-2xl transition-transform duration-500 hover:scale-105'
                />
              )}
            </div>

            <div className='flex-[1.5] space-y-6 text-center lg:text-left'>
              <div className='space-y-2 flex flex-col items-center lg:items-start justify-center'>
                <h1 className='text-2xl md:text-4xl montserrat-regular text-slate-900 tracking-tight'>
                  {book.title}
                </h1>
                <div className='flex gap-4'>
                  <p className='text-slate-600 text-sm md:text-lg'>
                    By{' '}
                    <span
                      className='
  font-semibold italic cursor-pointer text-blue-500'
                    >
                      {book.author}
                    </span>
                    <span className='mx-2 text-slate-600'>|</span>Paperback
                  </p>

                  {isSpecialBook && (
                    <div className='hidden md:flex justify-center lg:justify-start items-center gap-3'>
                      <div className='flex text-amber-400'>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className='w-5 h-5 fill-current' />
                        ))}
                      </div>

                      <span className='text-slate-500 font-medium'>
                        (5 Customer Reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className='block lg:hidden space-y-4'>
                <div className='flex items-center justify-center gap-4'>
                  <span className='text-3xl font-bold text-slate-900'>
                    ₹{book.price}
                  </span>
                  <span className='line-through text-slate-400 text-lg'>
                    ₹{book.originalPrice}
                  </span>
                  <span className='bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100'>
                    {Math.round(
                      ((book.originalPrice - book.price) / book.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                </div>

                <div className='text-emerald-600 font-semibold text-sm flex items-center justify-center gap-2'>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-emerald-500'></span>
                  </span>
                  In Stock | Ships in 2-4 Business Days
                </div>

                <div className='flex flex-row gap-4 mt-4 items-center w-full'>
                  <div className='flex items-center bg-white border border-slate-500 rounded-xl overflow-hidden shadow-sm'>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-4 py-2 text-black hover:bg-slate-50 transition-colors'
                    >
                      {' '}
                      -{' '}
                    </button>
                    <span className='px-2 font-bold text-slate-700'>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className='px-4 py-2 text-black hover:bg-slate-50 transition-colors'
                    >
                      {' '}
                      +{' '}
                    </button>
                  </div>

                  <button
                    onClick={toggleDeliveryForm}
                    className='flex-1 items-center py-2 justify-center rounded-xl bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.7),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 text-white cursor-pointer'
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              <p className='text-slate-600 leading-relaxed text-base text-justify lg:text-left'>
                {book.description}
              </p>

              <div className='pt-8 border-t border-slate-100'>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2 text-slate-500'>
                    <Lock className='w-4 h-4 text-emerald-600' />
                    <span className='text-xs font-bold uppercase tracking-wider'>
                      Secure Checkout Guaranteed
                    </span>
                  </div>

                  <div
                    className='flex items-center gap-6 overflow-x-auto pb-2'
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>

                    <div className='flex items-center gap-4 border-r border-slate-200 pr-6'>
                      <img
                        src='https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
                        alt='Visa'
                        className='h-4'
                      />
                      <img
                        src='https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
                        alt='Mastercard'
                        className='h-6  '
                      />
                      <img
                        src='https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg'
                        alt='PayPal'
                        className='h-5 '
                      />
                      <img
                        src='https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg'
                        alt='UPI'
                        className='h-5'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='bg-slate-50 rounded-2xl p-5 mt-4 block md:hidden border border-slate-100'>
                <div className='grid grid-cols-2 gap-y-4 gap-x-8 text-sm'>
                  <div>
                    <p className='text-slate-400 text-xs uppercase tracking-wider font-bold mb-1'>
                      ISBN
                    </p>
                    <p className='font-semibold text-slate-700'>{book.isbn}</p>
                  </div>
                  <div>
                    <p className='text-slate-400 text-xs uppercase tracking-wider font-bold mb-1'>
                      Pages
                    </p>
                    <p className='font-semibold text-slate-700'>
                      {book.pageCount}
                    </p>
                  </div>
                  <div>
                    <p className='text-slate-400 text-xs uppercase tracking-wider font-bold mb-1'>
                      Weight
                    </p>
                    <p className='font-semibold text-slate-700'>231 gr</p>
                  </div>
                  <div>
                    <p className='text-slate-400 text-xs uppercase tracking-wider font-bold mb-1'>
                      Dimensions
                    </p>
                    <p className='font-semibold text-slate-700 uppercase text-[10px]'>
                      198x21x131 mm
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='hidden lg:flex flex-col flex-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-xl self-start h-fit sticky top-8'>
              <div className='space-y-1'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-4xl libre-baskerville-regular-italic  text-slate-900'>
                    ₹{book.price}
                  </span>
                  <span className='text-slate-400 line-through text-lg font-medium'>
                    ₹{book.originalPrice}
                  </span>
                </div>
                <div className='inline-block bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold'>
                  Save ₹{book.originalPrice - book.price} ({discountPercentage}
                  %)
                </div>
              </div>

              <div className='text-emerald-600 font-bold text-sm flex items-center gap-2'>
                <div className='h-2 w-2 rounded-full bg-emerald-500 animate-pulse' />
                In Stock | Ships in 2-4 Business Days
              </div>

              <div className='flex gap-4 w-full h-12 items-stretch'>
                <div className='flex-1 flex items-center justify-between border border-slate-500 rounded-xl p-1 bg-slate-50'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='w-10 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold text-slate-600 cursor-pointer'
                  >
                    {' '}
                    -{' '}
                  </button>
                  <span className='font-bold text-slate-800'>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='w-10 h-full flex items-center justify-center hover:bg-white rounded-lg transition-all font-bold text-slate-600 cursor-pointer'
                  >
                    {' '}
                    +{' '}
                  </button>
                </div>

                <button
                  onClick={toggleDeliveryForm}
                  className='flex-[2] flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.7),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 text-white cursor-pointer'
                >
                  Buy Now
                </button>
              </div>

              <div className='bg-slate-50 rounded-xl p-5 border border-slate-100'>
                <div className='grid grid-cols-2 gap-4 text-xs'>
                  <div>
                    <p className='text-slate-400 font-bold mb-1'>ISBN</p>
                    <p className='font-semibold text-slate-800'>{book.isbn}</p>
                  </div>
                  <div>
                    <p className='text-slate-400 font-bold mb-1'>PAGES</p>
                    <p className='font-semibold text-slate-800'>
                      {book.pageCount}
                    </p>
                  </div>
                  <div className='col-span-2 pt-2 border-t border-slate-200 mt-2'>
                    <p className='text-slate-400 font-bold'>DIMENSIONS</p>
                    <p className='font-semibold text-slate-800'>
                      198 x 21 x 131 mm (231g)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isSpecialBook && (
            <div className='relative flex w-full max-w-6xl mx-auto gap-4 mt-8'>
              <div className='md:w-1/2 aspect-video w-full'>
                <LiteYouTube videoId='PqkjSkL_EBQ' />
              </div>
              <div className='md:w-1/2 md:flex items-center hidden'>
                <Image
                  src={third}
                  alt='Book cover'
                  width={1000}
                  height={500}
                  className='w-full h-auto md:rounded-xl'
                />
              </div>
            </div>
          )}

          {isSpecialBook && (
            <div className='relative w-full md:space-y-5 max-w-6xl md:mt-5 mx-auto'>
              <Image
                src={first}
                alt='Banner of Kaalikh, a poetry book by Pravin Gupta, revised edition'
                width={2000}
                height={500}
                className='md:rounded-xl mx-auto'
              />
              <Image
                src={second}
                alt='Book cover, Kaalikh'
                width={2000}
                height={500}
                className='md:rounded-xl mx-auto'
              />
              <Image
                src={third}
                alt='Kaalikh by Pravin Gupta, Author-signed, Revised Edition'
                width={2000}
                height={500}
                className='md:rounded-xl mx-auto md:hidden'
              />
            </div>
          )}

          {showDeliveryForm && (
            <div
              id='delivery-form-container'
              className='transition-all overflow-hidden mt-5 duration-700 ease-out opacity-100 translate-y-0 max-w-6xl mx-auto md:mt-12 mb-4 md:mb-24 px-4'
            >
              <div className='bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col lg:flex-row'>
                <div className='lg:w-1/4 bg-gradient-to-l from-slate-900 via-slate-950 to-slate-900 p-8 text-white hidden md:flex flex-col'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-12'>
                      <div className='w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold'>
                        1
                      </div>
                      <h2 className='text-xs font-bold uppercase tracking-widest text-blue-400'>
                        Shipping
                      </h2>
                    </div>

                    <nav className='space-y-8'>
                      <div className='flex items-center gap-4 group'>
                        <div className='w-2 h-2 rounded-full bg-blue-500 ring-4 ring-blue-500/20'></div>
                        <span className='text-sm font-medium tracking-wide'>
                          Information
                        </span>
                      </div>
                      <div className='flex items-center gap-4 opacity-40'>
                        <div className='w-2 h-2 rounded-full bg-slate-400'></div>
                        <span className='text-sm font-medium tracking-wide'>
                          Payment
                        </span>
                      </div>
                      <div className='flex items-center gap-4 opacity-40'>
                        <div className='w-2 h-2 rounded-full bg-slate-400'></div>
                        <span className='text-sm font-medium tracking-wide'>
                          Confirmation
                        </span>
                      </div>
                    </nav>
                  </div>

                  <div className='pt-8 border-t border-white/10'>
                    <div className='flex items-center gap-3 text-slate-400'>
                      <Lock className='w-4 h-4' />
                      <span className='text-[10px] uppercase tracking-widest font-semibold'>
                        256-bit Encryption
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex-1 p-8 md:p-12 bg-white'>
                  <form
                    onSubmit={handleSubmit}
                    className='max-w-xl mx-auto space-y-10'
                  >
                    <header>
                      <h3 className='text-2xl font-bold text-slate-900'>
                        Shipping Details
                      </h3>
                      <p className='text-slate-500 text-sm mt-1'>
                        Please enter your precise delivery information.
                      </p>
                    </header>

                    <section className='space-y-6'>
                      <div className='flex items-center gap-3'>
                        <span className='text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                          01
                        </span>
                        <span className='text-sm font-bold uppercase tracking-wider text-slate-800'>
                          Contact Person
                        </span>
                      </div>
                      <div className='grid md:grid-cols-2 gap-6'>
                        <FloatingInput
                          label='Full Name'
                          name='name'
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                        <FloatingInput
                          label='Email Address'
                          type='email'
                          name='email'
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                        <FloatingInput
                          label='Phone Number'
                          type='tel'
                          name='phone'
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </section>

                    <section className='space-y-6'>
                      <div className='flex items-center gap-3'>
                        <span className='text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded'>
                          02
                        </span>
                        <span className='text-sm font-bold uppercase tracking-wider text-slate-800'>
                          Destination
                        </span>
                      </div>
                      <div className='grid md:grid-cols-2 gap-6'>
                        <div className='md:col-span-2'>
                          <FloatingInput
                            label='Street Address'
                            name='street'
                            value={formData.street}
                            onChange={handleInputChange}
                          />
                        </div>
                        <FloatingInput
                          label='City'
                          name='city'
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                        <FloatingInput
                          label='Postal Code'
                          name='zip'
                          value={formData.zip}
                          onChange={handleInputChange}
                        />
                        <FloatingInput
                          label='State'
                          name='state'
                          value={formData.state}
                          onChange={handleInputChange}
                        />
                        <FloatingInput
                          label='Country'
                          name='country'
                          value={formData.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </section>
                  </form>
                </div>
                <div className='lg:w-[380px] bg-slate-50 p-8 border-l border-slate-100 flex flex-col'>
                  <h4 className='text-sm font-bold text-slate-900 uppercase tracking-widest mb-8'>
                    Order Summary
                  </h4>

                  <div className='flex-1 space-y-6'>
                    <div className='flex gap-4 bg-white p-3 rounded-2xl border border-slate-200/60'>
                      <div className='relative'>
                        <Image
                          src={
                            isSpecialBook
                              ? '/images/1.webp'
                              : '/images/front.webp'
                          }
                          alt={book.title}
                          width={64}
                          height={80}
                          className='w-16 h-20 object-cover rounded-lg shadow-sm'
                        />
                        <span className='absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full'>
                          {quantity}
                        </span>
                      </div>
                      <div className='flex flex-col justify-center'>
                        <p className='text-sm font-bold text-slate-900 line-clamp-1'>
                          {book.title}
                        </p>
                        <p className='text-xs text-slate-500 italic'>
                          {book.author}
                        </p>
                      </div>
                    </div>

                    <div className='space-y-3 pt-4'>
                      <div className='flex justify-between text-sm text-slate-600'>
                        <span>Subtotal</span>
                        <span className='font-medium text-slate-900'>
                          ₹{(book.originalPrice * quantity).toLocaleString()}
                        </span>
                      </div>

                      <div className='flex justify-between text-sm text-slate-600'>
                        <span>Shipping</span>
                        <span className='text-slate-600 font-bold uppercase text-sm'>
                          ₹50
                        </span>
                      </div>
                      <div className='flex justify-between text-sm text-green-600 font-medium'>
                        <span>Discount</span>
                        <span>
                          - ₹
                          {(
                            book.originalPrice *
                            quantity *
                            0.25
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className='pt-6 border-t border-slate-200'>
                      <div className='flex justify-between items-center'>
                        <span className='text-sm font-bold text-slate-900'>
                          Total
                        </span>
                        <div className='text-right'>
                          <p className='text-3xl font-black text-slate-900 tracking-tighter'>
                            ₹
                            {(
                              book.originalPrice *
                              quantity *
                              1
                            ).toLocaleString()}
                          </p>
                          <p className='text-[10px] text-slate-400 font-medium'>
                            VAT & Taxes included
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className='mt-8 w-full py-4 rounded-xl text-sm font-bold flex justify-center items-center tracking-wide bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[0_4px_20px_rgba(59,130,246,0.5),inset_0_1px_0_rgba(255,255,255,0.3),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.7),inset_0_1px_0_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.3)] transition-all duration-300 transform hover:scale-105 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:via-transparent before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 text-white cursor-pointer'
                  >
                    Continue to Payment
                    <ArrowRight className='h-4 w-4' />
                  </button>

                  <p className='text-center text-[10px] text-slate-400 mt-4'>
                    By continuing, you agree to our Terms of Service.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
