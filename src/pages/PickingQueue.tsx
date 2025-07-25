import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { supabase } from '@/lib/supabase'
import {
  Package,
  CheckCircle2,
  ArrowLeft,
  MapPin,
  Truck,
  Clock,
  Zap,
  Check,
  AlertCircle
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

const priorityColors = {
  'urgente': 'bg-red-100 text-red-800 border-red-200',
  'habitual': 'bg-gray-100 text-gray-800 border-gray-200'
}

export function PickingQueue() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  
  const selectedPedidos = useMemo(() => 
    location.state?.selectedPedidos || [], 
    [location.state?.selectedPedidos]
  )

  const fetchPedidosEnPicking = useCallback(async () => {
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
        .in('id', selectedPedidos)
        .eq('estatus', 'En Picking')
        .order('ruta', { ascending: true })

      if (error) throw error
      setPedidos(data || [])
    } catch (error) {
      console.error('Error fetching pedidos en picking:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedPedidos])

  useEffect(() => {
    if (selectedPedidos.length > 0) {
      fetchPedidosEnPicking()
    } else {
      setLoading(false)
    }
  }, [fetchPedidosEnPicking, selectedPedidos.length])

  const handleToggleProducto = async (lineaId: string, currentPicked: boolean) => {
    try {
      const { error } = await supabase
        .from('lineas_pedido')
        .update({ picked: !currentPicked })
        .eq('id', lineaId)

      if (error) throw error

      // Actualizar estado local
      setPedidos(prev => prev.map(pedido => ({
        ...pedido,
        lineas_pedido: pedido.lineas_pedido?.map(linea => 
          linea.id === lineaId 
            ? { ...linea, picked: !currentPicked }
            : linea
        )
      })))
    } catch (error) {
      console.error('Error updating picked status:', error)
    }
  }

  const handleCompletarPedido = async (pedidoId: string) => {
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estatus: 'En Playa' })
        .eq('id', pedidoId)

      if (error) throw error

      // Remover pedido de la lista
      setPedidos(prev => prev.filter(p => p.id !== pedidoId))
    } catch (error) {
      console.error('Error completing pedido:', error)
    }
  }

  const getPickingProgress = (pedido: Pedido) => {
    if (!pedido.lineas_pedido || pedido.lineas_pedido.length === 0) return 0
    const picked = pedido.lineas_pedido.filter(l => l.picked).length
    return Math.round((picked / pedido.lineas_pedido.length) * 100)
  }

  const isPedidoCompleto = (pedido: Pedido) => {
    return pedido.lineas_pedido?.every(linea => linea.picked) || false
  }

  const getTotalProductosPicked = () => {
    return pedidos.reduce((total, pedido) => {
      return total + (pedido.lineas_pedido?.filter(l => l.picked).length || 0)
    }, 0)
  }

  const getTotalProductos = () => {
    return pedidos.reduce((total, pedido) => {
      return total + (pedido.lineas_pedido?.length || 0)
    }, 0)
  }

  const getProgressoGeneral = () => {
    const total = getTotalProductos()
    const picked = getTotalProductosPicked()
    return total > 0 ? Math.round((picked / total) * 100) : 0
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Cargando cola de picking...</p>
        </div>
      </div>
    )
  }

  if (pedidos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/warehouse')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Cola de Picking</h1>
        </div>
        
        <Card className="text-center py-8">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay pedidos en picking
            </h3>
            <p className="text-gray-600 mb-4">
              Selecciona pedidos desde la vista principal para comenzar
            </p>
            <Button onClick={() => navigate('/warehouse')}>
              Volver al Almacén
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header móvil */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/warehouse')}
              className="mr-4 p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Cola de Picking</h1>
              <p className="text-sm text-gray-600">{pedidos.length} pedidos en proceso</p>
            </div>
          </div>

          {/* Progreso general */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso General
              </span>
              <span className="text-sm font-bold text-blue-600">
                {getTotalProductosPicked()} / {getTotalProductos()}
              </span>
            </div>
            <Progress value={getProgressoGeneral()} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              {getProgressoGeneral()}% completado
            </div>
          </div>
        </div>
      </div>

      {/* Lista de pedidos agrupados */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {pedidos.map((pedido) => {
            const progress = getPickingProgress(pedido)
            const isCompleto = isPedidoCompleto(pedido)
            
            return (
              <Card 
                key={pedido.id} 
                className={`transition-all duration-200 ${
                  isCompleto ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
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
                    
                    {isCompleto && (
                      <Button
                        onClick={() => handleCompletarPedido(pedido.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completar
                      </Button>
                    )}
                  </div>

                  {/* Cliente y ruta */}
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">
                      {pedido.cliente?.nombre}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate mr-4">{pedido.cliente?.direccion}</span>
                      <Truck className="h-3 w-3 mr-1" />
                      <span>{pedido.ruta}</span>
                    </div>
                  </div>

                  {/* Progreso del pedido */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Progreso
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {pedido.lineas_pedido?.filter(l => l.picked).length || 0} / {pedido.lineas_pedido?.length || 0}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
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
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Lista de productos */}
                  <div className="space-y-3">
                    {pedido.lineas_pedido?.map((linea) => (
                      <div 
                        key={linea.id} 
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                          linea.picked 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={linea.picked}
                          onCheckedChange={() => handleToggleProducto(linea.id, linea.picked)}
                          className="data-[state=checked]:bg-green-600"
                        />
                        
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {linea.producto?.imagen_url ? (
                            <img 
                              src={linea.producto.imagen_url} 
                              alt={linea.producto.nombre}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            linea.picked ? 'text-green-800 line-through' : 'text-gray-900'
                          }`}>
                            {linea.producto?.nombre}
                          </p>
                          <p className="text-sm text-gray-500">
                            {linea.producto?.formato}
                          </p>
                        </div>
                        
                        <div className={`text-lg font-bold px-3 py-1 rounded-full ${
                          linea.picked 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {linea.cantidad}
                        </div>
                        
                        {linea.picked && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>

      {/* Botón flotante de progreso */}
      <div className="fixed bottom-6 left-4 right-4 z-20">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">
                Progreso Total
              </span>
              <span className="font-bold text-blue-600">
                {getProgressoGeneral()}%
              </span>
            </div>
            <Progress value={getProgressoGeneral()} className="h-3" />
            <div className="text-sm text-gray-600 mt-1">
              {getTotalProductosPicked()} de {getTotalProductos()} productos pickeados
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}