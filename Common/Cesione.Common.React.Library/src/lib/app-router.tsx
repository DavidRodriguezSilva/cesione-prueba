import { createBrowserRouter, RouteObject, RouterProvider } from "react-router"
import { TenantDeshabilitado } from "../components"

interface AppRouterProps {
  routes: RouteObject[]
  basepath?: string
}

const AppRouter = ({ routes, basepath }: AppRouterProps) => {
  const router = createBrowserRouter([
    {
      path: "/:tenant",
      children: [
        {
          path: `${basepath}`,
          children: routes,
        },
      ],
    },
    {
      path: "/tenantDisabled",
      element: <TenantDeshabilitado />,
    },
  ])
  return <RouterProvider router={router} />
}

export { AppRouter, type AppRouterProps }
