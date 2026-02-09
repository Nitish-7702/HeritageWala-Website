import { prisma } from '@/lib/prisma'
import MenuTable from '@/components/admin/MenuTable'

export default async function AdminMenuPage() {
  const [rawItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.menuCategory.findMany({ orderBy: { name: 'asc' } })
  ])

  const items = rawItems.map(item => ({
    ...item,
    price: Number(item.price),
    image: item.image || ''
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-stone-100">Menu Management</h1>
      </div>
      <MenuTable items={items} categories={categories} />
    </div>
  )
}
