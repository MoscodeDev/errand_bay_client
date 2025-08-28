import React from 'react'
import { Eye, EyeOff } from "lucide-react";

const PasswordField = ({ inputDetails }) => {

    const [isvisible, setVisible] = React.useState(false);

  return (
    <div className="flex flex-col gap-1 md:gap-2 p-2 relative">
      <label className="text-blue-700 text-lg font-sans ">{inputDetails.label || ""}</label>
      <input
      className="border-2 border-t-0 border-r-0 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500 "
        type={isvisible ? "text" : "password"}
        name={inputDetails.name}
        onChange={inputDetails.handleChange}
        value={inputDetails.value}
      />
      <div className='absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer' onClick={() => setVisible(!isvisible)}>
        {!isvisible ? <Eye /> : <EyeOff />}
      </div>
    </div>
  );
};

export default PasswordField