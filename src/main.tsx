import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./i18n";
import "./index.css";
import { initWebVitals } from "./lib/web-vitals";
import { initErrorTracking } from "./lib/error-tracking";
import {
  verifyReactReady,
  installCreateContextGuard,
  safeRender,
} from "./lib/startup-check";

// Catch runtime errors as early as possible.
initErrorTracking();

// Watch for createContext-class crashes from any chunk that loads later.
installCreateContextGuard();

// Bail out with a clear in-app error if React itself isn't initialised.
if (verifyReactReady()) {
  safeRender(() => {
    createRoot(document.getElementById("root")!).render(
      <HelmetProvider>
        <App />
      </HelmetProvider>
    );
  });

  // Start measuring real-user performance after React mounts.
  initWebVitals();
}
