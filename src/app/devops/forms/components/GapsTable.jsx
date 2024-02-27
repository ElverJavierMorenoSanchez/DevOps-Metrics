import LayoutModal from "@/components/modal/LayoutModal";
import TableLayout from "@/components/table/TableLayout";
import IconButton from "./IconButton";
import { MdEdit } from "react-icons/md";
import ModalFormGaps from "./ModalFormGaps";

const GapsTable = ({ data, getData }) => {
  const columns = [
    { accessorKey: "pais", header: "País" },
    { accessorKey: "mes", header: "Mes" },
    { accessorKey: "nombre_item_medir", header: "Item" },
    { accessorKey: "valor_medicion", header: "Valor Medición" },
    { accessorKey: "valor_meta", header: "Valor Meta" },
    {
      accessorKey: "avance_real",
      header: "%avance Real del plan de desarrolloValor Medición",
      cell: (row) => row?.row?.original.avance_real * 100 + "%",
    },
    {
      accessorKey: "avance_estimado",
      header: "%avance Estimado del plan de desarrollo",
      cell: (row) => row?.row?.original.avance_estimado * 100 + "%",
    },

    {
      accessorKey: "",
      header: "Opciones",
      cell: (row) => {
        if (row?.row?.original.nombre_item_medir === "Frecuencia de Liberación")
          return <></>;

        return (
          <LayoutModal button={IconButton} icon={MdEdit}>
            <ModalFormGaps metric={row?.row?.original} getData={getData} />
          </LayoutModal>
        );
      },
    },
  ];
  return (
    <>
      <TableLayout columns={columns} data={data} />
    </>
  );
};

export default GapsTable;
