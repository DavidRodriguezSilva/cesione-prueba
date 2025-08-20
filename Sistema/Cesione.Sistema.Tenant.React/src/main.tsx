import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { ThemeProvider } from "cesione.common.react.library"

const root = ReactDOM.createRoot(document.getElementById("root")!)

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
)
