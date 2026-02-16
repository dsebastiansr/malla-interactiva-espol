import { useMemo } from 'react';
import { useMesh } from './context/MeshContext';
import { MeshGrid } from './components/MeshGrid';
import { listFaculties, careersByFaculty } from './lib/indexHelpers';

export default function App() {
  const {
    courses,
    index,
    faculty,
    setFaculty,
    career,
    setCareer,
    passedCount,
    passedCredits,
  } = useMesh();

  const faculties = useMemo(() => listFaculties(index), [index]);
  const careers = useMemo(
    () => careersByFaculty(index, faculty),
    [index, faculty],
  );

  return (
    <div className="text-white min-h-screen bg-[#1c1c1d] px-12 py-10 flex flex-col items-center max-md:p-6 gap-6">
      <header className="bg-[#2c2c2d] w-full p-6 max-md:p-6 rounded-[55px]  flex max-md:flex-col gap-4 items-center justify-between flex-wrap">
        <div className='flex items-center gap-3 max-md:flex-wrap'>
          <h1 className="text-3xl font-extrabold max-md:text-balance max-md:text-center">
            Malla Interactiva ESPOL
          </h1>

          <div className="h-1.5 w-1.5 rounded-full max-md:hidden bg-[#a9a8a8]" />

          <select
            className="border-2 px-3 py-2 ring-0 outline-0 border-[#818181] text-white bg-[#1c1c1d]/50 rounded-full max-md:w-full"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
          >
            {faculties.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <select
            className="border-2 px-3 py-2 ring-0 outline-0 border-[#818181] text-white bg-[#1c1c1d]/50 rounded-full truncate max-md:w-full"
            value={career}
            onChange={(e) => setCareer(e.target.value)}
          >
            {careers.map((c) => (
              <option key={c.code} value={c.code} className="truncate">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 max-md:w-full">
          <div className="bg-[#1c1c1d]/50 max-md:w-full max-md:text-center rounded-full px-4 py-2">
            Aprobadas: <b>{passedCount}</b>
          </div>

          <div className="bg-[#1c1c1d]/50 max-md:w-full max-md:text-center rounded-full px-4 py-2">
            Créditos: <b>{passedCredits}</b>
          </div>
        </div>
      </header>

      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex items-center gap-8 justify-start pl-12 max-md:pr-0 max-md:justify-center max-md:flex-wrap max-md:gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-basic-bg border-2 border-basic-stroke" />
            <span className="text-sm text-basic-text">Básico</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-professional-bg border-2 border-professional-stroke" />
            <span className="text-sm text-professional-text">Profesional</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-integrative-bg border-2 border-integrative-stroke" />
            <span className="text-sm text-integrative-text">Integración</span>
          </div>

          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-cpi-bg border-2 border-cpi-stroke" />
            <span className="text-sm text-cpi-text">
              Complementarias, Prácticas, Itinerario
            </span>
          </div>
        </div>

        <div className="w-full">
          {!courses ? (
            <div className="opacity-70">Cargando malla…</div>
          ) : (
            <MeshGrid />
          )}
        </div>
      </div>
    </div>
  );
}
