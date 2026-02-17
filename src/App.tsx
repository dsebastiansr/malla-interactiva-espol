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
    <div className="text-white min-h-screen bg-[#1c1c1d] px-12 py-10 flex flex-col items-center max-md:p-4 gap-6">
      <header className="bg-[#2c2c2d] w-full p-6 max-md:p-6 rounded-[55px]  flex max-md:flex-col gap-4 items-center justify-between flex-wrap">
        <div className="flex items-center gap-3 max-md:flex-wrap">
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
            className="border-2 px-3 py-2 ring-0 outline-0 border-[#818181] text-white bg-[#1c1c1d]/50 rounded-full w-64 truncate max-md:w-full"
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

      <div className="max-[1300px]:h-svh max-md:[calc(100svh-5%)] flex items-center h-full w-full overflow-auto sb sb-neutral rounded-[55px] touch-pan-x touch-pan-y overscroll-contain">
        {!courses ? (
          <div className="h-full w-full flex items-center justify-center bg-[#818181]/15">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-8 w-8"
              width="128"
              height="128"
              viewBox="0 0 24 24"
            >
              <g fill="#ffffff">
                <path
                  fill-rule="evenodd"
                  d="M12 19a7 7 0 1 0 0-14a7 7 0 0 0 0 14m0 3c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10"
                  clip-rule="evenodd"
                  opacity=".2"
                />
                <path d="M2 12C2 6.477 6.477 2 12 2v3a7 7 0 0 0-7 7z" />
              </g>
            </svg>
          </div>
        ) : (
          <MeshGrid />
        )}
      </div>

    </div>
  );
}
