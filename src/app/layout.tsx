import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'لوحة تحكم إدارة المشاريع الإبداعية',
  description: 'منصة مركزية لإدارة المشاريع الإبداعية والمهام والملفات والتعاون الجماعي',
  keywords: ['إدارة المشاريع', 'المشاريع الإبداعية', 'التعاون', 'الإنتاجية'],
  authors: [{ name: 'Creative Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-arabic bg-secondary-50 text-secondary-900">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
}