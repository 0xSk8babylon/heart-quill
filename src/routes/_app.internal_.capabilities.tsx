import { createFileRoute } from "@tanstack/react-router";
import { Route as CapabilitiesRoute } from "./_app.capabilities";

// Internal/developer alias for the capabilities registry.
// Homeowner-facing nav no longer surfaces this page; it's kept here as a
// system-visibility / debug surface at /internal/capabilities.
export const Route = createFileRoute("/_app/internal_/capabilities")({
  head: () => ({
    meta: [
      { title: "Internal · Backend Capability Map — Twin Layer" },
      {
        name: "description",
        content:
          "Internal-only registry of backend capabilities cross-referenced with the UI shell. Not homeowner-facing.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CapabilitiesRoute.options.component!,
});
