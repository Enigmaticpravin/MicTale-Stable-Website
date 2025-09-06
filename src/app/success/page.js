import { Suspense } from 'react';
import Footer from '../../components/Footer';
import SuccessPageClient from './SuccessPageClient';

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
