import type { RegistryItem, RegistrySection } from "@/lib/twin-layer/registry";
import { getSectionItems } from "@/lib/twin-layer/registry";
import { Badge } from "./atoms";
import { Icon } from "./Icon";

const DATA_TONE = {
  durable_record: "ok",
  derived_view: "info",
  workflow: "warn",
  internal: "mute",
} as const;

const DATA_LABEL = {
  durable_record: "Durable record",
  derived_view: "Derived view",
  workflow: "Workflow",
  internal: "Internal",
} as const;

export function RegistryCard({ item }: { item: RegistryItem }) {
  const tone = DATA_TONE[item.dataType];
  return (
    <article className={`card registry-card registry-${tone}`}>
      <div className="card-head">
        <div>
          <p className="eyebrow">{item.cardName}</p>
          <h3 className="card-title">{item.homeownerLabel}</h3>
        </div>
        <div className="registry-tags">
          <Badge tone={tone}>{DATA_LABEL[item.dataType]}</Badge>
          {!item.visibleInV1 ? <Badge tone="warn">Coming soon</Badge> : null}
        </div>
      </div>
      <p className="registry-question"><Icon name="search" size={14} />{item.homeownerQuestionAnswered}</p>
      <p className="registry-empty">{item.emptyStateMessage}</p>
      <ul className="registry-notes">
        {item.trustBoundaryNotes.map((n) => (
          <li key={n}><span className="registry-bullet" />{n}</li>
        ))}
      </ul>
      <div className="registry-foot">
        <span className="registry-contractor">Contractor view · {item.contractorLabel}</span>
      </div>
    </article>
  );
}

export function RegistrySection({
  section, eyebrow, title, lede, excludeIds = [],
}: { section: RegistrySection; eyebrow: string; title: string; lede: string; excludeIds?: string[] }) {
  const items = getSectionItems(section).filter((i) => !excludeIds.includes(i.id));
  if (items.length === 0) return null;
  return (
    <section className="registry-section">
      <header className="registry-section-head">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="registry-section-title">{title}</h2>
        <p className="registry-section-lede">{lede}</p>
      </header>
      <div className="registry-grid">
        {items.map((it) => <RegistryCard key={it.id} item={it} />)}
      </div>
    </section>
  );
}
