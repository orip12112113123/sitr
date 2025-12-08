import type { Metadata } from 'next';
import './globals.css';
import FeedbackAndSupport from '@/components/FeedbackAndSupport';

export const metadata: Metadata = {
  title: 'Sitr - Find Your Perfect Babysitter',
  description: 'Connect with trusted babysitters in your area',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <FeedbackAndSupport />
      </body>
    </html>
  );
}
