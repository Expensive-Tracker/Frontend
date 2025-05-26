import { RootState } from "@/store/store";
import { buttonProps } from "@/util/interface/props";
import React from "react";
import { useSelector } from "react-redux";

const Button = ({ children, className, ...rest }: buttonProps) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const hover =
    theme === "dark"
      ? "hover:text-white hover:bg-black border border-white/20"
      : "hover:bg-[#27282E] border border-[#1B1C21] hover:text-white";
  return (
    <button
      className={`px-2.5 py-1.5 cursor-pointer transition-all rounded-md ${hover} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
