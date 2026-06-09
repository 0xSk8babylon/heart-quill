import { useRef, useState } from "react";
import { useEcosystems } from "@/lib/twin-layer/ecosystem-store";
import type { Ecosystem } from "@/lib/twin-layer/ecosystems";
import { useTwin } from "@/lib/twin-layer/store";
import { Icon } from "./Icon";

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function parseCsv(text: string): Ecosystem[] {
  // CSV columns: name, products (| separated), worksTogether, howTheyTalk (| separated),
  // installDifficulty, cheapestSafePath (| separated), estInstallDays, longTermFlexibility,
  // installPractices (| separated), costImpact, compatibilityScore
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idx = (k: string) => headers.indexOf(k);
  const out: Ecosystem[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",").map((c) => c.trim());
    const name = cells[idx("name")] || `Ecosystem ${i}`;
    const productNames = (cells[idx("products")] || "").split("|").map((s) => s.trim()).filter(Boolean);
    out.push({
      id: slugify(name),
      rank: i,
      name,
      products: productNames.map((n) => ({ id: slugify(n), name: n, category: "battery" })),
      worksTogether: { rating: (cells[idx("workstogether")] as never) || "Good", note: "" },
      howTheyTalk: (cells[idx("howtheytalk")] || "").split("|").map((s) => s.trim()).filter(Boolean),
      installDifficulty: { rating: (cells[idx("installdifficulty")] as never) || "Moderate", note: "" },
      cheapestSafePath: (cells[idx("cheapestsafepath")] || "").split("|").map((s) => s.trim()).filter(Boolean),
      estInstallDays: cells[idx("estinstalldays")] || "—",
      longTermFlexibility: { rating: (cells[idx("longtermflexibility")] as never) || "Flexible", note: "" },
      installPractices: (cells[idx("installpractices")] || "").split("|").map((s) => s.trim()).filter(Boolean),
      costImpact: (cells[idx("costimpact")] as never) || "Moderate",
      compatibilityScore: Number(cells[idx("compatibilityscore")] || 0),
    });
  }
  return out;
}

export function EcosystemIngest() {
  const { ecosystems, addEcosystem, removeEcosystem, replaceAll } = useEcosystems();
  const { showToast } = useTwin();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [products, setProducts] = useState("");
  const [score, setScore] = useState("80");

  const onQuickAdd = () => {
    if (!name.trim()) {
      showToast("Add an ecosystem name first");
      return;
    }
    const id = slugify(name);
    addEcosystem({
      id,
      rank: ecosystems.length + 1,
      name: name.trim(),
      products: products
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => ({ id: slugify(p), name: p, category: "battery" })),
      worksTogether: { rating: "Good", note: "Newly added — verify integration." },
      howTheyTalk: [],
      installDifficulty: { rating: "Moderate", note: "Estimate pending field walk." },
      cheapestSafePath: ["Define scope", "Confirm service size", "Stage critical loads"],
      estInstallDays: "2–3 Days",
      longTermFlexibility: { rating: "Flexible", note: "Baseline expandability." },
      installPractices: ["Confirm compatibility", "Document panel layout"],
      costImpact: "Moderate",
      compatibilityScore: Number(score) || 0,
    });
    setName("");
    setProducts("");
    setScore("80");
    showToast(`${name.trim()} added`);
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    try {
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text) as Ecosystem[];
        if (!Array.isArray(parsed)) throw new Error("Expected an array");
        replaceAll(parsed);
        showToast(`${parsed.length} ecosystems imported`);
      } else {
        const parsed = parseCsv(text);
        if (parsed.length === 0) throw new Error("No rows parsed");
        replaceAll(parsed);
        showToast(`${parsed.length} ecosystems imported`);
      }
    } catch (err) {
      showToast(`Import failed: ${(err as Error).message}`);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="eco-ingest">
      <div className="eco-ingest-head">
        <p className="eyebrow">Update</p>
        <h3 className="card-title">Product ingestion</h3>
        <p className="eco-sub">
          Add ecosystems individually or upload a CSV / JSON file. (Frontend-only — connect a backend to persist.)
        </p>
      </div>

      <div className="eco-ingest-grid">
        <section className="eco-form">
          <p className="eyebrow">Quick add</p>
          <label className="eco-field">
            <span>Ecosystem name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Tesla + Powerwall + Backup" />
          </label>
          <label className="eco-field">
            <span>Products (comma separated)</span>
            <input value={products} onChange={(e) => setProducts(e.target.value)} placeholder="Tesla Powerwall 3, Tesla Gateway, Solar Roof" />
          </label>
          <label className="eco-field">
            <span>Compatibility score</span>
            <input type="number" min={0} max={100} value={score} onChange={(e) => setScore(e.target.value)} />
          </label>
          <button className="btn" onClick={onQuickAdd}>
            <Icon name="check" size={14} /> Add ecosystem
          </button>
        </section>

        <section className="eco-upload">
          <p className="eyebrow">Bulk upload</p>
          <div className="eco-drop">
            <Icon name="passport" size={28} />
            <p>Drop a CSV or JSON file, or browse.</p>
            <button className="btn btn-wide" onClick={() => fileRef.current?.click()}>
              Choose file <Icon name="chevron" size={14} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.json,application/json,text/csv"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
              }}
            />
          </div>
          <details className="eco-help">
            <summary>CSV format</summary>
            <code>
              name, products, worksTogether, howTheyTalk, installDifficulty, cheapestSafePath,
              estInstallDays, longTermFlexibility, installPractices, costImpact, compatibilityScore
            </code>
            <p className="eco-meta">Multi-value fields use <code>|</code> as a separator.</p>
          </details>
        </section>
      </div>

      <section className="eco-list-wrap">
        <p className="eyebrow">Current ecosystems ({ecosystems.length})</p>
        <ul className="eco-current">
          {ecosystems.map((e) => (
            <li key={e.id}>
              <span>
                <strong>{e.name}</strong>
                <span className="eco-meta"> · {e.products.length} products · {e.compatibilityScore}/100</span>
              </span>
              <button className="eco-remove" onClick={() => removeEcosystem(e.id)} aria-label={`Remove ${e.name}`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
