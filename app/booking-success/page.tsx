import { Suspense } from 'react';
import BookingSuccessScreen from '@/components/screens/BookingSuccessScreen';

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#89817D]">Loading confirmation...</div>}>
      <BookingSuccessScreen />
    </Suspense>
  );
}
