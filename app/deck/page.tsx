import { Suspense } from 'react';
import ScreenShowcaseDeck from '@/components/screens/ScreenShowcaseDeck';

export default function DeckPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#89817D]">
          Loading 15-screen showcase...
        </div>
      }
    >
      <ScreenShowcaseDeck />
    </Suspense>
  );
}
