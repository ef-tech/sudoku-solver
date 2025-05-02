import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sudoku Solver',
  description: 'A web application to solve Sudoku puzzles with animation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}