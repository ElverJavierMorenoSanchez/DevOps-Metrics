import TableLayout from "@/components/table/TableLayout";
import IconButton from "./IconButton";
import { MdEdit } from "react-icons/md";
import LayoutModal from "@/components/modal/LayoutModal";
import ModalFormDora from "./ModalFormDora";

const DoraTable = ({ data, getData }) => {
  const columns = [
    { accessorKey: "pais", header: "País" },
    { accessorKey: "mes", header: "Mes" },
    { accessorKey: "nombre_item_medir", header: "Item" },
    { accessorKey: "valor_medicion", header: "Valor Medición" },
    {
      accessorKey: "valor_medicion_porcentual",
      header: "Valor Medicion %",
      cell: (row) => row?.row?.original.valor_medicion_porcentual * 100 + "%",
    },
    {
      accessorKey: "id",
      header: "Opciones",
      cell: (row) => {
        if (row?.row?.original.nombre_item_medir === "Frecuencia de Liberación")
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
