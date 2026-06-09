import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/twin-layer/AppShell";
import { TwinProvider } from "@/lib/twin-layer/store";
import "@/styles/twin-layer.css";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <TwinProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </TwinProvider>
  );
}
