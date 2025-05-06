import { InputHTMLAttributes } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface textInterface {
  isDes: boolean;
  text: string;
  style: string;
  Element: string;
}

export interface inputInterface extends InputHTMLAttributes<HTMLInputElement> {
  inputStyle: string;
  labelText: string;
  type: string;
  divStyle: string;
  name: string;
  placeHolder: string;
  isPass: boolean;
  errorMessage: string;
  register?: any;
}
