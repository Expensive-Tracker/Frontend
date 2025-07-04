import { SummaryCardsProps } from "@/util/interface/props";
import React from "react";
import { FaWallet } from "react-icons/fa";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  theme,
  balance,
}) => {
  const cardBg =
    theme === "dark" ? "bg-[#27282E]/20" : "bg-white border-gray-200";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const incomeColor = theme === "dark" ? "text-green-400" : "text-green-600";
  const expenseColor = theme === "dark" ? "text-red-400" : "text-red-600";
  const balanceColor =
    balance >= 0
      ? theme === "dark"
        ? "text-blue-400"
        : "text-blue-600"
      : theme === "dark"
      ? "text-red-400"
      : "text-red-600";

  const incomeIconBg = theme === "dark" ? "bg-green-500/20" : "bg-green-100";
  const expenseIconBg = theme === "dark" ? "bg-red-500/20" : "bg-red-100";
  const balanceIconBg =
    balance >= 0
      ? theme === "dark"
        ? "bg-blue-500/20"
        : "bg-blue-100"
      : theme === "dark"
      ? "bg-red-500/20"
      : "bg-red-100";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Math.abs(amount));
  };

  const cards = [
    {
      title: "Total Income",
      value: totalIncome || 0,
      icon: IoIosArrowRoundUp,
      iconBg: incomeIconBg,
      iconColor: incomeColor,
      valueColor: incomeColor,
    },
    {
      title: "Total Expenses",
      value: totalExpenses || 0,
      icon: IoIosArrowRoundDown,
      iconBg: expenseIconBg,
      iconColor: expenseColor,
      valueColor: expenseColor,
    },
    {
      title: "Current Balance",
      value: balance || 0,
      icon: FaWallet,
      iconBg: balanceIconBg,
      iconColor: balanceColor,
      valueColor: balanceColor,
    },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center flex-wrap  gap-4 ">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`p-6 rounded-xl flex-1 w-full border ${cardBg} transition-all duration-200 shadow-lg`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${card.iconBg}`}>
                <IconComponent className={`w-5 h-5 ${card.iconColor}`} />
              </div>
            </div>

            <div>
              <p className={`text-sm font-medium mb-1 ${textSecondary}`}>
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.valueColor}`}>
                {card.title === "Current Balance" && card.value < 0 ? "-" : ""}
                {formatCurrency(card.value)}
              </p>
            </div>

            <div className="mt-3">
              <p className={`text-xs ${textSecondary}`}>
                {card.title === "Total Income" && "Money received"}
                {card.title === "Total Expenses" && "Money spent"}
                {card.title === "Current Balance" &&
                  (card.value >= 0 ? "Available funds" : "Deficit amount")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
