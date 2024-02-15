import clsx from "clsx";

const IconButton = ({ icon: Icon, onClick, danger }) => {
  return (
    <button
      type="button"
      data-te-ripple-init
      data-te-ripple-color="light"
      className={clsx(
        "mb-2 inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out bg-amber-400 hover:shadow-lg hover:bg-amber-500 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg",
        danger && "bg-red-400 hover:bg-red-500"
      )}
      onClick={onClick}
    >
      <Icon size="1.3em" />
    </button>
  );
};

export default IconButton;
