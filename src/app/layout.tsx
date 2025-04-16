import React from "react"
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'CatLin',
  description: 'An efficient way to manage your deadlines.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* <link href="https://unpkg.com/nes.css@2.3.0/css/nes.min.css" rel="stylesheet" /> */}
        {/* <style>
          @font-face {
            font - family: 'Unifont';
          src: url('/fonts/unifont.otf') format('opentype');
      }
          @font-face {
            font - family: 'Fusion';
          src: url('/fonts/fusion.otf') format('opentype');
      }
        </style> */}
      </head>
      <body>
        <div id="root">{children}</div>
        {/* <script type="module" src="/src/main.tsx"></script> */}
      </body>
    </html>

  )
}