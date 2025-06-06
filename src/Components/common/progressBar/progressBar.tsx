"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";

interface ProgressBarProps {
  label?: string;
  percentage: number;
  spent: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  percentage,
  spent,
  total,
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);

  const getColor = () => {
    if (percentage >= 90) return "red";
    if (percentage >= 60) return "yellow";
    return "green";
  };
  const color = getColor();

  const bgMap: Record<string, string> = {
    red: theme === "dark" ? "bg-red-600" : "bg-red-500",
    yellow: theme === "dark" ? "bg-yellow-600" : "bg-yellow-500",
    green: theme === "dark" ? "bg-green-600" : "bg-green-500",
  };

  const bgLightMap: Record<string, string> = {
    red: theme === "dark" ? "bg-red-900" : "bg-red-100",
    yellow: theme === "dark" ? "bg-yellow-900" : "bg-yellow-100",
    green: theme === "dark" ? "bg-green-900" : "bg-green-100",
  };

  const textMap: Record<string, string> = {
    red: theme === "dark" ? "text-red-300" : "text-red-500",
    yellow: theme === "dark" ? "text-yellow-300" : "text-yellow-500",
    green: theme === "dark" ? "text-green-300" : "text-green-500",
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {label}
          </span>
          <span
            className={`text-sm ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            ${spent.toLocaleString()} / ${total.toLocaleString()}
          </span>
        </div>
      )}
      <div
        className={`w-full h-2 ${bgLightMap[color]} rounded-full overflow-hidden`}
      >
        <motion.div
          className={`h-2 ${bgMap[color]} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>
      <div className={`flex justify-between text-sm mt-1 ${textMap[color]}`}>
        <span>{percentage}%</span>
        <span>{100 - percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
