import { ReactNode, useEffect } from "react"
import { cn } from "../lib"
import { DynamicBreadcrumb } from "./dynamic-breadcrumb"
import { TypographyH2 } from "../ui"

interface PropsPage {
  children?: ReactNode
  title?: string
  description?: string
  breadcrumb?: boolean
  className?: string
  fullWidth?: boolean
  verticalSpacing?: "small" | "medium" | "large"
}

const Page = ({ children, title, description, breadcrumb = true, className, verticalSpacing = "medium" }: PropsPage) => {
  const spacingClasses = {
    small: "space-y-2",
    medium: "space-y-4",
    large: "space-y-8",
  }
  useEffect(() => {
    if (title) {
      document.title = title
    }

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement("meta")
        metaDescription.setAttribute("name", "description")
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute("content", description)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [title, description])
  return (
    <div className={cn("mx-auto px-4", spacingClasses[verticalSpacing], className)}>
      {breadcrumb && <DynamicBreadcrumb />}
      {title && <TypographyH2>{title}</TypographyH2>}
      <main>{children}</main>
    </div>
  )
}

export { Page }
