import React from 'react'
import { Toaster } from 'sonner'
import { Source_Serif_4 } from 'next/font/google'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-serif',
})

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`auth-layout flex items-center justify-center min-h-screen ${sourceSerif.className}`}
    >
      {children}
      <Toaster />
    </div>
  )
}
