import type { Course } from './meshApi';

import type { Req } from "./meshApi"; // ajusta si tu type está en otro lado

export function buildDependentsGraph(courses: Course[]) {
  // prereqCode -> set of courseIds that depend on it
  const dep = new Map<string, Set<string>>();

  for (const c of courses) {
    for (const r of c.requirements ?? []) {
      if (r.type !== "PRE-REQUISITO") continue;
      const code = r.code;
      if (!code) continue;
      if (!dep.has(code)) dep.set(code, new Set());
      dep.get(code)!.add(c.id);
    }
  }

  return dep;
}

export function courseIdByCode(courses: Course[]) {
  const map = new Map<string, string>();
  for (const c of courses) {
    if (c.code) map.set(c.code, c.id);
  }
  return map;
}

export type CourseStatus = 'AP' | 'AV' | 'BL'

export type RulesContext = {
  courses: Course[];
  passed: Record<string, CourseStatus>;
}

export type CourseEval = {
  status: CourseStatus;
  missingPrereqs: string[];
  needsApprovedCount: number | null;
  approvedCount: number;
};

export function buildRulesContext(input: RulesContext) {
  const byCode = new Map<string, Course>();
  for (const c of input.courses) {
    if (c.code) byCode.set(c.code, c);
  }

  // set de IDs aprobados
  const passedIds = new Set<string>();
  for (const [id, ok] of Object.entries(input.passed)) {
    if (ok) passedIds.add(id);
  }

  // set de CÓDIGOS aprobados (para prereqs)
  const passedCodes = new Set<string>();
  for (const c of input.courses) {
    if (c.code && passedIds.has(c.id)) passedCodes.add(c.code);
  }

  // cuántas materias aprobadas (para approved_count_requirement)
  // Cuenta cualquier materia (incluye CPI), siempre que exista en la malla
  const validIds = new Set(input.courses.map((c) => c.id));
  let approvedCount = 0;
  for (const id of passedIds) {
    if (validIds.has(id)) approvedCount += 1;
  }

  return { byCode, passedIds, passedCodes, approvedCount };
}

function prereqCodes(course: Course): string[] {
  // solo PRE-REQUISITO por ahora
  return (course.requirements ?? [])
    .filter((r) => r.type === "PRE-REQUISITO")
    .map((r) => r.code)
    .filter(Boolean);
}

export function cascadeUnpass(
  courses: Course[],
  passed: Record<string, boolean>,
  startId: string
): Record<string, boolean> {
  const next = { ...passed };
  next[startId] = false;

  const dep = buildDependentsGraph(courses);
  const idByCode = courseIdByCode(courses);

  // encontrar el código de la materia desmarcada
  const startCourse = courses.find((c) => c.id === startId);
  const startCode = startCourse?.code;
  if (!startCode) return next;

  const queue: string[] = [startCode];
  const seenCodes = new Set<string>();

  while (queue.length) {
    const prereqCode = queue.shift()!;
    if (seenCodes.has(prereqCode)) continue;
    seenCodes.add(prereqCode);

    const dependents = dep.get(prereqCode);
    if (!dependents) continue;

    for (const depId of dependents) {
      if (next[depId]) {
        next[depId] = false;

        // si ese dependiente tiene código, también apaga sus dependientes
        const depCourse = courses.find((c) => c.id === depId);
        if (depCourse?.code) queue.push(depCourse.code);
      }
    }
  }

  return next;
}

export function evalCourse(course: Course, ctx: ReturnType<typeof buildRulesContext>): CourseEval {
  // ya aprobada
  if (ctx.passedIds.has(course.id)) {
    return {
      status: "AP",
      missingPrereqs: [],
      needsApprovedCount: course.approved_count_requirement ?? null,
      approvedCount: ctx.approvedCount,
    };
  }

  // CPI (bloques) -> disponible por defecto
  if (!course.code || course.unit === "CPI") {
    // si alguna CPI tuviera approved_count_requirement, la respetamos igual
    const need = course.approved_count_requirement ?? null;
    if (need != null && ctx.approvedCount < need) {
      return {
        status: "BL",
        missingPrereqs: [],
        needsApprovedCount: need,
        approvedCount: ctx.approvedCount,
      };
    }

    return {
      status: "AV",
      missingPrereqs: [],
      needsApprovedCount: need,
      approvedCount: ctx.approvedCount,
    };
  }

  // requisito por cantidad aprobadas
  const needApproved = course.approved_count_requirement ?? null;
  const countBL = needApproved != null && ctx.approvedCount < needApproved;

  // prereqs por código
  const prereqs = prereqCodes(course);
  const missing = prereqs.filter((code) => !ctx.passedCodes.has(code));

  if (countBL || missing.length > 0) {
    return {
      status: "BL",
      missingPrereqs: missing,
      needsApprovedCount: needApproved,
      approvedCount: ctx.approvedCount,
    };
  }

  return {
    status: "AV",
    missingPrereqs: [],
    needsApprovedCount: needApproved,
    approvedCount: ctx.approvedCount,
  };
}

export function canTake(course: Course, ctx: ReturnType<typeof buildRulesContext>): boolean {
  return evalCourse(course, ctx).status === "AV";
}