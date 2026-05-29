import Link from "next/link";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-800">
            Blog Central
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm text-gray-600 hover:text-gray-800">
              Início
            </Link>
            <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-800">
              Admin
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Blog Central. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}