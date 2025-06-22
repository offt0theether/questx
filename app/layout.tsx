import type { ReactNode } from "react"
import "./globals.css" // optional – only if you have Tailwind/global CSS

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
