import { Camera, Users, Truck, Eye, Droplets, Wrench } from "lucide-react";
import type { ScenarioSnapshot, CameraState } from "@/lib/scenarios";

const statusMeta = (s: CameraState["status"]) => ({
  ok: { color: "success", label: "Operativa" },
  warn: { color: "warning", label: "Atención" },
  fail: { color: "danger", label: "Mantenimiento" },
}[s]);

export function CameraGrid({ snap }: { snap: ScenarioSnapshot }) {
  return (
    <div className="rounded-lg border border-border bg-panel shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-cyan" />
          <h2 className="text-sm font-semibold">Monitoreo Inteligente de Cámaras</h2>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">6 nodos · IA visual activa</span>
      </div>

      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {snap.cameras.map((cam) => {
          const meta = statusMeta(cam.status);
          const fogged = cam.visibility < 60;
          return (
            <div key={cam.id} className={`group overflow-hidden rounded-md border bg-background border-${meta.color}/40`}>
              {/* Video frame */}
              <div className="relative aspect-video overflow-hidden bg-black">
                {/* Simulated CCTV scene */}
                <div className="absolute inset-0" style={{
                  background: `linear-gradient(180deg, oklch(0.25 0.05 250 / 0.7) 0%, oklch(0.15 0.03 260) 60%, oklch(0.2 0.04 250) 100%)`,
                }} />
                {/* "Vehicles" */}
                {Array.from({ length: Math.min(6, Math.floor(cam.vehicles / 5)) }).map((_, i) => (
                  <div key={i} className="absolute h-2 w-4 rounded-sm bg-cyan/60" style={{
                    left: `${10 + i * 14}%`, top: `${55 + (i % 2) * 8}%`,
                    boxShadow: "0 0 8px oklch(0.78 0.15 220 / 0.6)",
                  }} />
                ))}
                {/* Detection boxes */}
                <div className="absolute left-[12%] top-[52%] h-5 w-8 border border-cyan/80">
                  <span className="absolute -top-3 left-0 bg-cyan px-1 text-[7px] font-bold text-background">CAR 0.98</span>
                </div>
                {cam.persons > 5 && (
                  <div className="absolute right-[20%] top-[40%] h-7 w-3 border border-success/80">
                    <span className="absolute -top-3 left-0 bg-success px-1 text-[7px] font-bold text-background">PER 0.91</span>
                  </div>
                )}
                {/* Fog overlay */}
                {fogged && <div className="absolute inset-0 bg-white/25 backdrop-blur-[2px]" />}
                {/* Scan line */}
                <div className="scan-line absolute inset-0" />
                {/* HUD */}
                <div className="absolute left-1.5 top-1.5 flex items-center gap-1 font-mono text-[9px] text-cyan">
                  <span className={`h-1.5 w-1.5 rounded-full bg-${meta.color} flicker`} /> REC · {cam.id}
                </div>
                <div className="absolute right-1.5 top-1.5 font-mono text-[9px] text-cyan/70">
                  {new Date().toLocaleTimeString("es-PE", { hour12: false })}
                </div>
                <div className={`absolute bottom-1.5 right-1.5 rounded bg-${meta.color}/20 px-1.5 py-0.5 text-[8px] font-bold uppercase text-${meta.color}`}>
                  {meta.label}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-1.5 p-2 text-[10px]">
                <Stat icon={Truck} label="Vehículos" value={cam.vehicles} />
                <Stat icon={Users} label="Personas" value={cam.persons} />
                <Stat icon={Eye} label="Visibilidad" value={`${cam.visibility}%`} tone={cam.visibility < 60 ? "danger" : cam.visibility < 80 ? "warning" : "success"} />
                <Stat icon={Droplets} label="Humedad" value={`${cam.humidity}%`} tone={cam.humidity > 85 ? "danger" : "cyan"} />
                <div className="col-span-2 mt-0.5">
                  <div className="mb-0.5 flex items-center justify-between text-[9px] uppercase text-muted-foreground">
                    <span className="flex items-center gap-1"><Wrench className="h-2.5 w-2.5" /> Riesgo corrosión</span>
                    <span className={`font-mono font-bold ${cam.corrosion > 65 ? "text-danger" : cam.corrosion > 40 ? "text-warning" : "text-success"}`}>{cam.corrosion}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full ${cam.corrosion > 65 ? "bg-danger" : cam.corrosion > 40 ? "bg-warning" : "bg-success"} transition-all duration-500`} style={{ width: `${cam.corrosion}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone = "cyan" }: { icon: any; label: string; value: string | number; tone?: string }) {
  return (
    <div className="flex items-center justify-between rounded bg-secondary/40 px-1.5 py-1">
      <span className="flex items-center gap-1 text-muted-foreground"><Icon className="h-2.5 w-2.5" /> {label}</span>
      <span className={`font-mono font-bold text-${tone}`}>{value}</span>
    </div>
  );
}
