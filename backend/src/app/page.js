export default function Page() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔒 Admin Backend API</h1>
      <p>Secure endpoint for admin panel authentication with IP validation</p>
      <hr />
      <h2>Endpoints</h2>
      <ul>
        <li><strong>POST /api/admin/login</strong> - Authenticate and get JWT token</li>
        <li><strong>POST /api/admin/verify</strong> - Verify JWT token validity</li>
        <li><strong>GET /api/admin/health</strong> - Health check</li>
      </ul>
    </main>
  )
}
