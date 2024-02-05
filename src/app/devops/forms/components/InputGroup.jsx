import Input from "./Input";

const InputGroup = ({ id, label, register, errors, values = [] }) => {
  return (
    <div className="w-full flex flex-row gap-4 items-center">
      <label htmlFor="" className="w-1/3 text-end font-semibold">
        {label}
      </label>
      <div className="w-full flex flex-row gap-4">
        <Input
          id={`${id}1`}
          placeholder="0"
          register={register}
          errors={errors}
          value={values[0]}
        />
        <Input
          id={`${id}2`}
          placeholder="0"
          register={register}
          errors={errors}
          value={values[1]}
        />
        <Input
          id={`${id}3`}
          placeholder="0"
          register={register}
          errors={errors}
          value={values[2]}
        />
        <Input
          id={`${id}4`}
          placeholder="0"
          register={register}
          errors={errors}
          value={values[3]}
        />
      </div>
    </div>
  );
};

export default InputGroup;
