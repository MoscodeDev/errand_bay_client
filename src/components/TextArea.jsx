import React from 'react'

const TextArea = ({ inputDetails }) => {
  return (
    <div className="flex flex-col gap-1 md:gap-2 p-2">
  <label className="text-blue-700 text-lg font-sans">{inputDetails.label||""}</label>
  <textarea
    name={inputDetails.name}
    value={inputDetails.itemDescription}
    onChange={inputDetails.handleChange}
    placeholder={inputDetails.placeholder || " Type here..."}
    rows="1"
    className="border-2 border-t-0 border-r-0 border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
  ></textarea>
</div>
  )
}

export default TextArea