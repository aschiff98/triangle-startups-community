import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const body = localFont({ src: '../public/fonts/dm-sans-variable.woff2', variable: '--font-body', display: 'swap' })
const display = localFont({ src: [
  { path: '../public/fonts/newsreader-roman.woff2', style: 'normal' },
  { path: '../public/fonts/newsreader-italic.woff', style: 'italic' },
], variable: '--font-display', display: 'swap' })
export const metadata: Metadata = { title: 'Triangle jobs · contributor starter', robots: { index: false, follow: false } }
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${body.variable} ${display.variable}`}><body>{children}</body></html>
}
