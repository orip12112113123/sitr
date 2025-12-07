import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
