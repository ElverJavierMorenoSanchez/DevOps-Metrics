import Input from "./Input";

const InputForm = ({ id, placeholder, label, register, erros }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <label
        forhtml={id}
        className="flex items-center justify-end w-40 h-full text-end text-md font-semibold text-gray-900 "
      >
        {label}
      </label>
      <Input
        id={id}
        placeholder={placeholder}
        register={register}
        erros={erros}
      />
    </div>
  );
};

export default InputForm;
