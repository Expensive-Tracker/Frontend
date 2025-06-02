import React from "react";
import ProgressBar from "../progressBar/progressBar";

const SubCategory = () => {
  const data = {
    categoryName: "Product Designer",
    subBudgetAmount: 520000,
    budgetTransaction: {
      totalSpent: 312000,
      totalRemain: 208000,
    },
  };

  const { categoryName, subBudgetAmount, budgetTransaction } = data;
  const { totalSpent, totalRemain } = budgetTransaction;
  const percentage = Math.round((totalSpent / subBudgetAmount) * 100);

  return (
    <div className="max-w-xl w-full bg-white shadow rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          ${subBudgetAmount.toLocaleString()}
        </h2>
        <p className="text-gray-600">{categoryName}</p>
      </div>

      {/* Progress */}
      <ProgressBar
        percentage={percentage}
        spent={totalSpent}
        total={subBudgetAmount}
      />

      {/* Info */}
      <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700">
        <div className="text-gray-500">Total Amount</div>
        <div className="text-right">${totalRemain.toLocaleString()}</div>

        <div className="text-gray-500">Start Date</div>
        <div className="text-right">May 31, 2024</div>

        <div className="text-gray-500">End Date</div>
        <div className="text-right">December 31, 2024</div>
      </div>
    </div>
  );
};

export default SubCategory;
