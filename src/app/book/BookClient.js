'use client'

import { useState } from 'react'
import {
  Truck,
  CreditCard,
  Book,
  ShieldCheck,
  ShoppingBag,
  ChevronRight,
  InfoIcon,
  LockIcon,
  Info,
  Lock,
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

  const FloatingInput = ({ label, ...props }) => (
  <div className="relative group">
    <input
      {...props}
      placeholder=" "
      className="peer w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-black transition-all duration-500 text-gray-900 font-light"
    />
    <label className="absolute left-0 top-3 text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 pointer-events-none peer-focus:-top-6 peer-focus:text-black peer-[:not(:placeholder-shown)]:-top-6 peer-[:not(:placeholder-shown)]:text-black">
      {label}
    </label>
  </div>
);


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
  className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    showDeliveryForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'
  } max-w-7xl mx-auto md:mt-12 mb-24 px-6`}
>
  <div className='bg-white rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden flex flex-col lg:flex-row'>
    
    {/* Sidebar: Navigation & Identity */}
    <div className='lg:w-1/4 bg-[#0a0a0a] p-12 text-white flex flex-col justify-between'>
      <div>
        <div className="w-8 h-1 bg-[#bf953f] mb-12"></div>
        <h2 className='text-[10px] font-bold text-[#bf953f] uppercase tracking-[0.5em] mb-4'>Checkout</h2>
        <h3 className='text-4xl font-extralight leading-tight mb-8'>Shipping <br/> <span className="italic font-serif">Registry</span></h3>
        
        <div className="space-y-6 opacity-50">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-[#bf953f]"></div> Information
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full border border-white/30"></div> Payment
          </div>
        </div>
      </div>
      
      <p className="text-[10px] text-gray-500 leading-loose tracking-widest uppercase">
        Secure Hand-Delivery <br/> Guaranteed 2026
      </p>
    </div>

    {/* Main Form: Detailed Address Breakdown */}
    <div className='flex-1 p-10 md:p-16 lg:p-20'>
      <form onSubmit={handleSubmit} className='max-w-2xl mx-auto space-y-16'>
        
        {/* Section: Contact */}
        <section>
          <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
            01. Recipient <span className="h-[1px] flex-1 bg-gray-100"></span>
          </h4>
          <div className="grid md:grid-cols-2 gap-12">
            <FloatingInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
            <FloatingInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
        </section>

        {/* Section: Detailed Address */}
        <section>
          <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-12 flex items-center gap-4">
            02. Destination <span className="h-[1px] flex-1 bg-gray-100"></span>
          </h4>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="md:col-span-2">
              <FloatingInput label="Street Address" name="street" value={formData.street} onChange={handleInputChange} />
            </div>
            <FloatingInput label="City / Suburb" name="city" value={formData.city} onChange={handleInputChange} />
            <FloatingInput label="State / Province" name="state" value={formData.state} onChange={handleInputChange} />
            <FloatingInput label="ZIP / Postal Code" name="zip" value={formData.zip} onChange={handleInputChange} />
            <FloatingInput label="Country" name="country" value={formData.country} onChange={handleInputChange} />
          </div>
        </section>
      </form>
    </div>

    {/* Right: The Financial Ledger */}
    <div className='lg:w-[400px] bg-[#fcfcfc] p-10 md:p-14 border-l border-gray-100 flex flex-col'>
      <h4 className="text-[10px] font-black text-black uppercase tracking-[0.3em] mb-10">Order Summary</h4>
      
      <div className="flex-1 space-y-8">
        {/* Product Item */}
        <div className="flex gap-4">
          <Image
            src={isSpecialBook ? '/images/1.webp' : '/images/front.webp'}
            alt={book.title}
            width={80}
            height={100}
            className="w-20 h-30 object-cover rounded-md"
          />  
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{book.title}</p>
            <p className="text-[10px] text-gray-400 uppercase mt-1">Quantity: {quantity}</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4 pt-8 border-t border-gray-200/60">
          <div className="flex justify-between text-xs tracking-widest uppercase text-gray-500">
            <span>Base Price</span>
            <span className="text-gray-900">₹{(book.price * quantity).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between text-xs tracking-widest uppercase text-[#bf953f] font-bold">
            <span>Exclusive Discount (20%)</span>
            <span>- ₹{((book.price * quantity) * 0.2).toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-xs tracking-widest uppercase text-gray-500">
            <span>Express Shipping</span>
            <span className="text-gray-900">₹500.00</span>
          </div>

          <div className="flex justify-between text-xs tracking-widest uppercase text-emerald-600 font-medium">
            <span>Shipping Promotion</span>
            <span>- ₹500.00</span>
          </div>
        </div>

        {/* Total Price */}
        <div className="pt-8 border-t border-black">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-black uppercase tracking-widest">Total Payable</p>
              <p className="text-[9px] text-gray-400 uppercase">Taxes included</p>
            </div>
            <span className="text-4xl font-extralight text-black tracking-tighter">
              ₹{((book.price * quantity) * 0.8).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className='mt-12 w-full bg-black text-white py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#bf953f] transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 shadow-xl hover:shadow-[#bf953f]/20'
      >
        Continue to Payment <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  </div>
</div>
        </main>
      </div>
      <Footer />
    </>
  )
}
