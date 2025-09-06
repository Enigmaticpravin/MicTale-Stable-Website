import { Suspense } from 'react';
import FailurePageClient from './FailurePageClient';
import Footer from '../components/Footer';

export default function FailurePage() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FailurePageClient />
      </Suspense>
      <Footer />
    </>
  );
}
