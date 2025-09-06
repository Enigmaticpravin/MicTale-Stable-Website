import { Suspense } from 'react';
import SuccessPageClient from './SuccessPageClient';
import Footer from '../components/Footer';

export default function SuccessPage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <SuccessPageClient />
      </Suspense>
      <Footer />
    </>
  );
}
