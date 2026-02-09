'use client'

import { motion } from 'framer-motion'
import OrdersTable from '@/components/admin/OrdersTable'

export default function AdminOrdersPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-gray-400">View and manage customer orders in real-time.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <OrdersTable />
      </motion.div>
    </div>
  )
}
