import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/twin-layer/AppShell";
import { TwinProvider } from "@/lib/twin-layer/store";
import { EcosystemProvider } from "@/lib/twin-layer/ecosystem-store";
import "@/styles/twin-layer.css";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <TwinProvider>
      <EcosystemProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </EcosystemProvider>
    </TwinProvider>
  );
}

