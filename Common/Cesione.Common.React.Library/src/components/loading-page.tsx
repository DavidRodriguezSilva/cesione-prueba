import { FC, useEffect, useState } from "react"
import { Card } from "../ui"
import { useTheme } from "../context"
import { LOGO_DARK_DEFAULT, LOGO_LIGHT_DEFAULT } from "../datasets"

interface LoadingPageProps {
  tenantLightLogo?: string
  tenantDarkLogo?: string
}

const LoadingPage: FC<LoadingPageProps> = ({
  tenantLightLogo = LOGO_LIGHT_DEFAULT,
  tenantDarkLogo = LOGO_DARK_DEFAULT,
}) => {
  const { resolvedTheme } = useTheme()
  const urlLogo = resolvedTheme === "light" ? tenantDarkLogo : tenantLightLogo;
  const [loadingDots, setLoadingDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""))
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background transition-colors duration-300">
      <Card className="p-6 space-y-4 shadow-none border-0 bg-transparent">
        <img src={urlLogo} alt="Loading" className="w-64 h-32 object-contain animate-pulse" />
        <div className="text-center text-xl font-semibold text-gray-700 dark:text-gray-300" aria-live="polite">
          Cargando{loadingDots}
        </div>
      </Card>
    </div>
  )
}

export { LoadingPage }

