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
  transactionId: string;
}

type ChartType =
  | "line"
  | "area"
  | "bar"
  | "pie"
  | "donut"
  | "radialBar"
  | "scatter"
  | "bubble"
  | "heatmap"
  | "candlestick"
  | "boxPlot"
  | "radar"
  | "polarArea"
  | "rangeBar"
  | "rangeArea"
  | "treemap";

export interface DynamicChartProps {
  type?: ChartType;
  series?: any[];
  width?: string | number;
  height?: string | number;
  title?: string;
  subtitle?: string;
  colors?: string[];
  options?: any;
  onDataPointSelection?: (event: any, chartContext: any, config: any) => void;
  className?: string;
}

export interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  theme: "dark" | "light";
}
