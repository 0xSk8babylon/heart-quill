import { Icon } from "./Icon";

export type BackendMapItem = {
  surface: string;
  routers: string[];
  note: string;
};

export function BackendMap({
  eyebrow = "Backend mapping",
  title,
  lede,
  items,
}: {
  eyebrow?: string;
  title: string;
  lede: string;
  items: BackendMapItem[];
}) {
  return (
    <section className="card backend-map">
      <div className="card-head">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h3 className="card-title">{title}</h3>
          <p className="tab-lede" style={{ marginTop: 6 }}>{lede}</p>
        </div>
        <span className="live-tag" title="Not wired yet">
          <span className="live-dot" style={{ background: "#e0913f" }} />
          Mocked — backend not wired
        </span>
      </div>
      <ul className="backend-map-list">
        {items.map((it) => (
          <li key={it.surface} className="backend-map-row">
            <div className="backend-map-surface">
              <Icon name="layers" size={14} />
              <span>{it.surface}</span>
            </div>
            <div className="backend-map-routers">
              {it.routers.map((r) => (
                <code key={r} className="backend-map-chip">{r}</code>
              ))}
            </div>
            <p className="backend-map-note">{it.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
