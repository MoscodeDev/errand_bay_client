import React from "react";

const InputField = ({ inputDetails }) => {
  const hasDate = inputDetails.type === "date";
  return (
    <div className="flex flex-col gap-1 md:gap-2 p-2">
      <label className="text-blue-700 text-lg font-sans ">{inputDetails.label || ""}</label>
      <input
      className="border-2 border-t-0 border-r-0 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 "
        type={inputDetails.type || "text"}
        name={inputDetails.name}
        onChange={inputDetails.handleChange}
        value={inputDetails.value}
        { ...(hasDate && { min: new Date().toISOString().split("T")[0] })}
      />
    </div>
  );
};

export default InputField;
