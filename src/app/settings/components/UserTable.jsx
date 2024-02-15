import TableLayout from "@/components/table/TableLayout";
import { MdEdit, MdDelete } from "react-icons/md";
import LayoutModal from "@/components/modal/LayoutModal";
import IconButton from "@/app/devops/forms/components/IconButton";
import ModalFormUser from "./ModalFormUser";
import Button from "./Button";

const UserTable = ({ data, getData, handleDelete }) => {
  const columns = [
    { accessorKey: "user_name", header: "Nombre" },
    { accessorKey: "email", header: "Correo" },
    { accessorKey: "pais", header: "País" },
    { accessorKey: "rol", header: "Rol" },
    {
      accessorKey: "id",
      header: "Opciones",
      cell: (row) => {
        return (
          <div className="w-full flex flex-row justify-center items-center gap-4">
            <LayoutModal button={IconButton} icon={MdEdit}>
              <ModalFormUser
                user={row?.row?.original}
                getData={getData}
                type={"update"}
              />
            </LayoutModal>
            <IconButton
              icon={MdDelete}
              danger={true}
              onClick={() => handleDelete(row?.row?.original?.id)}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className=" w-full flex flex-col gap-5 justify-start">
      <LayoutModal button={Button} label={"+ Nuevo Usuario"}>
        <ModalFormUser user={[]} getData={getData} type={"new"} />
      </LayoutModal>
      <TableLayout columns={columns} data={data} />
    </div>
  );
};

export default UserTable;
