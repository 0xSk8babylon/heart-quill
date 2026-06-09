import type { ReactNode } from "react";
import { CONFIDENCE, STATUS, TRUST, type ConfidenceKey, type StatusKey, type Tone, type TrustKey } from "@/lib/twin-layer/data";

export function StatusDot({ status, size = 8 }: { status: StatusKey; size?: number }) {
  const tone = STATUS[status]?.dot || "off";
  return <span className={`dot dot-${tone}`} style={{ width: size, height: size }} />;
}

export function Badge({ tone = "default", children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function TrustBadge({ state }: { state: TrustKey }) {
  const cfg = TRUST[state] || { label: state, tone: "default" as Tone };
  return (
    <span className={`trust trust-${cfg.tone}`}>
      <span className={`dot dot-${cfg.tone}`} />{cfg.label}
    </span>
  );
}

export function Confidence({ level }: { level: ConfidenceKey }) {
  const n = level === "high" ? 3 : level === "medium" ? 2 : 1;
  return (
    <span className="conf" title={`${CONFIDENCE[level]} confidence`}>
      {[0, 1, 2].map((i) => (
        <span key={i} className={`conf-pip ${i < n ? `on on-${level}` : ""}`} />
      ))}
      <span className="conf-label">{CONFIDENCE[level]}</span>
    </span>
  );
}

export function SegBar({ value, total = 6, tone = "warn" as Tone }: { value: number; total?: number; tone?: Tone }) {
  const on = Math.round((value / 100) * total);
  return (
    <span className="segbar">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`seg ${i < on ? `seg-on seg-${tone}` : ""}`} />
      ))}
    </span>
  );
}

export function ScoreMeter({ value, tone = "info" as Tone }: { value: number; tone?: Tone }) {
  return (
    <span className="meter">
      <span className={`meter-fill meter-${tone}`} style={{ width: `${value}%` }} />
    </span>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
