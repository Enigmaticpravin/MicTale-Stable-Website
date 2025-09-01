'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, Receipt, Calendar, ArrowLeft, Info } from 'lucide-react'
import { pdf } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', alignItems: 'center' },
  logoContainer: { width: 120 },
  logo: { width: '100%', height: 'auto' },
  companyDetails: { fontSize: 9, color: '#555555', textAlign: 'right', lineHeight: 1.3 },
  companyName: { fontSize: 12, fontWeight: 'bold', color: '#333333', marginBottom: 3 },
  titleSection: { backgroundColor: '#f8f8f8', padding: 10, marginBottom: 15, borderRadius: 4, borderLeftWidth: 4, borderLeftColor: '#4a90e2' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#4a90e2', textAlign: 'center' },
  receiptIdSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  receiptIdBox: { backgroundColor: '#f0f7ff', padding: 8, borderRadius: 4, width: '48%' },
  receiptIdLabel: { fontSize: 9, color: '#666666', marginBottom: 2 },
  receiptIdValue: { fontSize: 11, fontWeight: 'bold', color: '#333333' },
  customerSection: { backgroundColor: '#fafafa', padding: 10, marginBottom: 15, borderRadius: 4 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#555555', marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', paddingBottom: 3 },
  receiptContainer: { marginBottom: 15 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#EEEEEE', paddingVertical: 8 },
  label: { fontSize: 10, color: '#666666', width: '40%' },
  value: { fontSize: 10, fontWeight: 'bold', color: '#333333', width: '60%', textAlign: 'right' },
  paymentSection: { backgroundColor: '#f5fbf5', padding: 10, marginBottom: 15, borderRadius: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#CCCCCC', marginTop: 8 },
  totalLabel: { fontSize: 12, fontWeight: 'bold', color: '#333333' },
  totalValue: { fontSize: 12, fontWeight: 'bold', color: '#2e7d32' },
  statusSection: { alignItems: 'center', marginVertical: 12 },
  statusBadge: { padding: 6, paddingHorizontal: 12, backgroundColor: '#2e7d32', borderRadius: 12 },
  statusText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  thankYouSection: { marginTop: 15, padding: 10, backgroundColor: '#f8f8f8', borderRadius: 4, alignItems: 'center' },
  thankYou: { fontSize: 14, color: '#333333', fontWeight: 'bold', marginBottom: 3 },
  supportText: { fontSize: 9, color: '#666666', textAlign: 'center' },
  footer: { marginTop: 20, padding: 10, borderTopWidth: 1, borderTopColor: '#EEEEEE' },
  footerText: { fontSize: 8, color: '#999999', textAlign: 'center', lineHeight: 1.3 },
})

const ReceiptDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image src="https://i.imgur.com/2eUjEZr.png" style={styles.logo} />
        </View>
        <View style={styles.companyDetails}>
          <Text style={styles.companyName}>MicTale</Text>
          <Text>More Than An Open Mic Platform</Text>
          <Text>Phone: +91 96676 45676</Text>
          <Text>Email: contact@mictale.in</Text>
          <Text>Website: www.mictale.in</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>PAYMENT RECEIPT</Text>
      </View>

      <View style={styles.receiptIdSection}>
        <View style={styles.receiptIdBox}>
          <Text style={styles.receiptIdLabel}>Transaction ID</Text>
          <Text style={styles.receiptIdValue}>{data.txnid}</Text>
        </View>
        <View style={styles.receiptIdBox}>
          <Text style={styles.receiptIdLabel}>Transaction Date</Text>
          <Text style={styles.receiptIdValue}>
            {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      </View>

      <View style={styles.customerSection}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{data.firstname}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{data.phone}</Text>
        </View>
      </View>

      <View style={styles.paymentSection}>
        <Text style={styles.sectionTitle}>Event Details</Text>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Event Type:</Text>
          <Text style={styles.value}>{data.productinfo}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.label}>Registration:</Text>
          <Text style={styles.value}>Open Mic Performance Slot</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount Paid:</Text>
          <Text style={styles.totalValue}>₹{parseFloat(data.amount).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.statusSection}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Payment Status: {data.status}</Text>
        </View>
      </View>

      <View style={styles.thankYouSection}>
        <Text style={styles.thankYou}>Thank you for registering with MicTale!</Text>
        <Text style={styles.supportText}>Your entry pass will be sent to your WhatsApp number shortly.</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>This is a computer-generated receipt and does not require a signature.</Text>
        <Text style={styles.footerText}>For any queries, please contact us at contact@mictale.in</Text>
        <Text style={styles.footerText}>© {new Date().getFullYear()} MicTale. All rights reserved.</Text>
      </View>
    </Page>
  </Document>
)

export default function PaymentSuccess() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)

  useEffect(() => {
    const txnid = searchParams.get('txnid')
    const amount = searchParams.get('amount')
    const firstname = searchParams.get('firstname')
    const email = searchParams.get('email')
    const phone = searchParams.get('phone')
    const status = searchParams.get('status')
    const hash = searchParams.get('hash')
    const productinfo = searchParams.get('productinfo')

    if (txnid) {
      setPaymentData({
        txnid,
        amount,
        firstname,
        email,
        phone,
        status,
        hash,
        productinfo: productinfo || 'Open Mic Event'
      })
    }
  }, [searchParams])

  const handleDownloadReceipt = async () => {
    if (!paymentData) return
    setIsGeneratingPdf(true)
    try {
      const blob = await pdf(<ReceiptDocument data={paymentData} />).toBlob()
      saveAs(blob, `MicTale_Receipt_${paymentData.txnid}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('There was an error generating your receipt. Please try again later.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  useEffect(() => {
    const sendEmail = async () => {
      if (!paymentData) return
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/sendEmail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: paymentData.email,
            name: paymentData.firstname,
            txnid: paymentData.txnid,
            amount: paymentData.amount
          })
        })
        if (!response.ok) console.log(`Email API responded with status ${response.status}`)
        console.log('Email sent:', await response.json())
      } catch (error) {
        console.error('Error sending email:', error)
      }
    }
    sendEmail()
  }, [paymentData])

  return (
    <div className='min-h-screen md:py-10 bg-gray-950 flex items-center justify-center'>
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl moving-gradient-1' />
        <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl moving-gradient-2' />
      </div>

      <div className='w-full min-h-screen md:min-h-fit md:max-w-4xl bg-white py-4 px-8 rounded-t-xl md:rounded-xl'>
        <div className='text-center space-y-2'>
          <div className='flex justify-center'>
            <CheckCircle className='h-16 w-16 text-green-500' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>Payment Successful!</h1>
          <p className='text-gray-600'>Your Open Mic slot has been successfully booked</p>
        </div>

        {paymentData ? (
          <div className='space-y-8 mt-5'>
            <div className='bg-green-50 p-4 rounded-lg border border-green-100'>
              <div className='flex items-center space-x-2 text-green-700'>
                <Calendar className='h-5 w-5' />
                <span className='font-medium'>Your performance is confirmed!</span>
              </div>
              <p className='mt-2 text-sm text-green-600'>
                Your entry pass will be sent to your WhatsApp number soon. Please keep it handy for the event.
              </p>
            </div>

            <div className='grid md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg'>
              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900'>Payment Details</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'><span className='text-gray-600'>Transaction ID</span><span className='font-medium text-gray-900'>{paymentData.txnid}</span></div>
                  <div className='flex justify-between'><span className='text-gray-600'>Amount Paid</span><span className='font-medium text-gray-900'>₹{paymentData.amount}</span></div>
                  <div className='flex justify-between'><span className='text-gray-600'>Status</span><span className='text-green-600 font-medium'>{paymentData.status}</span></div>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='font-semibold text-gray-900'>Customer Details</h3>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'><span className='text-gray-600'>Name</span><span className='font-medium text-gray-900'>{paymentData.firstname}</span></div>
                  <div className='flex justify-between'><span className='text-gray-600'>Email</span><span className='font-medium text-gray-900'>{paymentData.email}</span></div>
                  <div className='flex justify-between'><span className='text-gray-600'>Phone</span><span className='font-medium text-gray-900'>{paymentData.phone}</span></div>
                </div>
              </div>
            </div>

            <div className='bg-blue-50 p-6 rounded-lg border border-blue-100'>
              <div className='flex items-center space-x-2 text-blue-700 mb-3'>
                <Info className='h-5 w-5' />
                <h3 className='font-semibold'>Tips for Your Performance</h3>
              </div>
              <div className='space-y-3 text-sm text-blue-800'>
                <p>• <strong>Bring a physical copy</strong> of your work (paper, notebook, or diary) instead of reading from your phone.</p>
                <p>• <strong>Practice your piece</strong> at least 5-7 times before the event to build confidence.</p>
                <p>• <strong>Time yourself</strong> during practice to ensure you stay within the allotted time slot.</p>
                <p>• <strong>Speak clearly and project your voice</strong> - the audience wants to hear your art!</p>
                <p>• <strong>Make eye contact</strong> with your audience when possible to create connection.</p>
                <p>• <strong>Arrive 15-20 minutes early</strong> to sign in and prepare yourself mentally.</p>
                <p>• <strong>Stay hydrated</strong> - bring a water bottle to keep your voice clear.</p>
                <p>• <strong>Respect other performers</strong> by being attentive during their performances.</p>
              </div>
            </div>

            <div className='grid'>
              <button
                onClick={handleDownloadReceipt}
                disabled={isGeneratingPdf}
                className='flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50'
              >
                {isGeneratingPdf ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700'></div>
                    <span>Generating Receipt...</span>
                  </>
                ) : (
                  <>
                    <Receipt className='h-5 w-5' />
                    <span>Download Receipt</span>
                  </>
                )}
              </button>
            </div>

            <div className='pt-4 border-t border-gray-200'>
              <button
                onClick={() => router.push('/')}
                className='w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors'
              >
                <ArrowLeft className='h-4 w-4' />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        ) : (
          <div className='flex items-center justify-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
          </div>
        )}
      </div>
    </div>
  )
}
