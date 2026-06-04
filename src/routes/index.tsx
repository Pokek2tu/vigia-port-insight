import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { TopBar } from "@/components/vigia/TopBar";
import { KpiGrid } from "@/components/vigia/KpiGrid";
import { PortMap } from "@/components/vigia/PortMap";
import { CameraGrid } from "@/components/vigia/CameraGrid";
import { AIPanel } from "@/components/vigia/AIPanel";
import { EnvironmentPanel } from "@/components/vigia/EnvironmentPanel";
import { SimulatorPanel } from "@/components/vigia/SimulatorPanel";
import { AlertsAndReports } from "@/components/vigia/AlertsAndReports";
import { FutureRiskBanner } from "@/components/vigia/FutureRiskBanner";
import { SCENARIOS, type ScenarioSnapshot } from "@/lib/scenarios";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VigiaPort AI — Smart Port Operations Center" },
      { name: "description", content: "Plataforma de inteligencia artificial para monitoreo, predicción de riesgos y análisis ambiental en el Puerto del Callao." },
      { property: "og:title", content: "VigiaPort AI — Smart Port Operations Center" },
      { property: "og:description", content: "De vigilancia reactiva a inteligencia preventiva." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [selected, setSelected] = useState<ScenarioSnapshot["id"]>("normal");
  const [active, setActive] = useState<ScenarioSnapshot["id"]>("normal");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [futureRisk, setFutureRisk] = useState(SCENARIOS.normal.kpis.futureRisk);
  const timerRef = useRef<number | null>(null);

  const snap = SCENARIOS[active];

  // Animate future risk indicator continuously
  useEffect(() => {
    const target = snap.kpis.futureRisk;
    const id = window.setInterval(() => {
      setFutureRisk((p) => {
        const jitter = (Math.random() - 0.5) * 4;
        const next = target + jitter;
        return Math.max(0, Math.min(100, Math.round(next)));
      });
    }, 1500);
    return () => clearInterval(id);
  }, [snap.kpis.futureRisk]);

  const run = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    const start = performance.now();
    const duration = 2200;
    const step = () => {
      const p = Math.min(100, ((performance.now() - start) / duration) * 100);
      setProgress(p);
      if (p < 100) {
        timerRef.current = requestAnimationFrame(step);
      } else {
        setActive(selected);
        setRunning(false);
      }
    };
    timerRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
    setRunning(false);
    setProgress(0);
    setActive("normal");
    setSelected("normal");
  };

  return (
    <div className="min-h-screen">
      <TopBar />
      <main className="mx-auto max-w-[1600px] space-y-4 p-4">
        <FutureRiskBanner value={futureRisk} label={snap.label} />
        <KpiGrid snap={snap} />
        <SimulatorPanel
          selected={selected}
          onSelect={setSelected}
          onRun={run}
          onReset={reset}
          running={running}
          progress={progress}
        />
        <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <PortMap snap={snap} />
          <AIPanel snap={snap} />
        </div>
        <CameraGrid snap={snap} />
        <EnvironmentPanel snap={snap} />
        <AlertsAndReports snap={snap} />
        <footer className="py-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          VigiaPort AI · Puerto del Callao · Smart Port Operations Center · v4.2.1
        </footer>
      </main>
    </div>
  );
}
