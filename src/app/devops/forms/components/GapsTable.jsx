import LayoutModal from "@/components/modal/LayoutModal";
import TableLayout from "@/components/table/TableLayout";
import IconButton from "./IconButton";
import { MdEdit } from "react-icons/md";
import ModalFormGaps from "./ModalFormGaps";

const GapsTable = ({ data, getData }) => {
  const columns = [
    { accessorKey: "pais", header: "País" },
    { accessorKey: "mes", header: "Mes" },
    { accessorKey: "nombreItemMedir", header: "Item" },
    { accessorKey: "valorMedicion", header: "Valor Medición" },
    { accessorKey: "valorMeta", header: "Valor Meta" },
    {
      accessorKey: "avanceReal",
      header: "%avance Real del plan de desarrolloValor Medición",
    },
    {
      accessorKey: "avanceEstimado",
      header: "%avance Estimado del plan de desarrollo",
    },

    {
      accessorKey: "",
      header: "Opciones",
      cell: (row) => {
        if (row?.row?.original.nombreItemMedir === "Frecuencia de Liberación")
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
