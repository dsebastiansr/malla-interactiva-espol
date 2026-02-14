export default function unitClass(unit: "BASICO" | "PROFESIONAL" | "INTEGRACION" | "CPI") {
  switch (unit) {
    case "BASICO":
      return "bg-basic-bg border-basic-stroke text-basic-text";

    case "PROFESIONAL":
      return "bg-professional-bg border-professional-stroke text-professional-text";

    case "INTEGRACION":
      return "bg-integrative-bg border-integrative-stroke text-integrative-text";

    case "CPI":
      return "bg-cpi-bg border-cpi-stroke text-cpi-text";
      
    default:
      return "bg-slate-50 border-slate-200 text-slate-950";
  }
}