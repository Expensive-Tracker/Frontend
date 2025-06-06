/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import ProgressBar from "../progressBar/progressBar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BsThreeDots } from "react-icons/bs";

const SubCategory = ({
  item,
  handleAddModelEditDetail,
  handleAddModelDeleteDetail,
}: {
  item: any;
  handleAddModelEditDetail: (id: string) => void;
  handleAddModelDeleteDetail: (id: string) => void;
}) => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const data = {
    categoryName: item?.categoryName,
    subBudgetAmount: item?.subBudgetAmount,
    budgetTransaction: {
      totalSpent: item?.budgetTransaction?.totalSpent,
      totalRemain: item?.budgetTransaction?.totalRemain,
    },
  };

  const { categoryName, subBudgetAmount, budgetTransaction } = data;
  const { totalSpent, totalRemain } = budgetTransaction;
  const percentage =
    totalSpent >= subBudgetAmount
      ? 100
      : Math.floor((totalSpent / subBudgetAmount) * 100);

  const bgColor = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const labelText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const gridText = theme === "dark" ? "text-gray-300" : "text-gray-700";

  return (
    <div
      className={`max-w-xl w-full ${bgColor} shadow rounded-2xl p-6 space-y-6 transition-colors duration-300`}
    >
      {/* Header */}
      <div className="flex items-center w-full justify-between">
        <h2 className={`text-2xl font-semibold ${textPrimary}`}>
          {categoryName}
        </h2>
        <div className="relative">
          <BsThreeDots
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowMenu((pre) => !pre)}
          />
          {showMenu && (
            <div className={`absolute p-4 ${bgColor} shadow-lg space-y-2 w-20`}>
              <button
                className="cursor-pointer"
                onClick={() => {
                  handleAddModelEditDetail(item?._id);
                  setShowMenu(false);
                }}
              >
                Edit
              </button>
              <button
                className="cursor-pointer"
                onClick={() => {
                  handleAddModelDeleteDetail(item?._id);
                  setShowMenu(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar
        percentage={percentage}
        spent={totalSpent}
        total={subBudgetAmount}
      />

      {/* Info Section */}
      <div className={`grid grid-cols-2 gap-y-3 text-sm ${gridText}`}>
        <div className={labelText}>Total Amount</div>
        <div className="text-right">₹{subBudgetAmount}</div>

        <div className={labelText}>Remaining Amount</div>
        <div className="text-right">₹{totalRemain}</div>

        <div className={labelText}>Amount spent</div>
        <div className="text-right">₹{totalSpent}</div>
      </div>
    </div>
  );
};

export default SubCategory;
