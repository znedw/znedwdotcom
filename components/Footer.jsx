export default function Footer({ children }) {
  return (
    <footer style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem' }}>
      {children}
    </footer>
  )
}
