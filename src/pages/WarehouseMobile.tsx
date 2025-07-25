import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Package,
  Clock,
  CheckCircle,
  Truck,
  FileText,
  AlertCircle,
  Calendar,
  MapPin,
  User
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

interface Order {
  id: string
  cliente: string
  ruta: string
  estado: string
  fecha_pedido: string
  fecha_entrega: string
  prioridad: string
  notas: string
  total_items: number
  total_articulos: number
}

export function WarehouseMobile() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoute, setSelectedRoute] = useState('all')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes(nombre),
          lineas_pedido(cantidad)
        `)
        .order('fecha_pedido', { ascending: false })

      if (error) throw error

      const formattedOrders = data?.map(order => {
        // Calcular fecha de entrega basada en prioridad
        const fechaPedido = new Date(order.fecha_pedido)
        const fechaEntrega = new Date(fechaPedido)
        if (order.entrega_estimada === 'urgente') {
          fechaEntrega.setDate(fechaEntrega.getDate() + 1) // Entrega al día siguiente
        } else {
          fechaEntrega.setDate(fechaEntrega.getDate() + 3) // Entrega en 3 días
        }

        return {
          id: order.id,
          cliente: order.clientes?.nombre || 'Cliente desconocido',
          ruta: order.ruta,
          estado: order.estatus,
          fecha_pedido: order.fecha_pedido,
          fecha_entrega: fechaEntrega.toISOString(),
          prioridad: order.entrega_estimada, // 'urgente' o 'habitual'
          notas: order.notas_pedido || '',
          total_items: order.lineas_pedido?.length || 0,
          total_articulos: order.lineas_pedido?.reduce((sum: number, line: any) => sum + line.cantidad, 0) || 0
        }
      }) || []

      setOrders(formattedOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleOrderSelection = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId])
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId))
    }
  }

  const handleSelectAll = (orders: Order[], checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, ...orders.map(o => o.id)])
    } else {
      const orderIds = orders.map(o => o.id)
      setSelectedOrders(selectedOrders.filter(id => !orderIds.includes(id)))
    }
  }

  const startPicking = async () => {
    if (selectedOrders.length === 0) return

    try {
      // Actualizar estado de pedidos seleccionados a "En Picking"
      const { error } = await supabase
        .from('pedidos')
        .update({ estatus: 'En Picking' })
        .in('id', selectedOrders)

      if (error) throw error

      // Navegar a la cola de picking con los pedidos seleccionados
      navigate('/picking-queue', { 
        state: { selectedOrderIds: selectedOrders } 
      })
    } catch (error) {
      console.error('Error starting picking:', error)
    }
  }

  const generatePickingPDF = () => {
    // Aquí iría la lógica para generar el PDF
    console.log('Generando PDF para pedidos:', selectedOrders)
    alert('Funcionalidad de PDF en desarrollo')
  }

  const getFilteredOrders = (status: string) => {
    return orders.filter(order => {
      const matchesStatus = status === 'all' || order.estado === status
      const matchesSearch = order.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.ruta.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRoute = selectedRoute === 'all' || order.ruta === selectedRoute
      return matchesStatus && matchesSearch && matchesRoute
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'En Picking':
        return <Package className="h-4 w-4 text-blue-500" />
      case 'Preparado':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'En Reparto':
        return <Truck className="h-4 w-4 text-purple-500" />
      case 'Entregado':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-orange-100 text-orange-800'
      case 'En Picking':
        return 'bg-blue-100 text-blue-800'
      case 'Preparado':
        return 'bg-green-100 text-green-800'
      case 'En Reparto':
        return 'bg-purple-100 text-purple-800'
      case 'Entregado':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    return priority === 'urgente' 
      ? 'bg-red-100 text-red-800' 
      : 'bg-gray-100 text-gray-600'
  }

  const renderOrdersTable = (filteredOrders: Order[], showSelection: boolean = false) => (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pedidos de Almacén</CardTitle>
        <CardDescription>
          Selecciona los pedidos para iniciar el proceso de picking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por cliente o ruta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRoute} onValueChange={setSelectedRoute}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por ruta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las rutas</SelectItem>
              <SelectItem value="Ruta A">Ruta A</SelectItem>
              <SelectItem value="Ruta B">Ruta B</SelectItem>
              <SelectItem value="Ruta C">Ruta C</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Acciones */}
        {showSelection && selectedOrders.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 p-4 bg-blue-50 rounded-lg">
            <Button 
              onClick={startPicking}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Package className="mr-2 h-4 w-4" />
              Iniciar Picking ({selectedOrders.length})
            </Button>
            <Button 
              variant="outline"
              onClick={generatePickingPDF}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generar PDF
            </Button>
          </div>
        )}

        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {showSelection && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredOrders.length > 0 && filteredOrders.every(order => selectedOrders.includes(order.id))}
                      onCheckedChange={(checked) => handleSelectAll(filteredOrders, checked as boolean)}
                    />
                  </TableHead>
                )}
                <TableHead>Cliente</TableHead>
                <TableHead>Ruta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Artículos</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Prioridad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={showSelection ? 8 : 7} className="text-center py-8">
                    Cargando pedidos...
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showSelection ? 8 : 7} className="text-center py-8 text-gray-500">
                    No hay pedidos que mostrar
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    {showSelection && (
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleOrderSelection(order.id, checked as boolean)}
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="font-medium">{order.cliente}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.fecha_pedido).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-sm font-medium">{order.ruta}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.estado)}
                        <Badge className={`text-xs ${getStatusColor(order.estado)}`}>
                          {order.estado}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {order.total_items}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {order.total_articulos}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {new Date(order.fecha_entrega).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getPriorityColor(order.prioridad)}`}>
                        {order.prioridad}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )

  // Estadísticas por estado
  const pendingOrders = orders.filter(o => o.estado === 'Pendiente')
  const pickingOrders = orders.filter(o => o.estado === 'En Picking')
  const readyOrders = orders.filter(o => o.estado === 'Preparado')

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
            <p className="text-xs text-muted-foreground">Por procesar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Picking</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pickingOrders.length}</div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{readyOrders.length}</div>
            <p className="text-xs text-muted-foreground">Listos para envío</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artículos Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingOrders.reduce((sum, order) => sum + order.total_articulos, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Por pickear</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="picking">En Picking</TabsTrigger>
          <TabsTrigger value="ready">Preparados</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {renderOrdersTable(getFilteredOrders('Pendiente'), true)}
        </TabsContent>

        <TabsContent value="picking" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Pedidos en Picking</h3>
            <Button 
              onClick={() => navigate('/picking-mobile')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Package className="h-4 w-4 mr-2" />
              Vista de Picking
            </Button>
          </div>
          {renderOrdersTable(getFilteredOrders('En Picking'), false)}
        </TabsContent>

        <TabsContent value="ready" className="space-y-4">
          {renderOrdersTable(getFilteredOrders('Preparado'), false)}
        </TabsContent>
      </Tabs>
    </div>
  )
}