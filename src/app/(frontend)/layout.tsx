import { Footer, Header } from '@/components'
import { Toaster } from 'sonner'
import { Source_Serif_4 } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-source-serif',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-url') || ''
  const isAuthPage = pathname.includes('/sign-in') || pathname.includes('/sign-up')

  return (
    <html lang="en" className={sourceSerif.className}>
      <body className={sourceSerif.className}>
        {!isAuthPage && <Header />}
        <main className={sourceSerif.className}>
          {children}
          <Toaster />
        </main>
        {!isAuthPage && <Footer />}
      </body>
    </html>
  )
}
