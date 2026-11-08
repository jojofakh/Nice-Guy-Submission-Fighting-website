import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider } from "@/lib/router";
import { DataProvider } from "@/lib/store";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </RouterProvider>
  </StrictMode>,
);
