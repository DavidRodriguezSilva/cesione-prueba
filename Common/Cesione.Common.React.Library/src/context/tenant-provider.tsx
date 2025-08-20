import React, { createContext, useState, useEffect } from "react"
import { useTenantStore } from "../stores"
import { CesioneResponse, ITenantProps, ITenantPropsResponse } from "../models"
import { ErrorSummary, LoadingPage, TenantDeshabilitado } from "../components"
import { FAVICON_DEFAULT } from "../datasets"

const estilosDefault = new URL("../styles/index.css", import.meta.url).href

interface TenantContextType {
  tenant: Partial<ITenantProps>
  isTenantValid: boolean
  isLoading: boolean
}

interface TenantProvider {
  children: React.ReactNode
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export const TenantProvider: React.FC<TenantProvider> = ({ children }) => {
  const pathname = window.location.pathname
  // Cargue inical del contexto
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  // Cargue de los datos del tenant
  const [isLoading, setIsLoading] = useState(true)
  // Estado del tenant - Si es o no Valido
  const [isTenantEnabled, setIsTenantEnabled] = useState<boolean>(true)
  // Estado del tenant - Si existe o no
  const [existTenant, setExistTenant] = useState<boolean>(true)
  // Mensaje de error del tenant
  const [tenantError, setTenantError] = useState<CesioneResponse>({
    succeeded: false,
    messages: [],
    reasonCode: {
      value: 0,
      description: "Ocurrió una excepción en el sistema",
    },
  })

  const tenantState = useTenantStore()
  const { setTenantState } = useTenantStore()

  const fetchTenant = async () => {
    const response = {
      tenantProps: {
        isActive: true,
        uuid: "a509a86a-31cf-49e9-a944-eb00d30415cd",
        id: 1,
        alias: "cesionbnk",
        name: "CESIONBNK",
        icon: "https://s3.amazonaws.com/public.cesione.com.co/favicon/FaviconCesionbnk.ico",
        lightLogo: "https://public.cesionbnk.com/static/logo/LogoCesionbnkBlanco.png",
        darkLogo: "https://public.cesionbnk.com/static/logo/LogoCesionbnk.png",
        estilos: "https://public.cesionbnk.com/static/Estilos/EstilosCesionbnk.css",
      },
      succeeded: true,
      reasonCode: {
        value: 1,
        description: "Operación exitosa",
      },
      messages: [],
    }

    if (!response.succeeded) {
      setExistTenant(false)
      setTenantError({
        succeeded: false,
        messages: ["No se pudo cargar el tenant"],
        reasonCode: {
          value: response.reasonCode.value,
          description: response.reasonCode.description,
        },
      })
      await handleFallback()
      return
    }

    const tenantResponse: ITenantPropsResponse = response

    // Valida que la respuesta sea exitosa
    if (!tenantResponse.succeeded) {
      setExistTenant(false)
      setTenantError(tenantResponse)
      await handleFallback()
      return
    }

    // Valida que exista el tenant
    if (!tenantResponse.tenantProps) {
      setExistTenant(false)
      setTenantError(tenantResponse)
      await handleFallback()
      return
    }

    // Valida que el tenant este activo
    if (!tenantResponse.tenantProps.isActive) {
      setIsTenantEnabled(false)
      await handleFallback()
      return
    }

    // Carga los datos del tenant
    setTenantState(tenantResponse.tenantProps)
    setIsTenantEnabled(true)
    await loadTenantAssets(tenantResponse.tenantProps)
    finalizeLoad()
  }

  const handleFallback = async () => {
    await loadTenantAssets({ estilos: estilosDefault, icon: FAVICON_DEFAULT })
    finalizeLoad()
  }

  const finalizeLoad = () => {
    setIsLoading(false)
    setIsInitialLoad(false)
  }

  useEffect(() => {
    const loadData = async () => {
      const tenantFromPath = pathname.split("/")[1]

      if (!tenantFromPath) {
        setIsLoading(false)
        setIsInitialLoad(false)
        return
      }

      if (tenantFromPath !== tenantState.alias) {
        fetchTenant()
      } else {
        await loadTenantAssets(tenantState)
        setIsLoading(false)
        setIsInitialLoad(false)
      }
    }

    loadData()
  }, [pathname])

  if (isLoading) return <LoadingPage />

  if (!isInitialLoad) {
    if (!existTenant) return <ErrorSummary fullScreen response={tenantError} redirectToHost />
    if (!isTenantEnabled) return <TenantDeshabilitado />
  }

  const value = {
    isTenantValid: isTenantEnabled,
    isLoading,
    tenant: tenantState,
  }

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}
const loadTenantAssets = async ({
  estilos: tenantStyles = estilosDefault,
  icon: tenantIcon = FAVICON_DEFAULT,
  name: tenantName = "CESIONBNK",
  alias: tenantAlias = "default",
}: Partial<ITenantProps>) => {
  // Gestionar los estilos existentes
  const existingLinks = Array.from(document.querySelectorAll("link[tenant-styles]"))
  existingLinks.forEach((link) => {
    const attr = link.getAttribute("tenant-styles")
    if (attr !== tenantAlias && attr !== "config-estilos") {
      link.remove()
    }
  })

  // Asegurar estilos del tenant
  console.log(estilosDefault)
  if (!existingLinks.some((link) => link.getAttribute("tenant-styles") === tenantAlias)) {
    const linkElement = document.createElement("link")
    linkElement.rel = "stylesheet"
    linkElement.href = tenantStyles || estilosDefault
    linkElement.setAttribute("tenant-styles", tenantAlias)
    document.head.appendChild(linkElement)
  }

  // Gestionar favicon
  const existingFavicons = Array.from(document.querySelectorAll('link[rel="icon"], link[tenant-icon]'))
  existingFavicons.forEach((icon) => {
    const attr = icon.getAttribute("tenant-icon")
    if (attr && attr !== tenantAlias) {
      icon.remove()
    }
  })
  if (!existingFavicons.some((icon) => icon.getAttribute("tenant-icon") === tenantAlias)) {
    const faviconLink = document.createElement("link")
    faviconLink.rel = "icon"
    faviconLink.type = "image/svg+xml"
    faviconLink.href = tenantIcon || FAVICON_DEFAULT
    faviconLink.setAttribute("tenant-icon", tenantAlias)
    document.head.appendChild(faviconLink)
  }

  // Título de la página
  let titleElement = document.querySelector("title")
  if (!titleElement) {
    titleElement = document.createElement("title")
    document.head.appendChild(titleElement)
  }
  titleElement.textContent = tenantName || "CESIONBNK"
  titleElement.setAttribute("tenant-title", tenantAlias)
}
