import React from "react";

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
  const getColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const textColot = () => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-green-500";
  };
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">
            ${spent} / ${total}
          </span>
        </div>
      )}
      <div
        className={`w-full h-2 ${getColor().replace(
          "500",
          "100"
        )} rounded-full overflow-hidden`}
      >
        <div
          className={`h-2 ${getColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className={`flex justify-between text-sm ${textColot()} mt-1`}>
        <span>{percentage}%</span>
        <span>{100 - percentage}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
