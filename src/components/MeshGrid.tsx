import { useEffect, useState } from 'react';
import { useMesh } from '../context/MeshContext';
import SubjectButton from './SubjectButton';

function bounds(
  courses: { grid: { row: number | null; col: number | null } }[],
) {
  let maxRow = 0,
    maxCol = 0;
  for (const c of courses) {
    if (c.grid.row) maxRow = Math.max(maxRow, c.grid.row);
    if (c.grid.col) maxCol = Math.max(maxCol, c.grid.col);
  }
  return { maxRow, maxCol };
}

export function MeshGrid() {
  const { courses } = useMesh();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)'); // md
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (!courses) return null;

  const { maxRow, maxCol } = bounds(courses);

  // si transpones: filas <-> columnas
  const rows = isMobile ? maxCol : maxRow;
  const cols = isMobile ? maxRow : maxCol;

  const extraSize = 16; // px (ancho de columna en desktop / alto de fila en mobile)

  return (
    <div className="w-full flex items-center justify-start bg-[#818181]/15 rounded-[55px] overflow-hidden">
      <div
        className="overflow-auto grid gap-3 p-6"
        style={{
          gridTemplateColumns: isMobile
            ? `repeat(${rows}, minmax(200px, 1fr))`
            : `${extraSize}px repeat(${cols}, minmax(200px, 1fr))`,

          gridTemplateRows: isMobile
            ? `${extraSize}px repeat(${cols}, minmax(85px, 1fr))`
            : `repeat(${rows}, minmax(85px, 1fr))`,
        }}
      >
        {!isMobile && (
          <div
            style={{
              gridColumn: 1,
              gridRow: `1 / span ${rows}`,
            }}
            className="flex flex-col items-center justify-between"
          >
            {Array.from({ length: rows }, (_, i) => (
              <div key={i} className="flex flex-col items-center justify-center h-full  w-full text-xs opacity-70 leading-none">
                {i + 1}
              </div>
            ))}
          </div>
        )}

        {isMobile &&
          Array.from({ length: cols }, (_, i) => (
            <div
              key={`h-${i}`}
              style={{ gridRow: 1, gridColumn: i + 1 }}
              className="flex flex-col items-center justify-center h-full  w-full text-xs opacity-70 leading-none"
            >
              {i + 1}
            </div>
          ))}

        {courses.map((c) => {
          const r = c.grid.row ?? 1;
          const col = c.grid.col ?? 1;

          if (isMobile) {
            const gridRow = col + 1;
            const gridColumn = r;

            return (
              <div key={c.id} style={{ gridRow, gridColumn }}>
                <SubjectButton c={c} />
              </div>
            );
          }

          const gridRow = r;
          const gridColumn = col + 1;

          return (
            <div key={c.id} style={{ gridRow, gridColumn }}>
              <SubjectButton c={c} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
