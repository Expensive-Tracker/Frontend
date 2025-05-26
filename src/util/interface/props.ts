import React, { InputHTMLAttributes } from "react";

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
  labelStyle: string;
  errorMessage: string;
  register?: any;
}

export interface navItemInterface {
  id: number;
  navName: string;
  path: string;
  icon: React.ReactNode;
}

export interface buttonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export interface modalProps {
  id: "add" | "edit" | "delete" | string;
  transactionId: string | number;
}
