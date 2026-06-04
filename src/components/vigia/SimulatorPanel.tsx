import { Play, RotateCcw, FlaskConical, ChevronRight, AlertOctagon, ShieldCheck, CloudFog } from "lucide-react";
import type { ScenarioSnapshot } from "@/lib/scenarios";

interface Props {
  selected: ScenarioSnapshot["id"];
  onSelect: (id: ScenarioSnapshot["id"]) => void;
  onRun: () => void;
  onReset: () => void;
  running: boolean;
  progress: number;
}

const opts = [
  { id: "normal" as const, label: "Operación Normal", desc: "Flujo vehicular estable y cámaras nominales.", icon: ShieldCheck, tone: "success" },
  { id: "congestion" as const, label: "Congestión Portuaria", desc: "Predicción de saturación en acceso principal.", icon: AlertOctagon, tone: "danger" },
  { id: "humidity" as const, label: "Humedad Extrema y Corrosión", desc: "Diferenciador: degradación ambiental progresiva.", icon: CloudFog, tone: "warning" },
];

export function SimulatorPanel({ selected, onSelect, onRun, onReset, running, progress }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-cyan/30 bg-panel shadow-panel">
      <div className="relative border-b border-border px-4 py-3" style={{ background: "var(--gradient-glow)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-cyan/20 text-cyan">
              <FlaskConical className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Centro de Simulación de Riesgos</h2>
              <p className="text-[10px] text-muted-foreground">Demuestra cómo responde la IA ante distintos escenarios operativos y ambientales.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRun}
              disabled={running}
              className="flex items-center gap-1.5 rounded-md bg-cyan px-3 py-1.5 text-xs font-bold text-background shadow-glow transition-all hover:scale-105 disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" /> {running ? "Ejecutando..." : "Ejecutar Simulación"}
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-3">
        {opts.map((o, i) => {
          const isSel = selected === o.id;
          return (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              className={`group relative overflow-hidden rounded-md border p-3 text-left transition-all ${
                isSel ? `border-${o.tone} bg-${o.tone}/10 shadow-glow` : "border-border bg-background/40 hover:border-cyan/40"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`grid h-7 w-7 place-items-center rounded bg-${o.tone}/20 text-${o.tone}`}>
                  <o.icon className="h-4 w-4" />
                </span>
                <span className="text-[10px] font-mono uppercase text-muted-foreground">Escenario {i + 1}</span>
                {isSel && <ChevronRight className={`ml-auto h-4 w-4 text-${o.tone}`} />}
              </div>
              <div className="mt-2 text-sm font-bold text-foreground">{o.label}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">{o.desc}</div>
            </button>
          );
        })}
      </div>

      {running && (
        <div className="border-t border-border px-4 py-2">
          <div className="mb-1 flex justify-between text-[10px] uppercase text-cyan">
            <span>Procesando escenario · {opts.find((o) => o.id === selected)?.label}</span>
            <span className="font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-cyan to-primary transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
