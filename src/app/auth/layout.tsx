export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="flex min-h-screen items-center justify-center p-4">
          {children}
        </div>
      </div>
  )
}