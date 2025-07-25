import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { supabase } from '@/lib/supabase'
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  FileText,
  ArrowRight,
  AlertCircle,
  Zap
} from 'lucide-react'

interface Pedido {
  id: string
  numero_pedido: string
  cliente_id: string
  estatus: string
  fecha_pedido: string
  ruta: string
  notas_pedido: string | null
  entrega_estimada: string
  cliente?: {
    nombre: string
    direccion: string
  }
  lineas_pedido?: LineaPedido[]
}

interface LineaPedido {
  id: string
  producto_id: string
  cantidad: number
  picked: boolean
  producto?: {
    nombre: string
    formato: string
    imagen_url: string
  }
}

const statusColors = {
  'Pendiente': 'bg-orange-100 text-orange-800 border-orange-200',
  'En Picking': 'bg-blue-100 text-blue-800 border-blue-200',
  'En Playa': 'bg-purple-100 text-purple-800 border-purple-200',
  'En Reparto': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Entregado': 'bg-green-100 text-green-800 border-green-200'
}

const priorityColors = {
  'urgente': 'bg-red-100 text-red-800 border-red-200',
  'habitual': 'bg-gray-100 text-gray-800 border-gray-200'
}

export function WarehouseMobile() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [selectedPedidos, setSelectedPedidos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchPedidosPendientes = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          clientes:cliente_id (
            nombre,
            direccion
          ),
          lineas_pedido (
            *,
            productos:producto_id (
              nombre,
              formato,
              imagen_url
            )
          )
        `)
        .eq('estatus', 'Pendiente')
        .order('fecha_pedido', { ascending: true })

      if (error) throw error
      setPedidos(data || [])
    } catch (error) {
      console.error('Error fetching pedidos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPedidosPendientes()
  }, [])

  const handleSelectPedido = (pedidoId: string) => {
    setSelectedPedidos(prev => 
      prev.includes(pedidoId) 
        ? prev.filter(id => id !== pedidoId)
        : [...prev, pedidoId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPedidos.length === pedidos.length) {
      setSelectedPedidos([])
    } else {
      setSelectedPedidos(pedidos.map(p => p.id))
    }
  }

  const handleGenerarPicking = () => {
    if (selectedPedidos.length === 0) return
    
    // Aquí se generaría el PDF de picking
    console.log('Generando PDF para pedidos:', selectedPedidos)
    alert(`Generando PDF de picking para ${selectedPedidos.length} pedidos`)
  }

  const handleIniciarPicking = async () => {
    if (selectedPedidos.length === 0) return

    try {
      // Actualizar estado de pedidos seleccionados
      const { error } = await supabase
        .from('pedidos')
        .update({ estatus: 'En Picking' })
        .in('id', selectedPedidos)

      if (error) throw error

      // Navegar a la cola de picking
      navigate('/warehouse/picking', { 
        state: { selectedPedidos } 
      })
    } catch (error) {
      console.error('Error iniciando picking:', error)
    }
  }

  const getTotalProductos = (pedido: Pedido) => {
    return pedido.lineas_pedido?.reduce((total, linea) => total + linea.cantidad, 0) || 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header móvil */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Almacén</h1>
              <p className="text-sm text-gray-600">Pedidos pendientes de picking</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{pedidos.length}</div>
              <div className="text-xs text-gray-500">pedidos</div>
            </div>
          </div>

          {/* Controles de selección */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedPedidos.length === pedidos.length && pedidos.length > 0}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-sm font-medium">
                {selectedPedidos.length > 0 
                  ? `${selectedPedidos.length} seleccionados`
                  : 'Seleccionar todos'
                }
              </span>
            </div>
            
            {selectedPedidos.length > 0 && (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerarPicking}
                  className="text-xs"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lista de pedidos */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {pedidos.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Todo al día!
                </h3>
                <p className="text-gray-600">
                  No hay pedidos pendientes de picking
                </p>
              </CardContent>
            </Card>
          ) : (
            pedidos.map((pedido) => (
              <Card 
                key={pedido.id} 
                className={`transition-all duration-200 ${
                  selectedPedidos.includes(pedido.id) 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedPedidos.includes(pedido.id)}
                      onCheckedChange={() => handleSelectPedido(pedido.id)}
                      className="mt-1 data-[state=checked]:bg-blue-600"
                    />
                    
                    <div className="flex-1 min-w-0">
                      {/* Header del pedido */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-sm font-bold text-gray-900">
                            {pedido.numero_pedido}
                          </span>
                          <Badge className={priorityColors[pedido.entrega_estimada as keyof typeof priorityColors]}>
                            {pedido.entrega_estimada === 'urgente' ? (
                              <Zap className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {pedido.entrega_estimada}
                          </Badge>
                        </div>
                        <Badge className={statusColors[pedido.estatus as keyof typeof statusColors]}>
                          {pedido.estatus}
                        </Badge>
                      </div>

                      {/* Cliente y ruta */}
                      <div className="mb-3">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {pedido.cliente?.nombre}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate">{pedido.cliente?.direccion}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Truck className="h-3 w-3 mr-1" />
                          <span>{pedido.ruta}</span>
                        </div>
                      </div>

                      {/* Productos */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Productos
                          </span>
                          <span className="text-sm font-bold text-blue-600">
                            {getTotalProductos(pedido)} unidades
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          {pedido.lineas_pedido?.slice(0, 3).map((linea) => (
                            <div key={linea.id} className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                                {linea.producto?.imagen_url ? (
                                  <img 
                                    src={linea.producto.imagen_url} 
                                    alt={linea.producto.nombre}
                                    className="w-6 h-6 object-cover rounded"
                                  />
                                ) : (
                                  <Package className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {linea.producto?.nombre}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {linea.producto?.formato}
                                </p>
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {linea.cantidad}
                              </div>
                            </div>
                          ))}
                          
                          {(pedido.lineas_pedido?.length || 0) > 3 && (
                            <div className="text-xs text-gray-500 text-center pt-1">
                              +{(pedido.lineas_pedido?.length || 0) - 3} productos más
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notas */}
                      {pedido.notas_pedido && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                          <div className="flex items-start space-x-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-yellow-800">
                              {pedido.notas_pedido}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Fecha */}
                      <div className="text-xs text-gray-500 mt-2">
                        Pedido: {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Botón flotante para iniciar picking */}
      {selectedPedidos.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-20">
          <Button
            onClick={handleIniciarPicking}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-medium shadow-lg"
            size="lg"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Iniciar Picking ({selectedPedidos.length})
          </Button>
        </div>
      )}
    </div>
  )
}