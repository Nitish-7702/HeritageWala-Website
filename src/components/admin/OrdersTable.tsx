'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ChefHat, 
  Package 
} from 'lucide-react'
import { logger } from '@/lib/logger'

// Types based on Prisma schema
type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

interface MenuItem {
  name: string
  price: number
}

interface OrderItem {
  id: string
  quantity: number
  price: number
  menuItem: MenuItem
}

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  total: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
  PREPARING: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  READY: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  COMPLETED: 'bg-green-500/20 text-green-400 border-green-500/50',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/50',
}

const statusIcons: Record<OrderStatus, any> = {
  PENDING: Clock,
  PREPARING: ChefHat,
  READY: Package,
  COMPLETED: CheckCircle,
  CANCELLED: XCircle,
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (error) {
      logger.error('Failed to fetch orders', { error })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (!res.ok) {
        // Revert on failure
        fetchOrders()
        throw new Error('Failed to update status')
      }
    } catch (error) {
      logger.error('Error updating order status', { error, orderId, newStatus })
      alert('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerPhone.includes(search)
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
      {/* Controls */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:border-amber-500 text-white placeholder-gray-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Order ID</th>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Items</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <>
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-300 font-mono">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {order.items.length} items
                  </td>
                  <td className="px-6 py-4 text-amber-400 font-medium">
                    £{order.total}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {statusIcons[order.status] && (() => {
                        const Icon = statusIcons[order.status]
                        return <Icon className="w-3 h-3" />
                      })()}
                      {order.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/20"
                    >
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Order Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-sm p-2 bg-white/5 rounded-lg border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs font-medium">
                                      {item.quantity}x
                                    </div>
                                    <span className="text-gray-200">{item.menuItem.name}</span>
                                  </div>
                                  <span className="text-gray-400">£{item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-400 mb-3">Update Status</h4>
                            <div className="flex flex-wrap gap-2">
                              {(['PENDING', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'] as OrderStatus[]).map((status) => (
                                <button
                                  key={status}
                                  onClick={() => updateStatus(order.id, status)}
                                  disabled={order.status === status}
                                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                                    order.status === status
                                      ? statusColors[status] + ' opacity-100 ring-2 ring-offset-2 ring-offset-black ring-amber-500/50'
                                      : 'border-white/10 text-gray-400 hover:bg-white/5 hover:text-white opacity-50 hover:opacity-100'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                            
                            {order.customerEmail && (
                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-400 mb-1">Customer Email</h4>
                                <p className="text-sm text-amber-500/80">{order.customerEmail}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </>
            ))}
            
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
