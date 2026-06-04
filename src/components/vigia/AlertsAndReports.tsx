import { AlertTriangle, Bell, Download, FileSpreadsheet, FileText } from "lucide-react";
import type { ScenarioSnapshot } from "@/lib/scenarios";

export function AlertsAndReports({ snap }: { snap: ScenarioSnapshot }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div className="rounded-lg border border-border bg-panel shadow-panel">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan" />
            <h2 className="text-sm font-semibold">Alertas y Recomendaciones</h2>
          </div>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-mono">{snap.alerts.length} activas</span>
        </div>
        <div className="divide-y divide-border">
          {snap.alerts.map((a, i) => {
            const tone = a.level === "high" ? "danger" : a.level === "medium" ? "warning" : "success";
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-${tone}/15 text-${tone}`}>
                  <AlertTriangle className="h-3.5 w-3.5" />
                </span>
                <div className="flex-1">
                  <div className="text-xs text-foreground">{a.text}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{a.time}</div>
                </div>
                <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase bg-${tone}/20 text-${tone}`}>
                  {a.level === "high" ? "Alta" : a.level === "medium" ? "Media" : "Baja"}
                </span>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border bg-background/40 p-3">
          <div className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan">Recomendaciones IA</div>
          <ul className="space-y-1 text-xs">
            {snap.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-panel shadow-panel">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Reportes Inteligentes</h2>
          <span className="text-[10px] uppercase text-muted-foreground">Auto-generados</span>
        </div>
        <div className="p-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Genera un informe consolidado con alertas, zonas críticas, tendencias, estado de cámaras, indicadores ambientales y recomendaciones de IA.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button className="group flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-left transition-all hover:border-danger hover:bg-danger/10">
              <FileText className="h-5 w-5 text-danger" />
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground">Reporte PDF</div>
                <div className="text-[10px] text-muted-foreground">Informe ejecutivo</div>
              </div>
              <Download className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-danger" />
            </button>
            <button className="group flex items-center gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-left transition-all hover:border-success hover:bg-success/10">
              <FileSpreadsheet className="h-5 w-5 text-success" />
              <div className="flex-1">
                <div className="text-xs font-bold text-foreground">Reporte Excel</div>
                <div className="text-[10px] text-muted-foreground">Datos crudos</div>
              </div>
              <Download className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-success" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { label: "Alertas", value: snap.alerts.length },
              { label: "Zonas críticas", value: snap.zones.filter((z) => z.risk !== "low").length },
              { label: "Cámaras OK", value: snap.cameras.filter((c) => c.status === "ok").length + "/6" },
            ].map((s) => (
              <div key={s.label} className="rounded-md border border-border bg-background/40 p-2">
                <div className="font-mono text-lg font-bold text-cyan">{s.value}</div>
                <div className="text-[9px] uppercase text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
