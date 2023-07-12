// import { within } from "@testing-library/react";
import React, { useState } from "react";
import { Eye, EyeOff } from "react-feather";
function InputControl({ label, isPassword, ...props }) {
  const [isVisible, setisVisible] = useState(false);
  return (
    <div className="flex flex-col gap-[5px]">
      {label && (
        <label className="font-semibold text-[#252525] text-[0.9rem]">
          {label}
        </label>
      )}

      <div className="relative hover:text-[#5a5a5a]">
        <input
          type={isPassword ? (isVisible ? "text" : "password") : "text"}
          {...props}
          className="border-solid border-[1px] border-[#ddd] rounded-[5px] py-[8px] px-[10px] outline-none text-[1rem] transition-[200ms] hover:border-[1px] hover:border-solid hover:border-[#bbbbbb] focus:border-[1px] focus:border-solid focus:border-[#22c48b] pr-[30px] w-full"
        />
        {isPassword && (
          <div
          className="absolute right-[4px] top-1/2 -translate-y-1/2 flex justify-center items-center hover:text-[#22c48b]"
          style={{ height: "15px", width: "15px", color: "#bbb" }}
        >
          {isVisible ? (
            <EyeOff onClick={() => setisVisible((prev) => !prev)} />
          ) : (
            <Eye onClick={() => setisVisible((prev) => !prev)} />
          )}
        </div>
        )}
        
      </div>
    </div>
  );
}

export default InputControl;
