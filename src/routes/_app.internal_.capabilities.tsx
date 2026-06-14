import { createFileRoute } from "@tanstack/react-router";
import { Route as CapabilitiesRoute } from "./_app.capabilities";

// Internal/developer alias for the capabilities registry.
// Homeowner-facing nav no longer surfaces this page; it's kept here as a
// system-visibility / debug surface at /internal/capabilities.
export const Route = createFileRoute("/_app/internal_/capabilities")({
  head: CapabilitiesRoute.options.head,
  component: CapabilitiesRoute.options.component!,
});
