export interface User {
  id: string
  email: string
  name: string
  role: 'manager' | 'salesperson' | 'admin' | 'product_manager' | 'warehouse'
  avatar?: string
}

export interface Product {
  id: string
  sku: string
  ean?: string
  name: string
  description?: string
  category: string
  subcategory?: string
  brand?: string
  supplier?: string
  cost_price: number
  sale_price: number
  margin: number
  vat_rate: number
  weight?: number
  volume?: number
  format: string
  images: string[]
  stock: number
  location?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  tax_id: string
  email?: string
  phone?: string
  address: string
  city: string
  postal_code: string
  payment_terms: string
  price_list: string
  discount: number
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id: string
  customer_name: string
  status: 'received' | 'preparing' | 'ready' | 'delivering' | 'delivered'
  total: number
  items: OrderItem[]
  created_at: string
  delivery_date?: string
  notes?: string
}

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
}

export interface Invoice {
  id: string
  customer_id: string
  customer_name: string
  number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  subtotal: number
  vat: number
  total: number
  issue_date: string
  due_date: string
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  vat_rate: number
  total: number
}

export interface StockMovement {
  id: string
  product_id: string
  product_name: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reference?: string
  created_at: string
  user_id: string
}