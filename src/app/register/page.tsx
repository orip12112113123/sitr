'use client';

import { Suspense } from 'react';
import RegisterForm from './RegisterForm';
import Link from 'next/link';
import { Baby } from 'lucide-react';

function RegisterFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-pink-50 to-peach-100 flex items-center justify-center">
      <div className="text-xl text-gray-600">Loading...</div>
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-peach-50 via-pink-50 to-peach-100">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Baby className="w-8 h-8 text-peach-500" />
            <h1 className="text-2xl font-bold text-peach-600">sitr</h1>
          </Link>
        </nav>
      </header>

      <Suspense fallback={<RegisterFallback />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
