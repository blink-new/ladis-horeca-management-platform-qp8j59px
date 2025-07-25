import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { Dashboard } from '@/pages/Dashboard'
import { Catalog } from '@/pages/Catalog'
import { Customers } from '@/pages/Customers'
import { Orders } from '@/pages/Orders'
import { Warehouse } from '@/pages/Warehouse'
import { WarehouseMobile } from '@/pages/WarehouseMobile'
import { PickingQueue } from '@/pages/PickingQueue'
import { Invoicing } from '@/pages/Invoicing'
import { Accounting } from '@/pages/Accounting'
import { Toaster } from '@/components/ui/toaster'

const routeConfig = [
  { path: '/', component: Dashboard, title: 'Dashboard' },
  { path: '/catalog', component: Catalog, title: 'Catálogo (PIM)' },
  { path: '/customers', component: Customers, title: 'Clientes' },
  { path: '/orders', component: Orders, title: 'Pedidos' },
  { path: '/warehouse', component: WarehouseMobile, title: 'Almacén' },
  { path: '/picking-queue', component: PickingQueue, title: 'Cola de Picking' },
  { path: '/purchases', component: Dashboard, title: 'Compras' },
  { path: '/quotes', component: Dashboard, title: 'Presupuestos y Precios' },
  { path: '/suppliers', component: Dashboard, title: 'Proveedores' },
  { path: '/invoicing', component: Invoicing, title: 'Facturación' },
  { path: '/accounting', component: Accounting, title: 'Contabilidad' },
  { path: '/settings', component: Dashboard, title: 'Configuración' }
]

function AppLayout({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        {routeConfig.map(({ path, component: Component, title }) => (
          <Route
            key={path}
            path={path}
            element={
              <AppLayout title={title}>
                <Component />
              </AppLayout>
            }
          />
        ))}
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App