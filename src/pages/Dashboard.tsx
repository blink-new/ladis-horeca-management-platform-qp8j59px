import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Euro,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Plus,
  FileText,
  UserPlus
} from 'lucide-react'

const kpis = [
  {
    title: 'Ventas del Día',
    value: '€2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Euro
  },
  {
    title: 'Pedidos Pendientes',
    value: '23',
    change: '+3',
    trend: 'up',
    icon: ShoppingCart
  },
  {
    title: 'Productos Bajo Stock',
    value: '8',
    change: '-2',
    trend: 'down',
    icon: Package
  },
  {
    title: 'Clientes Activos',
    value: '156',
    change: '+5',
    trend: 'up',
    icon: Users
  }
]

const topProducts = [
  { name: 'Cerveza Estrella Galicia 1/3', sales: 245, revenue: '€1,225' },
  { name: 'Jamón Ibérico 100g', sales: 89, revenue: '€890' },
  { name: 'Aceite Oliva Virgen Extra 1L', sales: 156, revenue: '€780' },
  { name: 'Queso Manchego Curado', sales: 67, revenue: '€670' },
  { name: 'Vino Rioja Reserva', sales: 34, revenue: '€510' }
]

const recentActivity = [
  { action: 'Nuevo pedido #PED-2024-001', user: 'Carlos Vendedor', time: 'hace 5 min', type: 'order' },
  { action: 'Factura #FAC-2024-089 pagada', user: 'Sistema', time: 'hace 15 min', type: 'payment' },
  { action: 'Stock actualizado: Cerveza Estrella', user: 'Ana Almacén', time: 'hace 30 min', type: 'stock' },
  { action: 'Nuevo cliente: Restaurante El Rincón', user: 'María Comercial', time: 'hace 1 hora', type: 'customer' },
  { action: 'Pedido #PED-2024-000 entregado', user: 'José Reparto', time: 'hace 2 horas', type: 'delivery' }
]

const pendingOrders = [
  { id: 'PED-2024-001', customer: 'Bar Central', total: '€234.50', status: 'preparing' },
  { id: 'PED-2024-002', customer: 'Restaurante Marisol', total: '€567.80', status: 'ready' },
  { id: 'PED-2024-003', customer: 'Cafetería Luna', total: '€123.45', status: 'received' }
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Pedido
        </Button>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Cliente
        </Button>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Crear Factura
        </Button>
        <Button variant="outline">
          <Package className="mr-2 h-4 w-4" />
          Añadir Producto
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {kpi.change}
                </span>
                <span className="ml-1">desde ayer</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Top Products */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>Top 5 productos esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate max-w-[150px]">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.sales} unidades
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600">
                    {product.revenue}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Pedidos Pendientes</CardTitle>
            <CardDescription>Pedidos por preparar y entregar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-xs text-gray-500">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{order.total}</p>
                    <Badge 
                      variant={
                        order.status === 'ready' ? 'default' :
                        order.status === 'preparing' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {order.status === 'ready' ? 'Listo' :
                       order.status === 'preparing' ? 'Preparando' : 'Recibido'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'order' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    activity.type === 'stock' ? 'bg-orange-500' :
                    activity.type === 'customer' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-800">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Alertas del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-orange-700">
              • 8 productos tienen stock bajo el mínimo establecido
            </p>
            <p className="text-sm text-orange-700">
              • 3 facturas vencen en los próximos 7 días
            </p>
            <p className="text-sm text-orange-700">
              • Pedido #PED-2024-001 lleva más de 2 horas en preparación
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}