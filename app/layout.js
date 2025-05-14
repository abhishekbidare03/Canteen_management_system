// 'use client' directive removed
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// import { Providers } from './providers'; // Replaced by specific providers below
import { CartProvider } from '../context/CartContext'; // Add CartProvider
import { LoadingProvider } from '../context/LoadingContext'; // Add LoadingProvider
import AppContent from './AppContent'; // Add AppContent wrapper

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata can be defined here again if needed, as it's a Server Component
export const metadata = {
  title: 'The Baratie Online Ordering',
  description: 'Order delicious food from The Baratie!',
};

export default function RootLayout({ children }) {
  // Loader state is now managed within specific context providers
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider> {/* Wrap with LoadingProvider */}
          <CartProvider>
            <AppContent>{children}</AppContent> {/* Use AppContent wrapper */}
          </CartProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
