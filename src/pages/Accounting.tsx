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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Euro,
  FileText,
  Calculator,
  Download,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react'

const mockJournalEntries = [
  {
    id: 'AS-2024-001',
    date: '2024-01-15',
    description: 'Venta FAC-2024-001 - Bar Central',
    reference: 'FAC-2024-001',
    debit_account: '430',
    debit_description: 'Clientes',
    debit_amount: 283.75,
    credit_account: '700',
    credit_description: 'Ventas de mercaderías',
    credit_amount: 234.50,
    vat_account: '477',
    vat_amount: 49.25
  },
  {
    id: 'AS-2024-002',
    date: '2024-01-15',
    description: 'Cobro FAC-2024-002 - Restaurante Marisol',
    reference: 'COB-001',
    debit_account: '572',
    debit_description: 'Bancos',
    debit_amount: 687.04,
    credit_account: '430',
    credit_description: 'Clientes',
    credit_amount: 687.04
  }
]

const mockAccounts = [
  { code: '430', name: 'Clientes', balance: 12847.50, type: 'asset' },
  { code: '572', name: 'Bancos', balance: 45230.80, type: 'asset' },
  { code: '700', name: 'Ventas de mercaderías', balance: -28945.60, type: 'income' },
  { code: '477', name: 'IVA Repercutido', balance: -6078.58, type: 'liability' },
  { code: '600', name: 'Compras', balance: 18567.30, type: 'expense' },
  { code: '472', name: 'IVA Soportado', balance: 3899.13, type: 'asset' }
]

const mockTaxReports = [
  {
    period: '2024-01',
    model: '303',
    description: 'IVA Trimestral',
    vat_collected: 6078.58,
    vat_paid: 3899.13,
    net_vat: 2179.45,
    status: 'pending'
  }
]

export function Accounting() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')

  const filteredEntries = mockJournalEntries.filter(entry => {
    return entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           entry.reference.toLowerCase().includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar asientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Enero 2024</SelectItem>
              <SelectItem value="2023-12">Diciembre 2023</SelectItem>
              <SelectItem value="2023-11">Noviembre 2023</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Libro
          </Button>
          <Button variant="outline">
            <Calculator className="mr-2 h-4 w-4" />
            Modelo 303
          </Button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">€28,945</div>
            <p className="text-xs text-muted-foreground">+15.2% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos del Mes</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">€18,567</div>
            <p className="text-xs text-muted-foreground">+8.3% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio Neto</CardTitle>
            <Euro className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">€10,378</div>
            <p className="text-xs text-muted-foreground">Margen: 35.9%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IVA a Pagar</CardTitle>
            <Calculator className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">€2,179</div>
            <p className="text-xs text-muted-foreground">Trimestre actual</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="journal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="journal">Libro Diario</TabsTrigger>
          <TabsTrigger value="accounts">Plan Contable</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
          <TabsTrigger value="tax">Fiscalidad</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Libro Diario</CardTitle>
              <CardDescription>
                Registro cronológico de todos los asientos contables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asiento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Cuenta Debe</TableHead>
                    <TableHead>Importe Debe</TableHead>
                    <TableHead>Cuenta Haber</TableHead>
                    <TableHead>Importe Haber</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono font-medium">{entry.id}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(entry.date).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{entry.description}</TableCell>
                      <TableCell className="font-mono text-sm">{entry.reference}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-mono text-sm">{entry.debit_account}</div>
                          <div className="text-xs text-gray-500">{entry.debit_description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">€{entry.debit_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-mono text-sm">{entry.credit_account}</div>
                          <div className="text-xs text-gray-500">{entry.credit_description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">€{entry.credit_amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan General Contable</CardTitle>
              <CardDescription>
                Cuentas contables y sus saldos actuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre de la Cuenta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAccounts.map((account) => (
                    <TableRow key={account.code}>
                      <TableCell className="font-mono font-medium">{account.code}</TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <Badge variant={
                          account.type === 'asset' ? 'default' :
                          account.type === 'liability' ? 'secondary' :
                          account.type === 'income' ? 'outline' : 'destructive'
                        }>
                          {account.type === 'asset' ? 'Activo' :
                           account.type === 'liability' ? 'Pasivo' :
                           account.type === 'income' ? 'Ingreso' : 'Gasto'}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${
                        account.balance >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        €{Math.abs(account.balance).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Cuenta de Pérdidas y Ganancias
                </CardTitle>
                <CardDescription>Resumen de ingresos y gastos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Ingresos por Ventas</span>
                  <span className="font-semibold text-green-600">€28,945.60</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Coste de Mercancías</span>
                  <span className="font-semibold text-red-600">€18,567.30</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium text-lg">Margen Bruto</span>
                  <span className="font-bold text-blue-600 text-lg">€10,378.30</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Margen (%)</span>
                  <span className="text-sm font-medium">35.9%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="mr-2 h-5 w-5" />
                  Balance de Situación
                </CardTitle>
                <CardDescription>Activos, pasivos y patrimonio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">ACTIVO</h4>
                  <div className="flex justify-between py-1">
                    <span className="text-sm">Clientes</span>
                    <span className="text-sm font-medium">€12,847.50</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-sm">Bancos</span>
                    <span className="text-sm font-medium">€45,230.80</span>
                  </div>
                  <div className="flex justify-between py-1 border-t mt-2 pt-2">
                    <span className="font-medium">Total Activo</span>
                    <span className="font-semibold">€58,078.30</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600 mb-2">PASIVO</h4>
                  <div className="flex justify-between py-1">
                    <span className="text-sm">IVA Repercutido</span>
                    <span className="text-sm font-medium">€6,078.58</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informes Fiscales</CardTitle>
              <CardDescription>
                Generación de modelos de IVA e IRPF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Período</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>IVA Repercutido</TableHead>
                    <TableHead>IVA Soportado</TableHead>
                    <TableHead>IVA a Pagar</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTaxReports.map((report) => (
                    <TableRow key={report.period}>
                      <TableCell className="font-mono">{report.period}</TableCell>
                      <TableCell className="font-mono font-medium">{report.model}</TableCell>
                      <TableCell>{report.description}</TableCell>
                      <TableCell className="font-semibold">€{report.vat_collected.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">€{report.vat_paid.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold text-orange-600">
                        €{report.net_vat.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={report.status === 'pending' ? 'outline' : 'default'}>
                          {report.status === 'pending' ? 'Pendiente' : 'Presentado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Generar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Próximos Vencimientos Fiscales</CardTitle>
              <CardDescription>
                Calendario de obligaciones tributarias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-medium">Modelo 303 - IVA 1T 2024</div>
                      <div className="text-sm text-gray-600">Vencimiento: 20 de Abril 2024</div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    Próximo
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Modelo 111 - IRPF 1T 2024</div>
                      <div className="text-sm text-gray-600">Vencimiento: 20 de Abril 2024</div>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    Próximo
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}