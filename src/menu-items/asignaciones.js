import { IconHelmet, IconMotorbike, IconClipboardList } from "@tabler/icons";

const asignaciones = {
  id: "asignaciones",
  title: "Asignaciones",
  type: "group",
  children: [
    {
      id: "asignaciones-op",
      title: "Asignaciones",
      type: "collapse",
      icon: IconClipboardList,
      children: [
        {
          id: "asignar-reparto",
          title: "Asignar a reparto",
          type: "item",
          url: "/asignaciones/reparto",
          icon: IconHelmet,
        },
        {
          id: "lista-asignaciones",
          title: "Asignaciones",
          type: "item",
          url: "/asignaciones/lista",
          icon: IconMotorbike,
        },
        {
          id: "recojos-asignaciones",
          title: "Recojos",
          type: "item",
          url: "/asignaciones/recojos",
          icon: IconClipboardList,
        },
      ],
    },
  ],
};

export default asignaciones;
