import { useMesh } from "../context/MeshContext";

function bounds(courses: { grid: { row: number | null; col: number | null } }[]) {
  let maxRow = 0, maxCol = 0;
  for (const c of courses) {
    if (c.grid.row) maxRow = Math.max(maxRow, c.grid.row);
    if (c.grid.col) maxCol = Math.max(maxCol, c.grid.col);
  }
  return { maxRow, maxCol };
}

export function MeshGrid() {
  const { courses } = useMesh();
  if (!courses) return null;

  const { maxRow, maxCol } = bounds(courses);

  return (
    <div
      className="overflow-auto grid gap-3 bg-[#818181]/15 rounded-[55px] p-6"
      style={{
        gridTemplateRows: `repeat(${maxRow}, minmax(85px, 1fr))`,
        gridTemplateColumns: `repeat(${maxCol}, minmax(200px, 1fr))`,
      }}
    >
      {courses.map((c) => (
        <div key={c.id} style={{ gridRow: c.grid.row ?? 1, gridColumn: c.grid.col ?? 1 }}
          className="">
          <SubjectButton c={c} />
        </div>
      ))}
    </div>
  );
}

import SubjectButton from "./SubjectButton";
