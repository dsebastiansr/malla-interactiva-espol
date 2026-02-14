import type { Course } from '../lib/meshApi';
import unitClass from '../utils/unitClass';
import { useMesh } from '../context/MeshContext';

export default function SubjectButton({ c }: { c: Course }) {
  const { passed, togglePassed } = useMesh();
  const isPassed = !!passed[c.id];

  const base =
    'relative overflow-hidden rounded-full py-1 px-4 h-full w-full border-3 text-balance font-semibold transition-all cursor-pointer flex items-center justify-center text-center text-[13px]';

  return (
    <button
      onClick={() => togglePassed(c.id)}
      className={`
          ${base}
          ${unitClass(c.unit)}
        `}
      title={c.code ?? 'CPI'}
    >
      <h2 className="px-3">{c.name}</h2>

      <div
        className={`${isPassed ? 'w-full h-2.5 -rotate-14 bg-[#FD4447] absolute' : 'hidden'}`}
      />
    </button>
  );
}
