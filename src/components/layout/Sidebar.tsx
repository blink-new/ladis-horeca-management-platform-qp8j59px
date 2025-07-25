import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  FileText,
  Calculator,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  DollarSign,
  Building2
} from 'lucide-react'

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    roles: ['manager', 'admin', 'salesperson', 'product_manager', 'warehouse']
  },
  {
    name: 'Catálogo (PIM)',
    href: '/catalog',
    icon: Package,
    roles: ['manager', 'admin', 'product_manager']
  },
  {
    name: 'Clientes',
    href: '/customers',
    icon: Users,
    roles: ['manager', 'admin', 'salesperson']
  },
  {
    name: 'Pedidos',
    href: '/orders',
    icon: ShoppingCart,
    roles: ['manager', 'admin', 'salesperson', 'warehouse']
  },
  {
    name: 'Almacén',
    href: '/warehouse',
    icon: Warehouse,
    roles: ['manager', 'admin', 'warehouse']
  },
  {
    name: 'Compras',
    href: '/purchases',
    icon: ShoppingBag,
    roles: ['manager', 'admin', 'product_manager']
  },
  {
    name: 'Presupuestos y Precios',
    href: '/quotes',
    icon: DollarSign,
    roles: ['manager', 'admin', 'product_manager']
  },
  {
    name: 'Proveedores',
    href: '/suppliers',
    icon: Building2,
    roles: ['manager', 'admin', 'product_manager']
  },
  {
    name: 'Facturación',
    href: '/invoicing',
    icon: FileText,
    roles: ['manager', 'admin']
  },
  {
    name: 'Contabilidad',
    href: '/accounting',
    icon: Calculator,
    roles: ['manager', 'admin']
  },
  {
    name: 'Configuración',
    href: '/settings',
    icon: Settings,
    roles: ['manager', 'admin']
  }
]

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const userRole = 'manager' // TODO: Get from auth context

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  return (
    <div className={cn(
      'flex flex-col border-r bg-white transition-all duration-300',
      collapsed ? 'w-16' : 'w-64',
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-semibold text-lg">Ladis.com</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                <item.icon className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )} />
                {!collapsed && (
                  <span className="ml-3 truncate">{item.name}</span>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <>
          <Separator />
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Usuario Demo
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Gerente
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}