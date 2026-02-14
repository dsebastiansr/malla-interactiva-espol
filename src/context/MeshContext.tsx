import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  fetchIndex,
  fetchMalla,
  type CareerIndexItem,
  type Course,
} from '../lib/meshApi';
import { resolveGridCollisions } from '../lib/resolveGrid';

type passedMap = Record<string, boolean>;

type MeshContextValue = {
  index: CareerIndexItem[];
  career: string;
  setCareer: (code: string) => void;

  courses: Course[] | null;
  passed: PassedMap;
  togglePassed: (id: string) => void;
  resetPassed: () => void;

  // selectors útiles (para que no lo recalcules en 10 componentes)
  passedCount: number;
  passedCredits: number;
};

const MeshContext = createContext<MeshContextValue | null>(null);

function storageKey(career: string) {
  return `malla:passed:${career}`;
}

export function MeshProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState<CareerIndexItem[]>([]);
  const [career, setCareer] = useState("CI013");
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [passed, setPassed] = useState<PassedMap>({});

  // 1) cargar index una sola vez
  useEffect(() => {
    fetchIndex().then(setIndex).catch(console.error);
  }, []);

  // 2) cargar malla cada vez que cambia career + cargar progreso local
  useEffect(() => {
    setCourses(null);

    fetchMalla(career)
      .then((data) => {
        setCourses(resolveGridCollisions(data));

        const raw = localStorage.getItem(storageKey(career));
        setPassed(raw ? (JSON.parse(raw) as PassedMap) : {});
      })
      .catch(console.error);
  }, [career]);

  function togglePassed(id: string) {
    setPassed((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem(storageKey(career), JSON.stringify(next));
      return next;
    });
  }

  function resetPassed() {
    setPassed({});
    localStorage.removeItem(storageKey(career));
  }

  const passedCount = useMemo(
    () => Object.values(passed).filter(Boolean).length,
    [passed]
  );

  const passedCredits = useMemo(() => {
    if (!courses) return 0;
    let sum = 0;
    for (const c of courses) {
      if (passed[c.id] && typeof c.credits === "number") sum += c.credits;
    }
    return sum;
  }, [courses, passed]);

  const value: MeshContextValue = {
    index,
    career,
    setCareer,
    courses,
    passed,
    togglePassed,
    resetPassed,
    passedCount,
    passedCredits,
  };

  return <MeshContext.Provider value={value}>{children}</MeshContext.Provider>;
}

export function useMesh() {
  const ctx = useContext(MeshContext);
  if (!ctx) throw new Error("useMesh() debe usarse dentro de <MeshProvider />");
  return ctx;
}