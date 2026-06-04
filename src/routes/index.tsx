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
import { interpolate } from "@/lib/interpolate";

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
  const [snap, setSnap] = useState<ScenarioSnapshot>(SCENARIOS.normal);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [futureRisk, setFutureRisk] = useState(SCENARIOS.normal.kpis.futureRisk);
  const rafRef = useRef<number | null>(null);

  // Continuous live jitter on future risk to convey real-time feel
  useEffect(() => {
    const target = snap.kpis.futureRisk;
    const id = window.setInterval(() => {
      const jitter = (Math.random() - 0.5) * 5;
      setFutureRisk(Math.max(0, Math.min(100, Math.round(target + jitter))));
    }, 1200);
    return () => clearInterval(id);
  }, [snap.kpis.futureRisk]);

  // Subtle ambient drift on KPIs when idle (not running) — feels "live"
  useEffect(() => {
    if (running) return;
    const id = window.setInterval(() => {
      setSnap((s) => ({
        ...s,
        kpis: {
          ...s.kpis,
          vehicles: s.kpis.vehicles + Math.floor((Math.random() - 0.4) * 12),
          alerts: Math.max(0, s.kpis.alerts + (Math.random() > 0.85 ? 1 : 0)),
        },
        cameras: s.cameras.map((c) => ({
          ...c,
          vehicles: Math.max(0, c.vehicles + Math.floor((Math.random() - 0.5) * 3)),
          persons: Math.max(0, c.persons + Math.floor((Math.random() - 0.5) * 2)),
        })),
      }));
    }, 2000);
    return () => clearInterval(id);
  }, [running]);

  const run = () => {
    if (running) return;
    const from = snap;
    const to = SCENARIOS[selected];
    setRunning(true);
    setProgress(0);
    const start = performance.now();
    const duration = 3500;

    const step = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(1, elapsed / duration);
      setProgress(t * 100);
      setSnap(interpolate(from, to, t));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setSnap(to);
        setRunning(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRunning(false);
    setProgress(0);
    setSelected("normal");
    setSnap(SCENARIOS.normal);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

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
        <CameraGrid snap={snap} running={running} />
        <EnvironmentPanel snap={snap} />
        <AlertsAndReports snap={snap} />
        <footer className="py-6 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          VigiaPort AI · Puerto del Callao · Smart Port Operations Center · v4.2.1
        </footer>
      </main>
    </div>
  );
}
