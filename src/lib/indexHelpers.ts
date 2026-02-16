import type { CareerIndexItem } from "./meshApi";

export function listFaculties(index: CareerIndexItem[]) {
  return Array.from(new Set(index.map((x) => x.faculty))).sort();
}

export function careersByFaculty(index: CareerIndexItem[], faculty: string) {
  return index
    .filter((x) => x.faculty === faculty)
    .sort((a, b) => a.name.localeCompare(b.name));
}