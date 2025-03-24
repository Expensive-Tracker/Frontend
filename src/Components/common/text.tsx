import { textInterface } from "@/util/interface/props";
import React from "react";

function Text({
  isDes = false,
  text = "",
  Element = "p",
  desClass = "text-sm md:text-base",
  textClass = "text-xl sm:text-2xl",
}: Partial<textInterface>) {
  return React.createElement(
    Element,
    {
      className: isDes ? desClass : textClass,
    },
    text
  );
}

export default Text;
