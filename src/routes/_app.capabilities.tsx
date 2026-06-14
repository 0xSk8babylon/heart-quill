import { createFileRoute } from "@tanstack/react-router";
import { CapabilitiesPage } from "@/components/twin-layer/CapabilitiesPage";

export const Route = createFileRoute("/_app/capabilities")({
  head: () => ({
    meta: [
      { title: "Backend Capability Map — Twin Layer" },
      { name: "description", content: "Read-only map of backend capabilities cross-referenced with the heart-quill UI shell inventory." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CapabilitiesPage,
});
