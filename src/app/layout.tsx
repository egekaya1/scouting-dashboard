import './globals.css'
import QueryProvider from '@/components/providers/query-provider'

export const metadata = {
  title: 'Scouting Dashboard',
  description: 'Player scouting reports with backend pagination',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
