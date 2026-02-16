export default function unitClassHover(unit: "BASICO" | "PROFESIONAL" | "INTEGRACION" | "CPI") {
  switch (unit) {
    case "BASICO":
      return "hover:";

    case "PROFESIONAL":
      return "hover:";

    case "INTEGRACION":
      return "hover:";

    case "CPI":
      return "hover:";
      
    default:
      return "hover:";
  }
}