import { textInterface } from "@/util/interface/props";
import React from "react";

function Text({
  isDes = true,
  text = "",
  Element = "p",
  style = "",
}: Partial<textInterface>) {
  const desClass = "text-sm md:text-base";
  const textClass = "text-xl lg:text-2xl";
  return React.createElement(
    Element,
    {
      className: isDes ? `${desClass} ${style}` : `${textClass} ${style}`,
    },
    text
  );
}

export default Text;
