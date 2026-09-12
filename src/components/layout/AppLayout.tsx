import { Sidebar } from './Sidebar'

interface AppLayoutProps {
  children: React.ReactNode
}

// Layout principal avec sidebar fixe à gauche
// Toutes les pages protégées l'utilisent
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f8f9ff]">
      <Sidebar />
      {/* Contenu décalé de la largeur de la sidebar */}
      <main className="flex-1 ml-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
