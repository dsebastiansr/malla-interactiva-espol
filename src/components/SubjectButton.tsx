import type { Course } from '../lib/meshApi';
import unitClass from '../utils/unitClass';
import { useMesh } from '../context/MeshContext';
import { buildRulesContext, evalCourse } from "../lib/rules";


export default function SubjectButton({ c }: { c: Course }) {
  
  const { courses, passed, togglePassed } = useMesh();
  const rulesCtx = buildRulesContext({ courses: courses ?? [], passed });
  const info = evalCourse(c, rulesCtx);
  const missingNames = info.missingPrereqs
    .map((code) => rulesCtx.byCode.get(code)?.name ?? code);

  const disabled = info.status === "BL";
  const isPassed = info.status === "AP";

  const base =
    'relative overflow-hidden rounded-full py-1 px-4 h-full w-full border-2 text-balance font-semibold transition-all flex flex-col items-center justify-center text-center text-[12px] text-balance';

  return (
    <button
      disabled={disabled}
      onClick={() => togglePassed(c.id)}
      className={`
        ${base}
        ${unitClass(c.unit)}
        ${disabled ? 'opacity-25' : 'cursor-pointer'}
      `}
      title={
        disabled
          ? `Requisito(s): ${missingNames.join(", ")}${
              info.needsApprovedCount
                ? ` requiere ${info.needsApprovedCount} aprobadas`
                : ''
            }`
          : c.name
      }
    >
      <h2 className="px-3">{c.name}</h2>
      <span className='text-[10px]'>
        Creditos: {
          c.name.includes('PREPROFESIONALES')
          ? c.credits
          : c.credits != null ? c.credits / 3 : "-"
        }
      </span>
      <div
        className={`${isPassed ? 'w-full h-2 -rotate-14 bg-[#eb3235] absolute' : 'hidden'}`}
      />
    </button>
  );
}
