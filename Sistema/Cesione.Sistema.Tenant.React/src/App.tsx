import { AppRouter, TenantProvider } from "cesione.common.react.library"
import { configModule } from "./shared/menu"

function App() {
  const router = configModule()

  return (
    <TenantProvider>
      {/* ruta de prueba 'http://localhost:3000/cesionbnk/sistema' */}
      <AppRouter routes={router} basepath="sistema" />
    </TenantProvider>
  )
}

export default App
