'use client'

import { useState } from 'react'
import {
  Truck,
  CreditCard,
  Book,
  ShieldCheck,
  ShoppingBag,
  InfoIcon,
  LockIcon,
  User,
  Star,
  MapPin,
  Phone
} from 'lucide-react'
import Image from 'next/image'
import { db, collection, addDoc } from '@/app/lib/firebase-db'
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
    address: ''
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

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const generateBookingId = () => {
    const timestamp = Date.now().toString(36)
    const randomString = Math.random().toString(36).substring(2, 8)
    return `MTL-${timestamp}-${randomString}`.toUpperCase()
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!book || !formData.name || !formData.email || !formData.phone) {
      setErrorMsg('Please fill all the required fields.')
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
      const orderRef = collection(db, 'orders')
      await addDoc(orderRef, newOrder)

      const bookPrice = book.price * quantity + 50
      const totalAmount = bookPrice.toString()

      const response = await fetch('/api/payments/payu', {
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

      const data = await response.json()
      setLoading(false)

      if (data.action) {
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = data.action

        Object.keys(data).forEach(key => {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = data[key]
          form.appendChild(input)
        })

        document.body.appendChild(form)
        form.submit()
      } else {
        setErrorMsg('Payment initiation failed. Please try again.')
      }
    } catch (error) {
      setErrorMsg('Failed to place order. Please try again later.')
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

  const sendConfirmationEmail = async (
    buyerEmail,
    buyerName,
    orderId,
    totalAmount
  ) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: buyerEmail,
          name: buyerName,
          orderId,
          totalAmount
        })
      })

      const data = await response.json()
      if (response.ok) {
        console.log('Email sent:', data)
      } else {
        console.error('Error sending email:', data.error)
      }
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
    }
  }

  const discountPercentage = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100
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

          <div className='flex flex-col lg:flex-row justify-between gap-6 w-full p-4'>
            <div className='flex-1 flex justify-center lg:justify-start md:p-4'>
              {isSpecialBook ? (
                <Book3D
                  frontCover='/images/1.webp'
                  backCover='/images/2.webp'
                  spineCover='/images/spine.webp'
                  className='max-w-[150px] md:max-w-[300px] h-auto'
                />
              ) : (
                <Book3D
                  backCover='/images/back.webp'
                  frontCover='/images/front.webp'
                  spineCover='/images/sspine.webp'
                  className='max-w-[150px] md:max-w-[300px] h-auto'
                />
              )}
            </div>

            <div className='flex-1 space-y-4 text-center lg:text-left'>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>
                {book.title}
              </h1>
              <p className='text-gray-500'>
                By{' '}
                <span className='font-semibold text-orange-600 italic'>
                  {book.author}
                </span>{' '}
                | Paperback
              </p>
              <div className='flex justify-center lg:justify-start items-center gap-2'>
                <div className='flex text-yellow-400'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-5 h-5 fill-current' />
                  ))}
                </div>
                <span className='text-gray-600'>(5 Reviews)</span>
              </div>

              <div className='block lg:hidden'>
                <div className='flex items-center justify-center lg:justify-start gap-4'>
                  <span className='text-2xl font-bold text-orange-600'>
                    ₹{book.price}
                  </span>
                  <span className='line-through text-gray-400'>
                    ₹{book.originalPrice}
                  </span>
                  <span className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs'>
                    Save ₹{book.originalPrice - book.price} (
                    {Math.round(
                      ((book.originalPrice - book.price) / book.originalPrice) *
                        100
                    )}
                    %)
                  </span>
                </div>

                <div className='text-black font-medium text-sm'>
                  Available | Ships within 2-4 Business Days
                </div>

                <div className='flex flex-row gap-4 mt-4 items-center w-full'>
                  <div className='flex text-black items-center border border-orange-600 rounded-lg'>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className='px-3 py-2 hover:bg-gray-100'
                    >
                      -
                    </button>
                    <span className='px-4'>{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className='px-3 py-2  hover:bg-gray-100'
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={toggleDeliveryForm}
                    className='
    w-full relative overflow-hidden
    bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500
    backdrop-blur-md backdrop-saturate-150
    border border-white/30 cursor-pointer before:pointer-events-none
    text-white font-medium py-3 px-6 rounded-2xl
    shadow-[0_8px_32px_rgba(251,146,60,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:shadow-[0_12px_40px_rgba(251,146,60,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
    hover:bg-gradient-to-br hover:from-orange-400/80 hover:via-orange-500/90 hover:to-pink-500/70
    transition-all duration-300 ease-out
    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
    before:translate-x-[-100%] before:transition-transform before:duration-1000
    hover:before:translate-x-[100%]
    group
  '
                  >
                    <span className='relative z-10 flex items-center justify-center gap-2'>
                      Buy Now
                      <div className='w-1 h-1 bg-white/60 rounded-full animate-pulse group-hover:animate-ping'></div>
                    </span>
                  </button>
                </div>
              </div>

              <p className='text-gray-600 leading-relaxed text-sm text-justify md:text-base px-2'>
                {' '}
                {book.description}
              </p>

              <div className='pt-4 border-t'>
                <div
                  className='flex gap-4 overflow-x-auto px-2 sm:px-0'
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {[
                    { icon: ShieldCheck, text: 'Premium Quality' },
                    { icon: Book, text: 'Certified Product' },
                    { icon: CreditCard, text: 'Secure Checkout' },
                    { icon: Truck, text: 'On Time Delivery' }
                  ].map(({ icon: Icon, text }, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center text-center text-gray-600 min-w-[90px] sm:min-w-[120px]'
                    >
                      <Icon className='w-6 h-6 mb-2 text-orange-600' />
                      <span className='text-xs sm:text-sm'>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-gray-50 text-black rounded-lg p-4 mt-4 block md:hidden'>
                <div className='grid grid-cols-2 gap-4 text-xs md:text-sm'>
                  <div>
                    <p className='text-gray-500'>ISBN</p>
                    <p className='font-medium'>{book.isbn}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Page Count</p>
                    <p className='font-medium'>{book.pageCount}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Weight</p>
                    <p className='font-medium'>231 gr</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Dimensions</p>
                    <p className='font-medium'>198x21x131 mm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='hidden lg:flex-1 lg:flex flex-col space-y-4'>
              <div className='flex items-center space-x-4'>
                <span className='text-3xl font-bold text-orange-600'>
                  ₹{book.price}
                </span>
                <span className='line-through text-gray-400'>
                  ₹{book.originalPrice}
                </span>
                <span className='bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm'>
                  Save ₹{book.originalPrice - book.price} ({discountPercentage}
                  %)
                </span>
              </div>

              <div className='text-black font-medium'>
                Available | Ships within 2-4 Business Days
              </div>

              <div className='flex text-black flex-row gap-4 mt-4 items-center w-full'>
                <div className='flex items-center border border-orange-600 rounded-lg'>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
                  >
                    -
                  </button>
                  <span className='px-4'>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className='px-3 py-2 hover:bg-gray-100 cursor-pointer'
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={toggleDeliveryForm}
                  className='
    w-full relative overflow-hidden
    bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500
    backdrop-blur-md
    border border-white/30 cursor-pointer
    text-white font-medium py-3 px-6 rounded-2xl
    shadow-[0_8px_32px_rgba(251,146,60,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:shadow-[0_12px_40px_rgba(251,146,60,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
    hover:bg-gradient-to-br hover:from-orange-400/80 hover:via-orange-500/90 hover:to-pink-500/70
    transition-all duration-300 ease-out
    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
    before:translate-x-[-100%] before:transition-transform before:duration-1000
    hover:before:translate-x-[100%]
    group
  '
                >
                  <span className='relative z-10 flex items-center justify-center gap-2'>
                    Buy Now
                    <div className='w-1 h-1 bg-white/60 rounded-full animate-pulse group-hover:animate-ping'></div>
                  </span>
                </button>
              </div>

              <div className='bg-gray-50 text-black rounded-lg p-4 mt-4 hidden md:block'>
                <div className='grid grid-cols-2 gap-4 text-xs md:text-sm'>
                  <div>
                    <p className='text-gray-500'>ISBN</p>
                    <p className='font-medium'>{book.isbn}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Page Count</p>
                    <p className='font-medium'>{book.pageCount}</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Weight</p>
                    <p className='font-medium'>231 gr</p>
                  </div>
                  <div>
                    <p className='text-gray-500'>Dimensions</p>
                    <p className='font-medium'>198x21x131 mm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isSpecialBook && (
            <div className='relative flex w-full max-w-6xl mx-auto gap-4 mt-8'>
              <div className='md:w-1/2 aspect-video w-full'>
              <LiteYouTube videoId="PqkjSkL_EBQ" />
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

          <div
            id='delivery-form-container'
            className={`md:mt-8 transition-all md:max-w-6xl mx-auto duration-500 ease-in-out overflow-hidden ${
              showDeliveryForm ? 'max-h-fit opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='bg-white  md:rounded-xl md:shadow-lg p-4 md:p-8 border border-gray-100'>
              <h2 className='text-2xl font-bold text-gray-800 mb-2 text-center'>
                Delivery Information
              </h2>
              <p className='text-gray-500 text-center mb-6'>
                Please provide your details for delivery
              </p>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='mb-6'>
                  <h3 className='text-md font-semibold text-gray-700 mb-3 flex items-center'>
                    <User className='h-4 w-4 mr-2 text-orange-500' />
                    Contact Information
                  </h3>
                  <div className='grid md:grid-cols-2 gap-4'>
                    <div className='relative group'>
                      <label
                        htmlFor='name'
                        className='text-sm text-gray-600 mb-1 block'
                      >
                        Full Name
                      </label>
                      <input
                        type='text'
                        id='name'
                        name='name'
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder='Type your full name here...'
                        className='w-full px-4 py-3 border text-black placeholder-gray-500 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all'
                      />
                    </div>

                    <div className='relative group'>
                      <label
                        htmlFor='email'
                        className='text-sm text-gray-600 mb-1 block'
                      >
                        Email Address
                      </label>
                      <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder='your@email.com'
                        className='w-full px-4 py-3 text-black placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all'
                      />
                    </div>
                  </div>

                  <div className='mt-4'>
                    <label
                      htmlFor='phone'
                      className='text-sm text-gray-600 mb-1 block'
                    >
                      Phone Number
                    </label>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Phone className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type='tel'
                        id='phone'
                        name='phone'
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder='+91 98765 43210'
                        className='w-full pl-10 text-black placeholder-gray-500 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                      />
                    </div>
                  </div>
                </div>

                <div className='mb-6'>
                  <h3 className='text-md font-semibold text-gray-700 mb-3 flex items-center'>
                    <MapPin className='h-4 w-4 mr-2 text-orange-500' />
                    Shipping Address
                  </h3>
                  <div className='relative'>
                    <textarea
                      name='address'
                      id='address'
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder='House/Flat No., Building Name, Street, Area, City, State, PIN Code'
                      className='w-full px-4 text-black placeholder-gray-500 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent'
                      rows={3}
                    />
                  </div>
                </div>

                <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                  <h3 className='text-md font-semibold text-gray-700 mb-4 flex items-center'>
                    <ShoppingBag className='h-4 w-4 mr-2 text-orange-500' />
                    Order Summary
                  </h3>

                  <div className='space-y-2 mb-4'>
                    <div className='flex justify-between items-center'>
                      <div className='flex items-center'>
                        <div className='w-12 h-16 bg-gray-100 rounded flex items-center justify-center mr-3'>
                          <Book className='h-6 w-6 text-gray-500' />
                        </div>
                        <div>
                          <p className='font-medium text-gray-800'>
                            {book.title}
                          </p>
                          <p className='text-sm text-gray-500'>
                            Quantity: {quantity}
                          </p>
                        </div>
                      </div>
                      <p className='font-medium text-gray-800'>
                        ₹{(book.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className='border-t border-gray-200 pt-4 space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <p className='text-gray-600'>
                        MRP ({quantity} {quantity > 1 ? 'items' : 'item'})
                      </p>
                      <p className='text-gray-800'>
                        ₹{(book.price * quantity).toFixed(2)}
                      </p>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <p className='text-gray-600'>Shipping Fee</p>
                      <p className='text-gray-800'>₹50.00</p>
                    </div>
                    <div className='flex justify-between font-bold text-base pt-2 border-t border-gray-200 mt-2'>
                      <p className='text-black'>Total</p>
                      <p className='text-orange-600'>
                        ₹{(book.price * quantity + 50).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <div className='bg-orange-50 p-4 rounded-lg border border-orange-100'>
                    <p className='text-sm text-orange-800'>
                      <InfoIcon className='h-4 w-4 inline mr-2' />
                      Your order will be delivered within 3-5 business days
                    </p>
                  </div>

                  <button
                    type='submit'
                    className='w-full cursor-pointer bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition duration-300 flex items-center justify-center gap-3 font-medium shadow-md'
                  >
                    <LockIcon className='h-5 w-5' />
                    Place Order & Pay ₹{(book.price * quantity + 50).toFixed(2)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
