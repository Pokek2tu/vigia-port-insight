import { Activity, AlertTriangle, Camera, CloudDrizzle, Cpu, Truck } from "lucide-react";
import type { ScenarioSnapshot } from "@/lib/scenarios";

interface Props { snap: ScenarioSnapshot; }

const fmt = (n: number) => n.toLocaleString("es-PE");

export function KpiGrid({ snap }: Props) {
  const k = snap.kpis;
  const tone = (v: number) => (v < 35 ? "success" : v < 65 ? "warning" : "danger");
  const cards = [
    { icon: Truck, label: "Vehículos Detectados", value: fmt(k.vehicles), trend: "+12% vs prom.", color: "cyan" },
    { icon: Camera, label: "Cámaras Activas", value: `${k.camerasActive}%`, trend: `${Math.round(k.camerasActive * 0.06)}/6 operativas`, color: k.camerasActive > 90 ? "success" : "warning" },
    { icon: AlertTriangle, label: "Índice General de Riesgo", value: `${k.riskIndex}%`, trend: snap.id === "normal" ? "Bajo" : snap.id === "congestion" ? "Alto" : "Elevado", color: tone(k.riskIndex), bar: k.riskIndex },
    { icon: Activity, label: "Alertas Generadas", value: fmt(k.alerts), trend: snap.id === "normal" ? "rutinarias" : "requieren atención", color: k.alerts > 8 ? "danger" : "cyan" },
    { icon: CloudDrizzle, label: "Estado Ambiental", value: k.environment, trend: `Humedad ${snap.env.humidity}%`, color: snap.env.humidity > 85 ? "danger" : "cyan" },
    { icon: Cpu, label: "Precisión IA", value: `${k.aiPrecision}%`, trend: "Modelo v4.2.1", color: "success" },
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {cards.map((c) => (
        <div key={c.label} className="group relative overflow-hidden rounded-lg border border-border bg-panel p-4 shadow-panel transition-all hover:border-cyan/40">
          <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className={`grid h-8 w-8 place-items-center rounded-md bg-${c.color}/15 text-${c.color}`}>
                <c.icon className="h-4 w-4" />
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">LIVE</span>
            </div>
            <div className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</div>
            <div key={c.value} className="count-up mt-1 font-mono text-2xl font-bold text-foreground">{c.value}</div>
            <div className={`mt-1 text-[10px] text-${c.color}`}>{c.trend}</div>
            {"bar" in c && c.bar !== undefined && (
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                <div className={`h-full bg-${c.color} transition-all duration-700`} style={{ width: `${c.bar}%` }} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
