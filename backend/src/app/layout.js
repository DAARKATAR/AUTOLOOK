import './globals.css'

export const metadata = {
  title: 'Admin Backend API',
  description: 'Secure admin backend with IP validation',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
