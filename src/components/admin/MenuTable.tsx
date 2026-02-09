'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import Image from 'next/image'

type Category = {
  id: string
  name: string
}

type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  isVeg: boolean
  spiceLevel: number
  image: string
  categoryId: string
  category: Category
}

export default function MenuTable({ items, categories }: { items: MenuItem[], categories: Category[] }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    isVeg: true,
    spiceLevel: 0,
    categoryId: categories[0]?.id || '',
    image: ''
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      isVeg: true,
      spiceLevel: 0,
      categoryId: categories[0]?.id || '',
      image: ''
    })
    setIsAdding(false)
    setIsEditing(null)
  }

  const handleEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      isVeg: item.isVeg,
      spiceLevel: item.spiceLevel,
      categoryId: item.categoryId,
      image: item.image
    })
    setIsEditing(item.id)
    setIsAdding(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    setLoading(true)
    try {
      await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' })
      router.refresh()
    } catch (error) {
      console.error('Failed to delete', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isAdding) {
        await fetch('/api/admin/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      } else if (isEditing) {
        await fetch(`/api/admin/menu/${isEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
      }
      resetForm()
      router.refresh()
    } catch (error) {
      console.error('Failed to save', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => { setIsAdding(true); setIsEditing(null); }}
          className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add New Item
        </button>
      </div>

      {(isAdding || isEditing) && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-stone-100">{isAdding ? 'Add New Item' : 'Edit Item'}</h3>
            <button onClick={resetForm} className="text-stone-500 hover:text-stone-300">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Name</label>
              <input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Category</label>
              <select
                value={formData.categoryId}
                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-200"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-stone-400">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Price (£)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Spice Level (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                value={formData.spiceLevel}
                onChange={e => setFormData({ ...formData, spiceLevel: Number(e.target.value) })}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-stone-400">Type</label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 text-stone-300">
                  <input
                    type="radio"
                    checked={formData.isVeg}
                    onChange={() => setFormData({ ...formData, isVeg: true })}
                    className="accent-green-500"
                  />
                  Veg
                </label>
                <label className="flex items-center gap-2 text-stone-300">
                  <input
                    type="radio"
                    checked={!formData.isVeg}
                    onChange={() => setFormData({ ...formData, isVeg: false })}
                    className="accent-red-500"
                  />
                  Non-Veg
                </label>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold py-2 px-6 rounded-lg flex items-center gap-2"
              >
                {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save Item</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-950 text-stone-400">
            <tr>
              <th className="p-4 font-medium">Item</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-800/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-stone-200">{item.name}</div>
                  <div className="text-sm text-stone-500 line-clamp-1">{item.description}</div>
                </td>
                <td className="p-4 text-stone-300">{item.category.name}</td>
                <td className="p-4 text-amber-500 font-bold">£{item.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${item.isVeg ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {item.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-stone-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-stone-500">
                  No items found. Click "Add New Item" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
