import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Scary my social',
  description: 'Scary my social, an app to modify your social media'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen  bg-zinc-800 text-white"
      >
        {children}
      </body>
    </html>
  )
}
