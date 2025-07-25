import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Plus,
  Search,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  Clock,
  Package,
  ShoppingCart
} from 'lucide-react'

const mockOrders = [
  {
    id: 'PED-2024-001',
    customer: 'Bar Central',
    customer_id: '1',
    status: 'preparing',
    total: 234.50,
    items_count: 5,
    created_at: '2024-01-15T10:30:00',
    delivery_date: '2024-01-16T09:00:00',
    salesperson: 'Carlos Vendedor'
  },
  {
    id: 'PED-2024-002',
    customer: 'Restaurante Marisol',
    customer_id: '2',
    status: 'ready',
    total: 567.80,
    items_count: 12,
    created_at: '2024-01-15T09:15:00',
    delivery_date: '2024-01-16T11:00:00',
    salesperson: 'María Comercial'
  },
  {
    id: 'PED-2024-003',
    customer: 'Cafetería Luna',
    customer_id: '3',
    status: 'received',
    total: 123.45,
    items_count: 3,
    created_at: '2024-01-15T14:20:00',
    delivery_date: '2024-01-17T08:30:00',
    salesperson: 'Carlos Vendedor'
  },
  {
    id: 'PED-2024-004',
    customer: 'Hotel Plaza',
    customer_id: '4',
    status: 'delivered',
    total: 890.25,
    items_count: 18,
    created_at: '2024-01-14T16:45:00',
    delivery_date: '2024-01-15T10:00:00',
    salesperson: 'Ana Ventas'
  }
]

const statusConfig = {
  received: { label: 'Recibido', color: 'bg-gray-100 text-gray-800', icon: Clock },
  preparing: { label: 'Preparando', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  ready: { label: 'Listo', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  delivering: { label: 'En Reparto', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle }
}

export function Orders() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false)

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: keyof typeof statusConfig) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="received">Recibido</SelectItem>
              <SelectItem value="preparing">Preparando</SelectItem>
              <SelectItem value="ready">Listo</SelectItem>
              <SelectItem value="delivering">En Reparto</SelectItem>
              <SelectItem value="delivered">Entregado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Pedido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Nuevo Pedido</DialogTitle>
              <DialogDescription>
                Crear un nuevo pedido para un cliente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Cliente</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Bar Central</SelectItem>
                      <SelectItem value="2">Restaurante Marisol</SelectItem>
                      <SelectItem value="3">Cafetería Luna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Fecha de Entrega</Label>
                  <Input id="delivery_date" type="datetime-local" />
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Productos del Pedido</Label>
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Select>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Cerveza Estrella Galicia 1/3</SelectItem>
                        <SelectItem value="2">Jamón Ibérico 100g</SelectItem>
                        <SelectItem value="3">Aceite Oliva Virgen Extra 1L</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="Cantidad" className="w-24" />
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-600">
                      Los productos seleccionados aparecerán aquí
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Crear Pedido
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+3 desde ayer</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Preparar</CardTitle>
            <Package className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">8</div>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listos</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">5</div>
            <p className="text-xs text-muted-foreground">Para entregar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€2,847</div>
            <p className="text-xs text-muted-foreground">Pedidos de hoy</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pedidos</CardTitle>
          <CardDescription>
            Controla el estado y progreso de todos los pedidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer}</div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order.salesperson}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status as keyof typeof statusConfig)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {order.items_count} productos
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold">
                    €{order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(order.delivery_date).toLocaleDateString('es-ES')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {order.status === 'ready' && (
                        <Button variant="ghost" size="sm" className="text-blue-600">
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}