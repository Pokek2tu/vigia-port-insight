export type RiskLevel = "low" | "medium" | "high";

export interface ZoneState {
  id: string;
  name: string;
  x: number; // %
  y: number;
  risk: RiskLevel;
  congestion: number;
  vehicles: number;
  humidity: number;
  recommendation: string;
}

export interface CameraState {
  id: string;
  name: string;
  status: "ok" | "warn" | "fail";
  vehicles: number;
  persons: number;
  visibility: number;
  humidity: number;
  corrosion: number;
}

export interface ScenarioSnapshot {
  id: "normal" | "congestion" | "humidity";
  label: string;
  kpis: {
    vehicles: number;
    camerasActive: number;
    riskIndex: number;
    alerts: number;
    environment: string;
    aiPrecision: number;
    futureRisk: number;
  };
  zones: ZoneState[];
  cameras: CameraState[];
  ai: {
    headline: string;
    message: string;
    factors: { name: string; weight: number }[];
    next1h: { prob: number; confidence: number; note: string };
    next3h: { prob: number; confidence: number; note: string };
    next24h: { prob: number; confidence: number; note: string };
  };
  alerts: { level: RiskLevel; text: string; time: string }[];
  recommendations: string[];
  env: { humidity: number; temperature: number; rain: number; fog: number; corrosion: number; cameraQuality: number };
}

const baseZones = (overrides: Partial<Record<string, Partial<ZoneState>>>): ZoneState[] => {
  const z: ZoneState[] = [
    { id: "muelle-norte", name: "Muelle Norte", x: 22, y: 28, risk: "low", congestion: 30, vehicles: 120, humidity: 70, recommendation: "Operación estable" },
    { id: "muelle-sur", name: "Muelle Sur", x: 28, y: 62, risk: "low", congestion: 38, vehicles: 145, humidity: 72, recommendation: "Operación estable" },
    { id: "patio", name: "Patio de Contenedores", x: 50, y: 45, risk: "low", congestion: 42, vehicles: 320, humidity: 68, recommendation: "Flujo controlado" },
    { id: "acceso", name: "Acceso Principal", x: 78, y: 35, risk: "low", congestion: 45, vehicles: 510, humidity: 65, recommendation: "Tránsito fluido" },
    { id: "logistica", name: "Zona Logística", x: 65, y: 72, risk: "low", congestion: 28, vehicles: 210, humidity: 66, recommendation: "Sin observaciones" },
    { id: "vias", name: "Vías de Transporte", x: 85, y: 60, risk: "low", congestion: 35, vehicles: 430, humidity: 64, recommendation: "Velocidad media 42 km/h" },
    { id: "urbana", name: "Áreas Urbanas Cercanas", x: 92, y: 18, risk: "low", congestion: 20, vehicles: 180, humidity: 63, recommendation: "Bajo impacto" },
  ];
  return z.map((zone) => ({ ...zone, ...(overrides[zone.id] || {}) }));
};

const baseCameras = (mod: (c: CameraState, i: number) => CameraState): CameraState[] =>
  Array.from({ length: 6 }).map((_, i) =>
    mod(
      {
        id: `CAM-0${i + 1}`,
        name: `Cámara ${i + 1}`,
        status: "ok",
        vehicles: 10 + i * 3,
        persons: 4 + i,
        visibility: 95,
        humidity: 68,
        corrosion: 18,
      },
      i,
    ),
  );

export const SCENARIOS: Record<string, ScenarioSnapshot> = {
  normal: {
    id: "normal",
    label: "Operación Normal",
    kpis: { vehicles: 8742, camerasActive: 96, riskIndex: 22, alerts: 3, environment: "Estable", aiPrecision: 92, futureRisk: 18 },
    zones: baseZones({}),
    cameras: baseCameras((c) => ({ ...c, status: "ok", visibility: 92 + Math.floor(Math.random() * 6) })),
    ai: {
      headline: "Condiciones operativas normales",
      message: "No se requieren acciones correctivas. La IA mantiene monitoreo continuo de las 7 zonas del puerto.",
      factors: [
        { name: "Tráfico", weight: 35 },
        { name: "Permanencia", weight: 25 },
        { name: "Humedad", weight: 20 },
        { name: "Historial", weight: 20 },
      ],
      next1h: { prob: 14, confidence: 94, note: "Sin eventos significativos previstos" },
      next3h: { prob: 22, confidence: 89, note: "Leve aumento de flujo previsto" },
      next24h: { prob: 31, confidence: 82, note: "Estabilidad operativa esperada" },
    },
    alerts: [
      { level: "low", text: "Sistema operando dentro de parámetros nominales", time: "hace 2 min" },
      { level: "low", text: "Calibración automática de CAM-04 completada", time: "hace 18 min" },
    ],
    recommendations: ["Mantener monitoreo estándar", "Sin acciones requeridas"],
    env: { humidity: 68, temperature: 21, rain: 0, fog: 15, corrosion: 22, cameraQuality: 94 },
  },
  congestion: {
    id: "congestion",
    label: "Congestión Portuaria",
    kpis: { vehicles: 14380, camerasActive: 95, riskIndex: 78, alerts: 12, environment: "Estable", aiPrecision: 94, futureRisk: 82 },
    zones: baseZones({
      acceso: { risk: "high", congestion: 92, vehicles: 1240, recommendation: "Desviar tránsito pesado de inmediato" },
      vias: { risk: "high", congestion: 85, vehicles: 980, recommendation: "Activar rutas alternas" },
      patio: { risk: "medium", congestion: 70, vehicles: 620, recommendation: "Reforzar despachadores" },
      logistica: { risk: "medium", congestion: 65, vehicles: 450, recommendation: "Coordinar turnos extra" },
    }),
    cameras: baseCameras((c, i) => ({ ...c, vehicles: 25 + i * 8, status: i < 2 ? "warn" : "ok", visibility: 90 })),
    ai: {
      headline: "Riesgo alto de congestión en los próximos 45 minutos",
      message: "Detectado incremento masivo de camiones combinado con reducción de velocidad y aumento de tiempo de permanencia en accesos. Coincide con patrón histórico de eventos de saturación.",
      factors: [
        { name: "Tráfico", weight: 45 },
        { name: "Permanencia", weight: 30 },
        { name: "Humedad", weight: 15 },
        { name: "Historial", weight: 10 },
      ],
      next1h: { prob: 82, confidence: 96, note: "Saturación inminente en Acceso Principal" },
      next3h: { prob: 71, confidence: 90, note: "Efecto cascada hacia Vías de Transporte" },
      next24h: { prob: 48, confidence: 84, note: "Estabilización tras protocolo preventivo" },
    },
    alerts: [
      { level: "high", text: "Probabilidad 82% de congestión en Acceso Principal", time: "ahora" },
      { level: "medium", text: "Tiempo de permanencia +38% sobre promedio", time: "hace 4 min" },
      { level: "medium", text: "CAM-01 detecta cola de 240m de camiones", time: "hace 6 min" },
    ],
    recommendations: [
      "Desviar tránsito pesado por ruta alterna B",
      "Incrementar vigilancia en Acceso Principal",
      "Activar protocolo preventivo de gestión de colas",
      "Notificar a operadores logísticos",
    ],
    env: { humidity: 70, temperature: 22, rain: 0, fog: 18, corrosion: 24, cameraQuality: 91 },
  },
  humidity: {
    id: "humidity",
    label: "Humedad Extrema y Corrosión",
    kpis: { vehicles: 7210, camerasActive: 78, riskIndex: 71, alerts: 9, environment: "Crítico", aiPrecision: 90, futureRisk: 87 },
    zones: baseZones({
      "muelle-norte": { risk: "high", humidity: 94, recommendation: "Inspección preventiva de cubiertas" },
      "muelle-sur": { risk: "high", humidity: 96, recommendation: "Riesgo de corrosión elevado" },
      patio: { risk: "medium", humidity: 91, recommendation: "Revisar contenedores expuestos" },
      vias: { risk: "medium", humidity: 89, recommendation: "Visibilidad reducida, precaución" },
    }),
    cameras: baseCameras((c, i) => ({
      ...c,
      status: i < 3 ? "warn" : i === 5 ? "fail" : "ok",
      humidity: 90 + i,
      corrosion: 70 + i * 3,
      visibility: 55 - i * 5,
    })),
    ai: {
      headline: "Riesgo de corrosión 87% — Inspección preventiva recomendada",
      message: "Humedad ambiental sostenida por encima del 90% combinada con niebla costera. Las cámaras muestran degradación progresiva de calidad visual y posible empañamiento de lentes.",
      factors: [
        { name: "Humedad", weight: 48 },
        { name: "Niebla costera", weight: 22 },
        { name: "Estado cámaras", weight: 18 },
        { name: "Historial", weight: 12 },
      ],
      next1h: { prob: 64, confidence: 92, note: "Empañamiento progresivo en CAM-01 a CAM-03" },
      next3h: { prob: 78, confidence: 89, note: "Posible falla operativa CAM-06" },
      next24h: { prob: 87, confidence: 85, note: "Aceleración de corrosión en estructuras metálicas" },
    },
    alerts: [
      { level: "high", text: "Riesgo de corrosión 87% en Muelle Sur", time: "ahora" },
      { level: "high", text: "CAM-06 requiere mantenimiento — visibilidad 30%", time: "hace 1 min" },
      { level: "medium", text: "Niebla costera reduce visibilidad general 45%", time: "hace 8 min" },
    ],
    recommendations: [
      "Inspección preventiva de cubiertas y lentes",
      "Programar mantenimiento antes de falla operativa",
      "Aplicar tratamiento anti-corrosión en muelles",
      "Activar iluminación auxiliar por baja visibilidad",
    ],
    env: { humidity: 94, temperature: 18, rain: 12, fog: 78, corrosion: 87, cameraQuality: 52 },
  },
};

export const riskColor = (risk: RiskLevel) =>
  risk === "high" ? "var(--danger)" : risk === "medium" ? "var(--warning)" : "var(--success)";
