import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Funcion para obtener la ruta base del modulo */
export const BasePathCesione = (home: boolean = false) => {
  const path = window.location.pathname
  const paths = path.split('/').filter(Boolean)
  let basePath = ""

  // Si hay al menos 3 partes y la tercera es "admin", devolvemos las 3 primeras
  if (paths[1]?.toLowerCase() === 'admin') {
    basePath = paths.slice(0, 3).join('/')
  } else {
    // En caso contrario, devolvemos solo las 2 primeras
    basePath = paths.slice(0, 2).join('/')
  }

  if (home) {
    basePath = `${window.location.origin}/${paths.slice(0, 2).join('/')}`
  }

  return basePath
}
