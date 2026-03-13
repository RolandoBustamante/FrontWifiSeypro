import { IconArrowsTransferUp } from "@tabler/icons";

const movimientos = {
  id: "movimientos",
  title: "Movimientos",
  type: "group",
  children: [
    {
      id: "movimientos-router",
      title: "Traslado / Historial",
      type: "item",
      url: "/asignaciones/movimientos",
      icon: IconArrowsTransferUp,
      breadcrumbs: false,
    },
  ],
};

export default movimientos;

