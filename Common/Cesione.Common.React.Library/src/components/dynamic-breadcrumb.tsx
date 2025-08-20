import { NavLink, useLocation } from "react-router"
import { BasePathCesione } from "../lib"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui"
import { Home, ChevronRight } from "lucide-react"
import React from "react"

interface DynamicBreadcrumbProps {
  excludeBase?: boolean // Si queremos excluir urlBase y tenant de las migas
  formatTitle?: (path: string) => string // Función opcional para formatear los títulos
  path?: string // Array de rutas para generar las migas
}

/**
 * Formatea el título de la ruta
 * @param path Ruta de la URL
 * @returns Ruta formateada
 */
const formatTitleUrl = (path: string): string => {
  const camelCaseToSpace = path.replace(/([a-z])([A-Z])/g, "$1 $2")
  return camelCaseToSpace.charAt(0).toUpperCase() + camelCaseToSpace.slice(1).replace(/-/g, " ")
}

/**
 * Componente para generar migas de navegación dinámicas
 * @param path Array de rutas para generar las migas, si no se proporciona, se utilizará la ruta actual sin contar la base
 * @returns Componente de migas de navegación dinámicas
 */
const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ excludeBase = true, formatTitle = formatTitleUrl, path }) => {
  const location = useLocation()
  if (!path) path = location.pathname

  const generateBreadcrumbs = () => {
    // Separar y limpiar segments vacíos
    const segments = path.split("/").filter(Boolean)

    // skip es cuántos segmentos "saltamos" al inicio si excludeBase es true
    let skip = 0

    if (excludeBase) {
      // Normalmente saltamos el primer segmento (tenant)
      skip = 1

      // Si el segundo segmento es "admin", saltamos uno más
      if (segments[1]?.toLowerCase() === "admin") {
        skip = 2
      }
    }

    // Rebanamos a partir del 'skip' calculado
    const relevantPaths = segments.slice(skip)

    // Construimos cada breadcrumb
    return relevantPaths.map((seg, i) => {
      // Para el link, tomamos desde el inicio hasta el (skip + i + 1)
      const url = "/" + segments.slice(0, skip + i + 1).join("/")
      const isLast = i === relevantPaths.length - 1

      return {
        title: formatTitle(seg),
        url,
        isLast,
      }
    })
  }
  const breadcrumbs = generateBreadcrumbs()
  const basePath = BasePathCesione(true)

  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumb className="pb-5">
      <BreadcrumbList>
        <BreadcrumbItem>
          <a href={basePath} className="text-foreground dark:text-foreground transition-colors hover:text-foreground">
            <Home className="h-4 w-4" />
          </a>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {breadcrumbs.map((breadcrumb) => (
          <React.Fragment key={breadcrumb.url}>
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage className="text-foreground dark:text-foreground max-w-40 truncate" title={breadcrumb.title}>
                  {breadcrumb.title}
                </BreadcrumbPage>
              ) : (
                <NavLink to={breadcrumb.url} className="text-foreground dark:text-foreground">
                  {breadcrumb.title}
                </NavLink>
              )}
            </BreadcrumbItem>
            {!breadcrumb.isLast && (
              <BreadcrumbSeparator className="text-foreground dark:text-foreground">
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { DynamicBreadcrumb }
