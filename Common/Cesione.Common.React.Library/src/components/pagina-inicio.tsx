import { Users } from "lucide-react"
import { Page } from "./page"

const PaginaInicio = () => {
  return (
    <Page title="Información">
      <div className="flex">
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray mt-2">Navega y gestiona</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 shadow border">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">¡Bienvenido!</h3>
              <p className="text-base leading-relaxed max-w-2xl mx-auto">
                Aquí encontrarás herramientas y funcionalidades que te permitirán mantener todo en orden y adaptarlo a lo que necesites. Explora el menú lateral
                para acceder a cada sección y aprovechar al máximo todas las posibilidades disponibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

export { PaginaInicio }
