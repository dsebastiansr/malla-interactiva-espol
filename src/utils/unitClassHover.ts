export default function unitClassHover(unit: "BASICO" | "PROFESIONAL" | "INTEGRACION" | "CPI") {
  switch (unit) {
    case "BASICO":
      return "hover:shadow-[0px_0px_9px_0px_rgba(199,199,199,_0.25)]";
      
      case "PROFESIONAL":
      return "hover:shadow-[0px_0px_9px_0px_rgba(82,_147,_244,_0.25)]";

    case "INTEGRACION":
      return "hover:shadow-[0px_0px_9px_0px_rgba(80,_255,_153,_0.25)]";

    case "CPI":
      return "hover:shadow-[0px_0px_9px_0px_rgba(240,159,_88,_0.25)]";
      
    default:
      return "hover:shadow-[0px_0px_15px_0px_rgba(82,_147,_244,_0.5)]";
  }
}