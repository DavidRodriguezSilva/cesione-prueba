import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig(({ command }) => {
  return {
    base: command === "build" ? "/sistema" : "/",
    build: {
      target: "esnext",
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
  }
})
