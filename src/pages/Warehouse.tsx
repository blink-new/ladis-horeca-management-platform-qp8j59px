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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  FileText,
  Truck,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react'

const mockPickingLists = [
  {
    id: 'PICK-001',
    order_id: 'PED-2024-001',
    customer: 'Bar Central',
    status: 'pending',
    items: [
      { product: 'Cerveza Estrella Galicia 1/3', location: 'A-01-01', quantity: 24 },
      { product: 'Jamón Ibérico 100g', location: 'B-02-03', quantity: 5 }
    ],
    created_at: '2024-01-15T10:30:00'
  },
  {
    id: 'PICK-002',
    order_id: 'PED-2024-002',
    customer: 'Restaurante Marisol',
    status: 'in_progress',
    items: [
      { product: 'Aceite Oliva Virgen Extra 1L', location: 'C-01-02', quantity: 12 },
      { product: 'Queso Manchego Curado', location: 'B-01-05', quantity: 8 }
    ],
    created_at: '2024-01-15T09:15:00'
  }
]

const mockStockMovements = [
  {
    id: '1',
    product: 'Cerveza Estrella Galicia 1/3',
    type: 'in',
    quantity: 120,
    reference: 'REC-001',
    user: 'Ana Almacén',
    created_at: '2024-01-15T08:00:00'
  },
  {
    id: '2',
    product: 'Jamón Ibérico 100g',
    type: 'out',
    quantity: -24,
    reference: 'PED-2024-001',
    user: 'José Picking',
    created_at: '2024-01-15T10:30:00'
  },
  {
    id: '3',
    product: 'Aceite Oliva Virgen Extra 1L',
    type: 'adjustment',
    quantity: -2,
    reference: 'MERMA-001',
    user: 'Ana Almacén',
    created_at: '2024-01-15T14:20:00'
  }
]

const mockLocations = [
  { zone: 'A', description: 'Bebidas Frías', products: 45 },
  { zone: 'B', description: 'Embutidos y Quesos', products: 32 },
  { zone: 'C', description: 'Aceites y Conservas', products: 28 },
  { zone: 'D', description: 'Productos Secos', products: 67 }
]

export function Warehouse() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isStockAdjustmentOpen, setIsStockAdjustmentOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar productos, ubicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generar Picking
          </Button>
          <Dialog open={isStockAdjustmentOpen} onOpenChange={setIsStockAdjustmentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajuste de Stock
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajuste de Stock</DialogTitle>
                <DialogDescription>
                  Registrar entrada, salida o ajuste de inventario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Producto</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cerveza Estrella Galicia 1/3</SelectItem>
                      <SelectItem value="2">Jamón Ibérico 100g</SelectItem>
                      <SelectItem value="3">Aceite Oliva Virgen Extra 1L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Movimiento</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in">Entrada</SelectItem>
                        <SelectItem value="out">Salida</SelectItem>
                        <SelectItem value="adjustment">Ajuste</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Referencia</Label>
                  <Input id="reference" placeholder="REC-001, MERMA-001, etc." />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsStockAdjustmentOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Registrar Movimiento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Picking Pendiente</CardTitle>
            <Package className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">5</div>
            <p className="text-xs text-muted-foreground">Listas por procesar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Ubicados</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">En 4 zonas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimientos Hoy</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Entradas y salidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">8</div>
            <p className="text-xs text-muted-foreground">Productos bajo mínimo</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="picking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="picking">Picking</TabsTrigger>
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="locations">Ubicaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="picking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listas de Picking</CardTitle>
              <CardDescription>
                Gestiona la preparación de pedidos por ubicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lista</TableHead>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Creado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPickingLists.map((list) => (
                    <TableRow key={list.id}>
                      <TableCell className="font-mono font-medium">{list.id}</TableCell>
                      <TableCell className="font-mono">{list.order_id}</TableCell>
                      <TableCell>{list.customer}</TableCell>
                      <TableCell>
                        <Badge variant={list.status === 'pending' ? 'outline' : 'secondary'}>
                          {list.status === 'pending' ? 'Pendiente' : 'En Proceso'}
                        </Badge>
                      </TableCell>
                      <TableCell>{list.items.length} productos</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(list.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {list.status === 'pending' && (
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <CheckCircle className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Stock</CardTitle>
              <CardDescription>
                Historial de entradas, salidas y ajustes de inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">{movement.product}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {movement.type === 'in' ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : movement.type === 'out' ? (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                          <span className="capitalize">
                            {movement.type === 'in' ? 'Entrada' : 
                             movement.type === 'out' ? 'Salida' : 'Ajuste'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{movement.reference}</TableCell>
                      <TableCell className="text-sm text-gray-600">{movement.user}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(movement.created_at).toLocaleString('es-ES')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {mockLocations.map((location) => (
              <Card key={location.zone}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Zona {location.zone}</CardTitle>
                  <CardDescription>{location.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{location.products}</div>
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">productos ubicados</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mapa de Ubicaciones</CardTitle>
              <CardDescription>
                Distribución de productos por zonas del almacén
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-4 rounded text-center">
                  <div className="font-semibold text-blue-800">ZONA A</div>
                  <div className="text-sm text-blue-600">Bebidas Frías</div>
                  <div className="text-xs text-blue-500 mt-1">45 productos</div>
                </div>
                <div className="bg-green-100 p-4 rounded text-center">
                  <div className="font-semibold text-green-800">ZONA B</div>
                  <div className="text-sm text-green-600">Embutidos</div>
                  <div className="text-xs text-green-500 mt-1">32 productos</div>
                </div>
                <div className="bg-yellow-100 p-4 rounded text-center">
                  <div className="font-semibold text-yellow-800">ZONA C</div>
                  <div className="text-sm text-yellow-600">Conservas</div>
                  <div className="text-xs text-yellow-500 mt-1">28 productos</div>
                </div>
                <div className="bg-purple-100 p-4 rounded text-center">
                  <div className="font-semibold text-purple-800">ZONA D</div>
                  <div className="text-sm text-purple-600">Secos</div>
                  <div className="text-xs text-purple-500 mt-1">67 productos</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}