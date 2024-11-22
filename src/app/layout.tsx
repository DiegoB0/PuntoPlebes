import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'Punto Plebes',
  description: 'Manage your business',
  manifest: 'web.manifest'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <div
    //   className="lg:ml-72 md:ml-64 sm:ml-64 h-full bg-white  overflow-x-hidden"
    //   style={{ minHeight: '94vh' }}>
    //   <div className="py-12 px-5 mt-14 w-full h-screen">{children}</div>
    // </div>
    <html lang="en">
      <link rel="manifest" href="web.manifest"></link>
      <meta name="theme-color" content="#f54180"></meta>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-x-hidden
        `}
        style={{ minHeight: '94vh' }}>
        {children}
      </body>
    </html>
  )
}
