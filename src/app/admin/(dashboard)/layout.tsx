import Sidebar from '@/components/admin/Sidebar'
import TopBar from '@/components/admin/TopBar'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-stone-950 text-stone-200 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-8 bg-stone-950/50">
          {children}
        </main>
      </div>
    </div>
  )
}
