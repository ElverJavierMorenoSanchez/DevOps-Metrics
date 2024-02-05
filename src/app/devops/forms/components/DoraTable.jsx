import TableLayout from "@/components/table/TableLayout";
import IconButton from "./IconButton";
import { MdEdit } from "react-icons/md";
import LayoutModal from "@/components/modal/LayoutModal";
import ModalFormDora from "./ModalFormDora";

const DoraTable = ({ data, getData }) => {
  const columns = [
    { accessorKey: "pais", header: "País" },
    { accessorKey: "mes", header: "Mes" },
    { accessorKey: "nombreItemMedir", header: "Item" },
    { accessorKey: "valorMedicion", header: "Valor Medición" },
    {
      accessorKey: "valorMedicionPorcentual",
      header: "Valor Medicion %",
    },
    {
      accessorKey: "id",
      header: "Opciones",
      cell: (row) => {
        if (row?.row?.original.nombreItemMedir === "Frecuencia de Liberación")
          return <></>;

        return (
          <LayoutModal button={IconButton} icon={MdEdit}>
            <ModalFormDora metric={row?.row?.original} getData={getData} />
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

export default DoraTable;
