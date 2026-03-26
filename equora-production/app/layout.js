import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://equora.app'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Equora — AI Portfolio Intelligence',
    template: '%s · Equora',
  },
  description: 'Upload your portfolio from any Indian broker. Get AI-powered health scores, stock verdicts, and rebalancing suggestions instantly.',
  keywords: ['portfolio analysis', 'stock research', 'Indian stocks', 'NSE', 'BSE', 'AI investment'],
  openGraph: {
    title: 'Equora — AI Portfolio Intelligence',
    description: 'Portfolio analysis for Indian investors powered by AI',
    type: 'website',
    url: siteUrl,
    siteName: 'Equora',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Equora — AI Portfolio Intelligence',
    description: 'Portfolio analysis for Indian investors powered by AI',
  },
  robots: { index: true, follow: true },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05080f',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📊</text></svg>" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  )
}
