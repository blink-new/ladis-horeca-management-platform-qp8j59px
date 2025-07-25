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
  Plus,
  FileText,
  Send,
  Download,
  Eye,
  Edit,
  Euro,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'

const mockInvoices = [
  {
    id: 'FAC-2024-001',
    customer: 'Bar Central',
    number: '2024/001',
    status: 'sent',
    subtotal: 234.50,
    vat: 49.25,
    total: 283.75,
    issue_date: '2024-01-15',
    due_date: '2024-02-14',
    payment_terms: '30 días'
  },
  {
    id: 'FAC-2024-002',
    customer: 'Restaurante Marisol',
    number: '2024/002',
    status: 'paid',
    subtotal: 567.80,
    vat: 119.24,
    total: 687.04,
    issue_date: '2024-01-14',
    due_date: '2024-02-13',
    payment_terms: '30 días'
  },
  {
    id: 'FAC-2024-003',
    customer: 'Cafetería Luna',
    number: '2024/003',
    status: 'overdue',
    subtotal: 123.45,
    vat: 25.92,
    total: 149.37,
    issue_date: '2024-01-10',
    due_date: '2024-02-09',
    payment_terms: '30 días'
  },
  {
    id: 'FAC-2024-004',
    customer: 'Hotel Plaza',
    number: '2024/004',
    status: 'draft',
    subtotal: 890.25,
    vat: 186.95,
    total: 1077.20,
    issue_date: '2024-01-15',
    due_date: '2024-02-14',
    payment_terms: '30 días'
  }
]

const mockPendingOrders = [
  {
    id: 'PED-2024-001',
    customer: 'Bar Central',
    total: 234.50,
    delivery_date: '2024-01-16',
    items: 5
  },
  {
    id: 'PED-2024-005',
    customer: 'Restaurante Nuevo',
    total: 456.80,
    delivery_date: '2024-01-17',
    items: 8
  }
]

const statusConfig = {
  draft: { label: 'Borrador', color: 'bg-gray-100 text-gray-800', icon: FileText },
  sent: { label: 'Enviada', color: 'bg-blue-100 text-blue-800', icon: Send },
  paid: { label: 'Pagada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  overdue: { label: 'Vencida', color: 'bg-red-100 text-red-800', icon: AlertCircle }
}

export function Invoicing() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isNewInvoiceDialogOpen, setIsNewInvoiceDialogOpen] = useState(false)

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || invoice.status === selectedStatus
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
              placeholder="Buscar facturas..."
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
              <SelectItem value="draft">Borrador</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="paid">Pagada</SelectItem>
              <SelectItem value="overdue">Vencida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isNewInvoiceDialogOpen} onOpenChange={setIsNewInvoiceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Nueva Factura
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Factura</DialogTitle>
                <DialogDescription>
                  Crear una nueva factura desde pedidos entregados
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
                    <Label htmlFor="payment_terms">Forma de Pago</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="30 días" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="contado">Contado</SelectItem>
                        <SelectItem value="15">15 días</SelectItem>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="60">60 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Pedidos a Facturar</Label>
                  <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                    {mockPendingOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <input type="checkbox" className="rounded" />
                          <div>
                            <div className="font-medium text-sm">{order.id}</div>
                            <div className="text-xs text-gray-500">
                              {order.items} productos • {new Date(order.delivery_date).toLocaleDateString('es-ES')}
                            </div>
                          </div>
                        </div>
                        <div className="font-semibold text-sm">€{order.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total a Facturar:</span>
                    <span className="text-xl font-bold text-blue-600">€691.30</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsNewInvoiceDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Crear Factura
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
            <CardTitle className="text-sm font-medium">Facturas del Mes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+8 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendiente de Cobro</CardTitle>
            <Euro className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€12,847</div>
            <p className="text-xs text-muted-foreground">23 facturas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">€2,156</div>
            <p className="text-xs text-muted-foreground">5 facturas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobrado este Mes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€28,945</div>
            <p className="text-xs text-muted-foreground">+15.2% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="pending">Pedidos por Facturar</TabsTrigger>
          <TabsTrigger value="recurring">Facturación Recurrente</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Facturas</CardTitle>
              <CardDescription>
                Controla el estado y cobro de todas las facturas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Subtotal</TableHead>
                    <TableHead>IVA</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha Emisión</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.customer}</TableCell>
                      <TableCell>
                        {getStatusBadge(invoice.status as keyof typeof statusConfig)}
                      </TableCell>
                      <TableCell>€{invoice.subtotal.toFixed(2)}</TableCell>
                      <TableCell>€{invoice.vat.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">€{invoice.total.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(invoice.issue_date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(invoice.due_date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'draft' && (
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {invoice.status === 'sent' && (
                            <Button variant="ghost" size="sm" className="text-green-600">
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendientes de Facturar</CardTitle>
              <CardDescription>
                Pedidos entregados que están listos para facturar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha Entrega</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPendingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.items} productos</TableCell>
                      <TableCell className="font-semibold">€{order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(order.delivery_date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          Facturar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Facturación Recurrente</CardTitle>
              <CardDescription>
                Configura facturas automáticas para clientes con cuotas fijas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No hay facturas recurrentes configuradas
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Configura facturas automáticas para clientes con servicios periódicos
                </p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Configurar Facturación Recurrente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}