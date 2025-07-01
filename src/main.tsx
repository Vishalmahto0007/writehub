import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import "./index.css";

// Lazy load the App component
const App = lazy(() => import("./App"));

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <Suspense fallback={<LoadingSpinner />}>
          <App />
        </Suspense>
      </Provider>
    </React.StrictMode>
  );
}
