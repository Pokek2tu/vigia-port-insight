import { TrendingUp, Sparkles } from "lucide-react";

export function FutureRiskBanner({ value, label }: { value: number; label: string }) {
  const tone = value > 65 ? "danger" : value > 35 ? "warning" : "success";
  return (
    <div className="relative overflow-hidden rounded-lg border border-cyan/30 bg-panel p-4 shadow-panel">
      <div className="absolute inset-0 opacity-60" style={{ background: "var(--gradient-glow)" }} />
      <div className="relative flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-cyan">De vigilancia reactiva a inteligencia preventiva</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Escenario activo</div>
            <div className="font-mono text-sm font-bold text-foreground">{label}</div>
          </div>
          <div className={`flex items-center gap-3 rounded-md border border-${tone}/40 bg-${tone}/10 px-4 py-2`}>
            <TrendingUp className={`h-5 w-5 text-${tone}`} />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Riesgo futuro estimado</div>
              <div key={value} className={`count-up font-mono text-2xl font-bold text-${tone} glow-text`}>{value}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
