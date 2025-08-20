import { Card, Outlet, PaginaInicio, RouteObject } from "cesione.common.react.library"

export const configModule = () => {
  const router: RouteObject[] = [
    {
      element: <Outlet />,
      children: [
        {
          index: true,
          element: (
            <>
              <PaginaInicio />
              <p className="bg-backgorund">Elemento de prueba</p>
              <Card className="bg-red-500 min-h-12 min-w-full">Prueba de elementos del commnon</Card>
            </>
          ),
        },
      ],
    },
  ]

  return router
}
