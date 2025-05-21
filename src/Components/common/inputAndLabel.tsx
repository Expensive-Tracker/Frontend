"use client";
import { RootState } from "@/store/store";
import { inputInterface } from "@/util/interface/props";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";

function InputAndLabel({
  isPass = false,
  divStyle = "",
  inputStyle = "",
  labelText,
  name,
  type,
  placeHolder,
  register,
  errorMessage,
  ...rest
}: Partial<inputInterface>) {
  const [showPass, setShowPass] = useState<boolean>(false);
  const commonInputStyle =
    "p-2.5 border-[#27282E] w-full border rounded-md focus:outline-none" +
    inputStyle;
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <div className={`flex gap-2 w-full flex-col ${divStyle}`}>
      <label className="capitalize text-sm" id={name}>
        {labelText}
      </label>
      {isPass ? (
        <div className={`${commonInputStyle} flex items-center`}>
          <input
            {...(register ? register(name || "") : {})}
            type={showPass ? "text" : "password"}
            placeholder={placeHolder}
            className={`w-full focus:outline-none ${
              theme === "dark"
                ? "text-white placeholder:text-white"
                : "text-black placeholder:text-black"
            }`}
            id={name}
            name={name}
            {...rest}
          />
          {showPass ? (
            <FaEyeSlash
              className="px-1 w-[10%] cursor-pointer"
              onClick={() => setShowPass(false)}
            />
          ) : (
            <FaEye
              className="px-1 w-[10%] cursor-pointer"
              onClick={() => setShowPass(true)}
            />
          )}
        </div>
      ) : (
        <input
          {...(register ? register(name || "") : {})}
          type={type}
          className={`${commonInputStyle} ${
            theme === "dark"
              ? "text-white placeholder:text-white"
              : "text-black placeholder:text-black"
          }`}
          placeholder={placeHolder}
          id={name}
          name={name}
          {...rest}
        />
      )}
      {errorMessage && <p className="text-red-400 text-base">{errorMessage}</p>}
    </div>
  );
}

export default InputAndLabel;
