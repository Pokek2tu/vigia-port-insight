import { useState } from "react";
import { MapPin, Radar } from "lucide-react";
import type { ScenarioSnapshot, ZoneState } from "@/lib/scenarios";

interface Props { snap: ScenarioSnapshot; }

const dotColor = (r: ZoneState["risk"]) => r === "high" ? "bg-danger" : r === "medium" ? "bg-warning" : "bg-success";
const ringColor = (r: ZoneState["risk"]) => r === "high" ? "text-danger" : r === "medium" ? "text-warning" : "text-success";

export function PortMap({ snap }: Props) {
  const [sel, setSel] = useState<ZoneState>(snap.zones[3]);
  const current = snap.zones.find((z) => z.id === sel.id) ?? snap.zones[0];

  return (
    <div className="rounded-lg border border-border bg-panel shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-cyan" />
          <h2 className="text-sm font-semibold">Mapa Inteligente del Puerto del Callao</h2>
        </div>
        <div className="flex gap-3 text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Bajo</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Medio</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" /> Alto</span>
        </div>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_280px]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border md:border-b-0 md:border-r">
          {/* Map background */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(0.35 0.05 250 / 0.3)" strokeWidth="0.5" />
              </pattern>
              <radialGradient id="ocean" cx="20%" cy="50%">
                <stop offset="0%" stopColor="oklch(0.3 0.08 230 / 0.5)" />
                <stop offset="100%" stopColor="oklch(0.2 0.05 250 / 0.2)" />
              </radialGradient>
            </defs>
            <rect width="800" height="500" fill="url(#grid)" />
            {/* Ocean */}
            <path d="M 0 0 L 380 0 Q 340 250 380 500 L 0 500 Z" fill="url(#ocean)" stroke="oklch(0.78 0.15 220 / 0.4)" strokeWidth="1" strokeDasharray="4 4" />
            {/* Land outline */}
            <path d="M 380 0 Q 340 250 380 500 L 800 500 L 800 0 Z" fill="oklch(0.22 0.04 260 / 0.4)" />
            {/* Roads */}
            <path d="M 380 180 L 800 180" stroke="oklch(0.4 0.05 260)" strokeWidth="3" opacity="0.6" />
            <path d="M 380 320 L 800 320" stroke="oklch(0.4 0.05 260)" strokeWidth="3" opacity="0.6" />
            <path d="M 600 0 L 600 500" stroke="oklch(0.4 0.05 260)" strokeWidth="3" opacity="0.6" />
            {/* Docks */}
            <rect x="180" y="100" width="200" height="40" fill="oklch(0.35 0.05 260 / 0.6)" stroke="oklch(0.5 0.05 260)" />
            <rect x="180" y="280" width="200" height="40" fill="oklch(0.35 0.05 260 / 0.6)" stroke="oklch(0.5 0.05 260)" />
            {/* Container grid */}
            {Array.from({ length: 8 }).map((_, i) =>
              Array.from({ length: 4 }).map((_, j) => (
                <rect key={`${i}-${j}`} x={420 + i * 22} y={200 + j * 22} width="18" height="18" fill="oklch(0.3 0.05 250 / 0.5)" stroke="oklch(0.5 0.1 220 / 0.4)" />
              )),
            )}
            {/* Radar sweep */}
            <g transform="translate(400, 250)">
              <circle r="220" fill="none" stroke="oklch(0.78 0.15 220 / 0.15)" />
              <circle r="150" fill="none" stroke="oklch(0.78 0.15 220 / 0.2)" />
              <circle r="80" fill="none" stroke="oklch(0.78 0.15 220 / 0.25)" />
              <g className="radar-sweep">
                <path d="M 0 0 L 220 0 A 220 220 0 0 1 190 110 Z" fill="oklch(0.78 0.15 220 / 0.08)" />
              </g>
            </g>
          </svg>

          {/* Zones */}
          {snap.zones.map((z) => (
            <button
              key={z.id}
              onClick={() => setSel(z)}
              style={{ left: `${z.x}%`, top: `${z.y}%` }}
              className="group absolute -translate-x-1/2 -translate-y-1/2"
            >
              <span className={`relative block h-3 w-3 rounded-full ${dotColor(z.risk)} ${ringColor(z.risk)} pulse-dot shadow-glow`} />
              <span className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-background/90 px-1.5 py-0.5 text-[9px] font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {z.name}
              </span>
            </button>
          ))}

          {/* Coordinates */}
          <div className="absolute bottom-2 left-2 font-mono text-[9px] text-muted-foreground">
            LAT -12.0464°S · LON -77.1428°W · CALLAO
          </div>
          <div className="absolute right-2 top-2 rounded border border-cyan/30 bg-background/80 px-2 py-0.5 font-mono text-[9px] text-cyan">
            ZOOM 1:5000 · MODO TÁCTICO
          </div>
        </div>

        {/* Zone detail */}
        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-cyan" />
            <h3 className="text-sm font-semibold">{current.name}</h3>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
              current.risk === "high" ? "bg-danger/20 text-danger" : current.risk === "medium" ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
            }`}>
              {current.risk === "high" ? "Alto" : current.risk === "medium" ? "Medio" : "Bajo"}
            </span>
          </div>

          {[
            { label: "Congestión", value: current.congestion, suffix: "%", color: current.congestion > 70 ? "danger" : current.congestion > 50 ? "warning" : "success" },
            { label: "Vehículos detectados", value: current.vehicles, suffix: "", color: "cyan" },
            { label: "Humedad", value: current.humidity, suffix: "%", color: current.humidity > 85 ? "danger" : "cyan" },
            { label: "Prob. de incidente", value: current.risk === "high" ? 78 : current.risk === "medium" ? 45 : 18, suffix: "%", color: current.risk === "high" ? "danger" : current.risk === "medium" ? "warning" : "success" },
          ].map((m) => (
            <div key={m.label}>
              <div className="mb-1 flex justify-between text-[10px] uppercase text-muted-foreground">
                <span>{m.label}</span>
                <span className={`font-mono font-bold text-${m.color}`}>{m.value.toLocaleString("es-PE")}{m.suffix}</span>
              </div>
              {m.suffix === "%" && (
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full bg-${m.color} transition-all duration-500`} style={{ width: `${m.value}%` }} />
                </div>
              )}
            </div>
          ))}

          <div className="rounded-md border border-cyan/20 bg-cyan/5 p-2.5">
            <div className="mb-1 text-[9px] font-bold uppercase tracking-widest text-cyan">Recomendación IA</div>
            <div className="text-xs leading-relaxed text-foreground">{current.recommendation}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
