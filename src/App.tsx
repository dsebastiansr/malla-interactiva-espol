import { useMemo } from "react";
import { useMesh } from "./context/MeshContext";
import { MeshGrid } from "./components/MeshGrid";

function bounds(courses: { grid: { row: number | null; col: number | null } }[]) {
  let maxRow = 0, maxCol = 0;
  for (const c of courses) {
    if (c.grid.row) maxRow = Math.max(maxRow, c.grid.row);
    if (c.grid.col) maxCol = Math.max(maxCol, c.grid.col);
  }
  return { maxRow, maxCol };
}

export default function App() {
  const { index, career, setCareer, courses, passedCount, passedCredits } = useMesh();
  const { maxRow, maxCol } = bounds(courses);

  const title = useMemo(() => {
    const found = index.find((x) => x.code === career);
    return found ? `${found.name}` : career;
  }, [index, career]);


  return (
    <div className="text-white min-h-screen bg-[#1c1c1d] px-12 py-10 flex flex-col items-center">
      <header className="bg-[#2c2c2d] w-full p-6 rounded-[55px] flex flex-wrap gap-4 mb-4 items-center">
        <h1 className="text-3xl font-extrabold">Malla Interactiva ESPOL</h1>

        <div className="h-1.5 w-1.5 rounded-full  bg-[#a9a8a8]" />

        <select
          className="border-2 px-3 py-2 ring-0 outline-0 border-[#818181] text-white bg-[#1c1c1d]/50 rounded-full"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
        >
          {index.map((c) => (
            <option key={c.code} value={c.code} className="rounded-full bg-[#1c1c1d]/50">
              {c.name}
            </option>
          ))}
        </select>

        <div className="h-1.5 w-1.5 rounded-full  bg-[#a9a8a8]" />

        <div className="bg-[#1c1c1d]/50 rounded-full px-4 py-2">
          Aprobadas: <b>{passedCount}</b>
        </div>

        <div className="bg-[#1c1c1d]/50 rounded-full px-4 py-2">
          Créditos: <b>{passedCredits}</b>
        </div>
      </header>

      <div className="flex gap-4">
        <div className="w-[5%] bg-[#818181]/15 rounded-[55px] p-6"
          style={{
            gridTemplateRows: `repeat(${maxRow}, minmax(85px, 1fr))`,
            gridTemplateColumns: `repeat(${maxCol}, minmax(200px, 1fr))`,
          }}
        />

        <div className="w-[95%] overflow-auto">
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
