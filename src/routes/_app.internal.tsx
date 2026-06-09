import { createFileRoute } from "@tanstack/react-router";
import { RegistrySection } from "@/components/twin-layer/RegistryCard";

export const Route = createFileRoute("/_app/internal")({
  head: () => ({
    meta: [
      { title: "Internal — Twin Layer" },
      { name: "description", content: "Internal product architecture cockpit. Not homeowner-facing copy." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InternalPage,
});

function InternalPage() {
  return (
    <div className="tab-wrap">
      <header className="tab-head">
        <div>
          <p className="eyebrow">Internal</p>
          <h2 className="tab-title">Architecture cockpit</h2>
          <p className="tab-lede">
            Internal planning surfaces for product and technical alignment. Not homeowner or contractor copy.
          </p>
        </div>
      </header>
      <RegistrySection
        section="hidden"
        eyebrow="Cockpit"
        title="Internal capabilities"
        lede="Each card describes the question it answers for the team, and the trust boundaries it carries."
      />
    </div>
  );
}
