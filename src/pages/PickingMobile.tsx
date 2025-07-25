import React, { useState, useEffect } from 'react'
import { ArrowLeft, Package, CheckCircle2, Circle, User, MapPin, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

interface LineaPedido {
  id: string
  pedido_id: string
  producto_id: string
  cantidad: number
  precio_unitario: number
  estado_picking: 'pendiente' | 'pickeado'
  producto: {
    nombre: string
    formato: string
    descripcion: string
  }
}

interface Pedido {
  id: string
  numero_pedido: string
  cliente_id: string
  ruta: string
  estatus: string
  fecha_pedido: string
  entrega_estimada: string
  notas_pedido: string
  cliente: {
    nombre: string
    direccion: string
  }
  lineas_pedido: LineaPedido[]
}

export default function PickingMobile() {
  const navigate = useNavigate()
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const loadPickingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select(`
          *,
          cliente:clientes(nombre, direccion),
          lineas_pedido(
            *,
            producto:productos(nombre, formato, descripcion)
          )
        `)
        .eq('estatus', 'En Picking')
        .order('fecha_pedido', { ascending: true })

      if (error) throw error
      setPedidos(data || [])
    } catch (error) {
      console.error('Error loading picking orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPickingOrders()
  }, [])

  const toggleItemSelection = (lineaId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(lineaId)) {
      newSelected.delete(lineaId)
    } else {
      newSelected.add(lineaId)
    }
    setSelectedItems(newSelected)
  }

  const markItemsAsPicked = async () => {
    if (selectedItems.size === 0) return

    try {
      // Actualizar estado de las líneas seleccionadas
      const { error: updateError } = await supabase
        .from('lineas_pedido')
        .update({ estado_picking: 'pickeado' })
        .in('id', Array.from(selectedItems))

      if (updateError) throw updateError

      // Verificar si hay pedidos que se pueden marcar como preparados
      const pedidosToCheck = new Set<string>()
      pedidos.forEach(pedido => {
        pedido.lineas_pedido.forEach(linea => {
          if (selectedItems.has(linea.id)) {
            pedidosToCheck.add(pedido.id)
          }
        })
      })

      // Para cada pedido, verificar si todas las líneas están pickeadas
      for (const pedidoId of pedidosToCheck) {
        const { data: lineas, error: lineasError } = await supabase
          .from('lineas_pedido')
          .select('estado_picking')
          .eq('pedido_id', pedidoId)

        if (lineasError) throw lineasError

        const todasPickeadas = lineas?.every(l => l.estado_picking === 'pickeado')
        
        if (todasPickeadas) {
          // Marcar pedido como preparado
          await supabase
            .from('pedidos')
            .update({ estatus: 'Preparado' })
            .eq('id', pedidoId)
        } else {
          // Si quedan líneas pendientes, crear un nuevo pedido con las líneas no pickeadas
          const lineasPendientes = lineas?.filter(l => l.estado_picking === 'pendiente')
          if (lineasPendientes && lineasPendientes.length > 0) {
            // El pedido original se mantiene como "En Picking" hasta que todas las líneas estén procesadas
            // La lógica de división de pedidos se puede implementar más adelante si es necesario
          }
        }
      }

      // Recargar datos
      setSelectedItems(new Set())
      await loadPickingOrders()
      
    } catch (error) {
      console.error('Error marking items as picked:', error)
    }
  }

  const getTotalItems = () => {
    return pedidos.reduce((total, pedido) => 
      total + pedido.lineas_pedido.filter(l => l.estado_picking === 'pendiente').length, 0
    )
  }

  const getPickedItems = () => {
    return pedidos.reduce((total, pedido) => 
      total + pedido.lineas_pedido.filter(l => l.estado_picking === 'pickeado').length, 0
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/warehouse')}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Cola de Picking</h1>
              <p className="text-sm text-gray-500">
                {getTotalItems()} items pendientes • {getPickedItems()} pickeados
              </p>
            </div>
          </div>
          <Package className="h-6 w-6 text-blue-500" />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{pedidos.length}</div>
            <div className="text-xs text-gray-500">Pedidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{getTotalItems()}</div>
            <div className="text-xs text-gray-500">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{getPickedItems()}</div>
            <div className="text-xs text-gray-500">Pickeados</div>
          </div>
        </div>
      </div>

      {/* Lista de pedidos y productos */}
      <div className="p-4 space-y-4 pb-24">
        {pedidos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pedidos en picking</h3>
            <p className="text-gray-500">Todos los pedidos están procesados</p>
          </div>
        ) : (
          pedidos.map((pedido) => (
            <Card key={pedido.id} className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base font-medium text-gray-900 mb-1">
                      {pedido.cliente.nombre}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>#{pedido.numero_pedido}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{pedido.ruta}</span>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={pedido.entrega_estimada === 'urgente' ? 'destructive' : 'secondary'}
                    className="ml-2"
                  >
                    {pedido.entrega_estimada === 'urgente' ? (
                      <>
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Urgente
                      </>
                    ) : (
                      <>
                        <Calendar className="h-3 w-3 mr-1" />
                        Habitual
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {pedido.lineas_pedido.map((linea) => (
                    <div
                      key={linea.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all ${
                        linea.estado_picking === 'pickeado'
                          ? 'bg-green-50 border-green-200'
                          : selectedItems.has(linea.id)
                          ? 'bg-blue-50 border-blue-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Checkbox
                        checked={selectedItems.has(linea.id)}
                        onCheckedChange={() => toggleItemSelection(linea.id)}
                        disabled={linea.estado_picking === 'pickeado'}
                        className="h-5 w-5"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium text-sm ${
                            linea.estado_picking === 'pickeado' 
                              ? 'text-green-700 line-through' 
                              : 'text-gray-900'
                          }`}>
                            {linea.producto.nombre}
                          </h4>
                          {linea.estado_picking === 'pickeado' && (
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {linea.producto.formato} • {linea.producto.descripcion}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {linea.cantidad} uds
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Botón flotante para marcar como pickeado */}
      {selectedItems.size > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-20">
          <Button
            onClick={markItemsAsPicked}
            className="w-full h-14 text-lg font-medium shadow-lg"
            size="lg"
          >
            <CheckCircle2 className="h-6 w-6 mr-2" />
            Marcar {selectedItems.size} items como pickeados
          </Button>
        </div>
      )}
    </div>
  )
}