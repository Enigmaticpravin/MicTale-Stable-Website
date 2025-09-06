import { Suspense } from 'react';
import Footer from '../../components/Footer';
import FailurePageClient from './FailurePageClient';

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
