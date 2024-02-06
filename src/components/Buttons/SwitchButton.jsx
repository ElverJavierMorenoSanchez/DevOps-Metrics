const SwitchButton = ({ option1, option2, onChange, checked }) => {
  return (
    <div className="flex flex-row items-center gap-3">
      <label className="text" htmlFor="checkbox_toggle">
        {option1}
      </label>
      <input
        id="checkbox_toggle"
        type="checkbox"
        className="check"
        value={checked}
        onChange={onChange}
      />
      <div className="checkbox">
        <label className="slide" htmlFor="checkbox_toggle">
          <label className="toggle" htmlFor="checkbox_toggle"></label>
        </label>
      </div>

      <label className="text" htmlFor="checkbox_toggle">
        {option2}
      </label>
    </div>
  );
};

export default SwitchButton;
