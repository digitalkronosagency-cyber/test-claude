import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1a6dff] mb-2">Azure Média</h1>
        <p className="text-gray-300 mb-8">Plateforme de suivi de projets digitaux</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/admin/login"
            className="bg-[#1a6dff] text-white px-6 py-3 rounded-lg hover:bg-[#1558d4] transition-colors"
          >
            Espace Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
