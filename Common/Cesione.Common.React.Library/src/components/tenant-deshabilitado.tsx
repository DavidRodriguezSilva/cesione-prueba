import { AlertTriangle } from "lucide-react"
import { Button, Card, CardContent, CardFooter, CardHeader } from "../ui"
import { useTheme } from "../context"
import { BasePathCesione } from "../lib"
import { LOGO_DARK_DEFAULT, LOGO_LIGHT_DEFAULT } from "../datasets"

const TenantDeshabilitado = () => {
  const { theme } = useTheme()
  const urlLogo = theme === "light" ? LOGO_DARK_DEFAULT : LOGO_LIGHT_DEFAULT
  const basePath = BasePathCesione()
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="w-64 h-16 relative flex items-center justify-center">
            <img src={urlLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center transition-colors duration-300">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Tenant no habilitado</h2>
        </CardHeader>
        <CardContent className="px-6">
          <p className="text-center text-gray-600 dark:text-gray-300">
            Por favor contacta con soporte en{" "}
            <a href="mailto:soporte@cesionbnk.com" className="text-blue-600 hover:underline">
              soporte@cesionbnk.com
            </a>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Button asChild className="transition-all duration-300 hover:scale-105">
            <a href={basePath} className="px-6 py-3">
              Ir a la página principal
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { TenantDeshabilitado }
