/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import ProgressBar from "../progressBar/progressBar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { BsThreeDots } from "react-icons/bs";
import { FaRegEdit, FaChartLine } from "react-icons/fa";
import { MdDelete, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { BiWallet, BiMoney } from "react-icons/bi";

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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

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

  const colors = {
    bgColor: theme === "dark" ? "bg-zinc-900" : "bg-white",
    borderColor: theme === "dark" ? "border-zinc-700" : "border-gray-200",

    textPrimary: theme === "dark" ? "text-white" : "text-gray-900",
    textSecondary: theme === "dark" ? "text-gray-300" : "text-gray-600",
    textMuted: theme === "dark" ? "text-gray-400" : "text-gray-500",

    cardBg: theme === "dark" ? "bg-zinc-800" : "bg-gray-50",
    hoverBg: theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-gray-100",

    menuBg: theme === "dark" ? "bg-zinc-800" : "bg-white",
    menuShadow:
      theme === "dark"
        ? "shadow-2xl shadow-black/20"
        : "shadow-xl shadow-gray-300/20",

    success: {
      bg: theme === "dark" ? "bg-green-500/20" : "bg-green-100",
      text: theme === "dark" ? "text-green-400" : "text-green-600",
      icon: theme === "dark" ? "text-green-300" : "text-green-500",
    },
    warning: {
      bg: theme === "dark" ? "bg-yellow-500/20" : "bg-yellow-100",
      text: theme === "dark" ? "text-yellow-400" : "text-yellow-600",
      icon: theme === "dark" ? "text-yellow-300" : "text-yellow-500",
    },
    danger: {
      bg: theme === "dark" ? "bg-red-500/20" : "bg-red-100",
      text: theme === "dark" ? "text-red-400" : "text-red-600",
      icon: theme === "dark" ? "text-red-300" : "text-red-500",
    },
    info: {
      bg: theme === "dark" ? "bg-blue-500/20" : "bg-blue-100",
      text: theme === "dark" ? "text-blue-400" : "text-blue-600",
      icon: theme === "dark" ? "text-blue-300" : "text-blue-500",
    },
  };

  const getStatusConfig = () => {
    if (percentage >= 90)
      return { color: colors.danger, label: "Critical", icon: MdTrendingDown };
    if (percentage >= 75)
      return { color: colors.warning, label: "High", icon: MdTrendingUp };
    if (percentage >= 50)
      return { color: colors.info, label: "Moderate", icon: FaChartLine };
    return { color: colors.success, label: "Good", icon: MdTrendingUp };
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`w-full ${colors.bgColor} ${colors.borderColor} border shadow-lg rounded-2xl p-6 space-y-6 transition-all duration-300 hover:shadow-xl`}
    >
      {/* Header with enhanced styling */}
      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${statusConfig.color.bg}`}>
            <BiWallet className={`w-5 h-5 ${statusConfig.color.icon}`} />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${colors.textPrimary}`}>
              {categoryName}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusIcon className={`w-3 h-3 ${statusConfig.color.icon}`} />
              <span
                className={`text-xs font-medium ${statusConfig.color.text}`}
              >
                {statusConfig.label} Usage
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            className={`p-2 rounded-lg transition-colors duration-200 ${colors.hoverBg}`}
            onClick={() => setShowMenu((pre) => !pre)}
          >
            <BsThreeDots className={`w-4 h-4 ${colors.textSecondary}`} />
          </button>

          <div
            ref={menuRef}
            className={`absolute right-0 top-12 ${colors.menuBg} ${
              colors.menuShadow
            } rounded-lg overflow-hidden z-10 min-w-[120px] transition-all duration-300 ease-in-out transform ${
              showMenu
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <button
              className={`w-full px-4 py-3 flex items-center gap-3 ${colors.textSecondary} ${colors.hoverBg} transition-colors duration-200`}
              onClick={() => {
                handleAddModelEditDetail(item?._id);
                setShowMenu(false);
              }}
            >
              <FaRegEdit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <div
              className={`h-px ${colors.borderColor} bg-current opacity-10`}
            ></div>
            <button
              className={`w-full px-4 py-3 flex items-center gap-3 ${colors.danger.text} ${colors.hoverBg} transition-colors duration-200`}
              onClick={() => {
                handleAddModelDeleteDetail(item?._id);
                setShowMenu(false);
              }}
            >
              <MdDelete className="w-4 h-4" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${colors.textSecondary}`}>
            Progress
          </span>
          <span className={`text-sm font-bold ${statusConfig.color.text}`}>
            {percentage}%
          </span>
        </div>
        <ProgressBar
          percentage={percentage}
          spent={totalSpent}
          total={subBudgetAmount}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div
          className={`${
            colors.cardBg
          } rounded-xl  p-4 border-l-4 flex-auto ${colors.info.text.replace(
            "text-",
            "border-l-"
          )}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <BiMoney className={`w-4 h-4 ${colors.info.icon}`} />
            <span className={`text-xs font-medium ${colors.textMuted}`}>
              Total Budget
            </span>
          </div>
          <p className={`text-lg font-bold ${colors.info.text}`}>
            ₹{subBudgetAmount?.toLocaleString()}
          </p>
        </div>

        <div
          className={`${colors.cardBg} flex-auto rounded-xl p-4 border-l-4 ${
            totalRemain >= 0 ? "border-l-green-500" : "border-l-red-500"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 flex-auto">
            <MdTrendingUp
              className={`w-4 h-4 ${
                totalRemain >= 0 ? colors.success.icon : colors.danger.icon
              }`}
            />
            <span className={`text-xs font-medium ${colors.textMuted}`}>
              Remaining
            </span>
          </div>
          <p
            className={`text-lg font-bold ${
              totalRemain >= 0 ? colors.success.text : colors.danger.text
            }`}
          >
            ₹{Math.abs(totalRemain)?.toLocaleString()}
          </p>
          {totalRemain < 0 && (
            <span className={`text-xs ${colors.danger.text}`}>Over budget</span>
          )}
        </div>

        <div
          className={`${
            colors.cardBg
          } rounded-xl p-4 border-l-4 flex-auto ${statusConfig.color.text.replace(
            "text-",
            "border-l-"
          )}`}
        >
          <div className="flex items-center gap-2 mb-2 flex-auto">
            <StatusIcon className={`w-4 h-4 ${statusConfig.color.icon}`} />
            <span className={`text-xs font-medium ${colors.textMuted}`}>
              Amount Spent
            </span>
          </div>
          <p className={`text-lg font-bold ${statusConfig.color.text}`}>
            ₹{totalSpent?.toLocaleString()}
          </p>
        </div>
      </div>

      <div
        className={`flex items-center justify-between p-3 rounded-lg ${colors.cardBg}`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              percentage >= 90
                ? "bg-red-500"
                : percentage >= 75
                ? "bg-yellow-500"
                : percentage >= 50
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
          ></div>
          <span className={`text-sm font-medium ${colors.textSecondary}`}>
            Budget Health
          </span>
        </div>
        <span className={`text-sm font-bold ${statusConfig.color.text}`}>
          {statusConfig.label}
        </span>
      </div>
    </div>
  );
};

export default SubCategory;
