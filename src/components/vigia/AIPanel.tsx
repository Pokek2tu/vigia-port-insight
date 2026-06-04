import { Brain, Clock, Sparkles, TrendingUp } from "lucide-react";
import type { ScenarioSnapshot } from "@/lib/scenarios";

export function AIPanel({ snap }: { snap: ScenarioSnapshot }) {
  const preds = [
    { horizon: "Próxima hora", ...snap.ai.next1h },
    { horizon: "Próximas 3 horas", ...snap.ai.next3h },
    { horizon: "Próximas 24 horas", ...snap.ai.next24h },
  ];
  return (
    <div className="rounded-lg border border-border bg-panel shadow-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-cyan" />
          <h2 className="text-sm font-semibold">Panel de Inteligencia Artificial</h2>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-mono text-cyan">
          <Sparkles className="h-3 w-3" /> NEURAL ENGINE v4.2.1
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div className="rounded-md border border-cyan/30 bg-cyan/5 p-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan">Síntesis IA</div>
          <div className="mt-1 font-semibold text-foreground">{snap.ai.headline}</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{snap.ai.message}</p>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {preds.map((p) => {
            const tone = p.prob > 65 ? "danger" : p.prob > 35 ? "warning" : "success";
            return (
              <div key={p.horizon} className={`rounded-md border border-${tone}/30 bg-background/40 p-3`}>
                <div className="flex items-center gap-1 text-[10px] uppercase text-muted-foreground">
                  <Clock className="h-3 w-3" /> {p.horizon}
                </div>
                <div className={`mt-2 font-mono text-2xl font-bold text-${tone}`}>{p.prob}%</div>
                <div className="text-[10px] text-muted-foreground">prob. incidente</div>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Confianza</span>
                  <span className="font-mono text-cyan">{p.confidence}%</span>
                </div>
                <div className="mt-2 border-t border-border pt-2 text-[10px] text-muted-foreground">{p.note}</div>
              </div>
            );
          })}
        </div>

        <div>
          <div className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-cyan">
            <TrendingUp className="h-3 w-3" /> ¿Por qué se generó esta alerta?
          </div>
          <div className="space-y-1.5">
            {snap.ai.factors.map((f) => (
              <div key={f.name}>
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{f.name}</span>
                  <span className="font-mono font-bold text-foreground">{f.weight}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-to-r from-primary to-cyan transition-all duration-700" style={{ width: `${f.weight * 2}%`, maxWidth: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
