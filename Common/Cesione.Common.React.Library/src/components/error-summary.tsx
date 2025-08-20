import { AlertTriangle } from "lucide-react"
import { useTheme } from "../context"
import { BasePathCesione, cn } from "../lib"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Card, CardContent, CardFooter, CardHeader } from "../ui"
import { LOGO_DARK_DEFAULT, LOGO_LIGHT_DEFAULT } from "../datasets"
import { CesioneResponse } from "../models"

interface ErrorSummaryProps {
  response: CesioneResponse

  redirectToHost?: boolean
  className?: string
  fullScreen?: boolean
}

const ErrorSummary = ({ response, redirectToHost = false, className, fullScreen }: ErrorSummaryProps) => {
  const { theme } = useTheme()
  const urlLogo = theme === "light" ? LOGO_DARK_DEFAULT : LOGO_LIGHT_DEFAULT
  const basePath = BasePathCesione(redirectToHost)
  return (
    <div className={cn("flex items-center justify-center dark:from-gray-900 dark:to-gray-800", fullScreen ? "min-h-screen" : "h-full", className)}>
      <Card className="w-full max-w-md shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-4">
          <div className="w-64 h-16 relative flex items-center justify-center">
            <img src={urlLogo} alt="Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center transition-colors duration-300">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100">Ocurrió un error</h2>
        </CardHeader>
        <CardContent className="px-6">
          <div className="mb-6">
            <p className="text-center text-gray-600 dark:text-gray-300">
              Algo no salió como esperábamos. Por favor, revisa los detalles o intenta nuevamente.
            </p>
          </div>
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Código de error: {response.reasonCode.value}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{response.reasonCode.description}</p>
          </div>
          {response.messages.length > 0 &&
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="messages">
                <AccordionTrigger className="font-semibold text-gray-700 dark:text-gray-200 hover:text-primary">
                  Ver más detalles
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {response.messages.map((message, index) => (
                      <li key={index} className="transition-colors duration-200 hover:text-primary">
                        {message}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          }
        </CardContent>
        <CardFooter className="flex justify-center pt-6">
          <Button asChild className="transition-all duration-300 hover:scale-105">
            <a href={`/${basePath}`} className="px-6 py-3">
              Ir a la página principal
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { ErrorSummary }

