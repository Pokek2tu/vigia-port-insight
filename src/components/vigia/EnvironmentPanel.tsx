import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CloudRain, Droplets, Eye, Thermometer, Wind, Zap } from "lucide-react";
import type { ScenarioSnapshot } from "@/lib/scenarios";

export function EnvironmentPanel({ snap }: { snap: ScenarioSnapshot }) {
  const data = Array.from({ length: 24 }).map((_, i) => {
    const base = snap.env.humidity;
    const variance = snap.id === "humidity" ? 8 : 4;
    return {
      h: `${String(i).padStart(2, "0")}:00`,
      humedad: Math.max(40, Math.min(99, base + Math.sin(i / 3) * variance + (i > 18 && snap.id === "humidity" ? 6 : 0))),
      corrosion: Math.max(10, Math.min(95, snap.env.corrosion + Math.cos(i / 4) * 6)),
    };
  });

  const items = [
    { icon: Droplets, label: "Humedad", value: `${snap.env.humidity}%`, tone: snap.env.humidity > 85 ? "danger" : "cyan" },
    { icon: Thermometer, label: "Temperatura", value: `${snap.env.temperature}°C`, tone: "cyan" },
    { icon: CloudRain, label: "Lluvia", value: `${snap.env.rain} mm`, tone: snap.env.rain > 5 ? "warning" : "success" },
    { icon: Wind, label: "Niebla costera", value: `${snap.env.fog}%`, tone: snap.env.fog > 60 ? "danger" : "cyan" },
    { icon: Zap, label: "Riesgo corrosión", value: `${snap.env.corrosion}%`, tone: snap.env.corrosion > 65 ? "danger" : snap.env.corrosion > 40 ? "warning" : "success" },
    { icon: Eye, label: "Calidad visual cám.", value: `${snap.env.cameraQuality}%`, tone: snap.env.cameraQuality < 60 ? "danger" : "success" },
  ];

  return (
    <div className="rounded-lg border border-border bg-panel shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Módulo Ambiental Inteligente</h2>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Estación costera · Callao</span>
      </div>

      <div className="grid gap-3 p-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="grid grid-cols-2 gap-2">
          {items.map((it) => (
            <div key={it.label} className="rounded-md border border-border bg-background/40 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase text-muted-foreground">
                <it.icon className={`h-3 w-3 text-${it.tone}`} /> {it.label}
              </div>
              <div className={`mt-1 font-mono text-lg font-bold text-${it.tone}`}>{it.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border bg-background/40 p-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase text-muted-foreground">
            <span>Humedad vs Corrosión (24h)</span>
            <span className="flex gap-3">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan" /> Humedad</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Corrosión</span>
            </span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.15 220)" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="oklch(0.78 0.15 220)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="h" tick={{ fontSize: 9, fill: "oklch(0.7 0.03 250)" }} interval={3} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "oklch(0.7 0.03 250)" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ background: "oklch(0.22 0.045 260)", border: "1px solid oklch(0.32 0.05 260)", borderRadius: 6, fontSize: 11 }} />
              <Area type="monotone" dataKey="humedad" stroke="oklch(0.78 0.15 220)" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="corrosion" stroke="oklch(0.78 0.16 75)" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
