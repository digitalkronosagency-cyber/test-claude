import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-2">digitalkronosagency</h1>
        <p className="text-gray-400 mb-8">Plateforme de suivi de projets web BTP</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/admin/login"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Espace Admin
          </Link>
        </div>
      </div>
    </div>
  )
}
