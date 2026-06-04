import type { CameraState, ScenarioSnapshot, ZoneState } from "./scenarios";

const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);

const lerpZone = (a: ZoneState, b: ZoneState, t: number): ZoneState => ({
  ...b,
  congestion: lerp(a.congestion, b.congestion, t),
  vehicles: lerp(a.vehicles, b.vehicles, t),
  humidity: lerp(a.humidity, b.humidity, t),
  risk: t > 0.55 ? b.risk : a.risk,
  recommendation: t > 0.55 ? b.recommendation : a.recommendation,
});

const lerpCam = (a: CameraState, b: CameraState, t: number): CameraState => ({
  ...b,
  vehicles: lerp(a.vehicles, b.vehicles, t),
  persons: lerp(a.persons, b.persons, t),
  visibility: lerp(a.visibility, b.visibility, t),
  humidity: lerp(a.humidity, b.humidity, t),
  corrosion: lerp(a.corrosion, b.corrosion, t),
  status: t > 0.55 ? b.status : a.status,
});

export function interpolate(a: ScenarioSnapshot, b: ScenarioSnapshot, t: number): ScenarioSnapshot {
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  return {
    ...b,
    kpis: {
      vehicles: lerp(a.kpis.vehicles, b.kpis.vehicles, ease),
      camerasActive: lerp(a.kpis.camerasActive, b.kpis.camerasActive, ease),
      riskIndex: lerp(a.kpis.riskIndex, b.kpis.riskIndex, ease),
      alerts: lerp(a.kpis.alerts, b.kpis.alerts, ease),
      environment: ease > 0.55 ? b.kpis.environment : a.kpis.environment,
      aiPrecision: lerp(a.kpis.aiPrecision, b.kpis.aiPrecision, ease),
      futureRisk: lerp(a.kpis.futureRisk, b.kpis.futureRisk, ease),
    },
    zones: a.zones.map((z, i) => lerpZone(z, b.zones[i], ease)),
    cameras: a.cameras.map((c, i) => lerpCam(c, b.cameras[i], ease)),
    env: {
      humidity: lerp(a.env.humidity, b.env.humidity, ease),
      temperature: lerp(a.env.temperature, b.env.temperature, ease),
      rain: lerp(a.env.rain, b.env.rain, ease),
      fog: lerp(a.env.fog, b.env.fog, ease),
      corrosion: lerp(a.env.corrosion, b.env.corrosion, ease),
      cameraQuality: lerp(a.env.cameraQuality, b.env.cameraQuality, ease),
    },
    ai: ease > 0.4 ? b.ai : a.ai,
    alerts: ease > 0.5 ? b.alerts : a.alerts,
    recommendations: ease > 0.5 ? b.recommendations : a.recommendations,
  };
}
