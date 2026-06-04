import { Bell, Shield, User, Radio } from "lucide-react";

const NAV = ["Dashboard", "Monitoreo", "Mapa Inteligente", "Predicciones IA", "Estado de Cámaras", "Análisis Ambiental", "Reportes"];

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-panel/90 backdrop-blur-xl">
      <div className="flex items-center gap-6 px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-cyan">
            <Shield className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-success shadow-glow" />
          </div>
          <div className="leading-tight">
            <div className="font-bold tracking-tight text-foreground">VigiaPort <span className="text-cyan">AI</span></div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Smart Port Ops Center</div>
          </div>
        </div>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((item, i) => (
            <button
              key={item}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                i === 0 ? "bg-primary/20 text-cyan" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-1.5 md:flex">
            <span className="relative grid h-2 w-2 place-items-center rounded-full bg-success text-success/40 pulse-dot" />
            <span className="text-[11px] font-semibold text-success">Sistema Operativo</span>
          </div>
          <button className="relative rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          <button className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Radio className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-2 py-1">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-cyan/20 text-cyan">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="hidden text-left leading-tight md:block">
              <div className="text-[11px] font-semibold">Operador 01</div>
              <div className="text-[9px] uppercase text-muted-foreground">Nivel 3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-t border-border bg-background/60 py-1">
        <div className="ticker flex whitespace-nowrap text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {[...Array(2)].map((_, k) => (
            <div key={k} className="flex shrink-0 gap-8 px-6">
              <span><span className="text-cyan">●</span> Latencia IA 42ms</span>
              <span><span className="text-success">●</span> 6/6 cámaras enlazadas</span>
              <span><span className="text-warning">●</span> Humedad costera 68%</span>
              <span><span className="text-cyan">●</span> Modelo v4.2.1 cargado</span>
              <span><span className="text-success">●</span> Telemetría sincronizada</span>
              <span><span className="text-cyan">●</span> 14 nodos perimetrales activos</span>
              <span className="text-cyan glow-text">"De vigilancia reactiva a inteligencia preventiva."</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
