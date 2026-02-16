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
import { cascadeUnpass } from "../lib/rules";

type passedMap = Record<string, boolean>;

type MeshContextValue = {
  index: CareerIndexItem[];
  career: string;
  setCareer: (code: string) => void;

  courses: Course[] | null;
  passed: passedMap;
  togglePassed: (id: string) => void;
  resetPassed: () => void;

  // selectors útiles (para que no lo recalcules en 10 componentes)
  passedCount: number;
  passedCredits: number;
  faculty: string;
  setFaculty: (faculty: string) => void;
};

const MeshContext = createContext<MeshContextValue | null>(null);

function storageKey(career: string) {
  return `malla:passed:${career}`;
}

export function MeshProvider({ children }: { children: React.ReactNode }) {
  const [index, setIndex] = useState<CareerIndexItem[]>([]);
  const [career, setCareer] = useState("CI013");
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [passed, setPassed] = useState<passedMap>({});
  const [faculty, setFaculty] = useState<string>("");


  // 1) cargar index una sola vez
  useEffect(() => {
    fetchIndex().then(setIndex).catch(console.error);
  }, []);

  useEffect(() => {
    if (index.length === 0) return;

    // init faculty si está vacío
    if (!faculty) {
      setFaculty(index[0].faculty);
      return;
    }

    // si la carrera actual no pertenece a la facultad, cámbiala
    const current = index.find((x) => x.code === career);
    const valid = current && current.faculty === faculty;

    if (!valid) {
      const first = index.find((x) => x.faculty === faculty);
      if (first) setCareer(first.code);
    }
  }, [index, faculty, career]);

  // 2) cargar malla cada vez que cambia career + cargar progreso local
  useEffect(() => {
    setCourses(null);
    fetchMalla(career, faculty)
      .then((data) => {
        setCourses(resolveGridCollisions(data));

        const raw = localStorage.getItem(storageKey(career));
        setPassed(raw ? (JSON.parse(raw) as passedMap) : {});
      })
      .catch(console.error);
  }, [career, faculty]);

  function togglePassed(id: string) {
    setPassed((prev) => {
      const currently = !!prev[id];
      let next = { ...prev, [id]: !currently };

      // si lo estás desmarcando, aplica cascada
      if (currently && courses) {
        next = cascadeUnpass(courses, prev, id);
      }

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
      if (passed[c.id] && typeof c.credits === "number") sum += (c.credits / 3);
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
    faculty,
    setFaculty,
  };

  return <MeshContext.Provider value={value}>{children}</MeshContext.Provider>;
}

export function useMesh() {
  const ctx = useContext(MeshContext);
  if (!ctx) throw new Error("useMesh() debe usarse dentro de <MeshProvider />");
  return ctx;
}