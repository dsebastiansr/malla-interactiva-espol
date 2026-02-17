export type Req = { code: string; name: string; type: string };

export type Course = {
  id: string;
  code: string | null;
  name: string;
  unit: "BASICO" | "PROFESIONAL" | "INTEGRACION" | "CPI";
  credits: number | null;
  grid: { row: number | null; col: number | null };
  requirements: Req[];
  approved_count_requirement: number | null;
};

export type CareerIndexItem = { 
  code: string;
  name: string;
  faculty: string
};

const DATA_BASE = import.meta.env.VITE_DATA_BASE ?? 'https://dsebastiansr.github.io/malla-interactiva-espol'; 

const cache = new Map<string, unknown>();

async function cachedJson<T>(key: string, url: string): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} cargando ${url}`);
  const data = (await res.json()) as T;
  cache.set(key, data);
  return data;
}

export function fetchIndex(): Promise<CareerIndexItem[]> {
  return cachedJson("index", `${DATA_BASE}/data/index.json`);
}

export function fetchMalla(careerCode: string, faculty: string): Promise<Course[]> {
  return cachedJson(`malla:${careerCode}`, `${DATA_BASE}/data/mallas/${faculty}/${careerCode}.json`);
}
