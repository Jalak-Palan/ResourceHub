import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import AppWrapper from '@/components/layout/AppWrapper';

export const metadata: Metadata = {
  title: 'ResourceHub – Equipment & Resource Booking System',
  description:
    'Book • Manage • Track – All Your College, Laboratory & Office Resources in One Place.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FFF7F1] text-[#29201D] antialiased">
        <AppProvider>
          <AppWrapper>{children}</AppWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
