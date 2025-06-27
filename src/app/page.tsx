/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DynamicChart from "@/components/common/chart";
import ChartSkeleton from "@/components/common/skeletion/chartSkeletion";
import SummaryCardSkeleton from "@/components/common/skeletion/summryCardSkeletion";
import TableSkeleton from "@/components/common/skeletion/tableSkeletion";
import SummaryCards from "@/components/common/summaryCard";
import { RootState } from "@/store/store";
import {
  handleGetSummary,
  handleGetCategoryBreakDown,
} from "@/util/api/apis/analytics";
import { handleGetTransaction } from "@/util/api/apis/transaction";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlus, FaWallet } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function Home() {
  const isNew = useSelector((state: RootState) => state.user.isNew.remain);
  const userId = useSelector((state: RootState) => state.user.userDetail._id);
  const theme = useSelector((state: RootState) => state.theme.theme);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    summary: {
      balance: 0,
      totalExpenses: 0,
      totalIncome: 0,
    },
    pieData: [
      { name: "Income", value: 0 },
      { name: "Expenses", value: 0 },
    ],
    transactionData: [],
    categoryData: [],
  });

  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const hover =
    theme === "dark"
      ? "hover:text-white hover:bg-black border border-white/20"
      : "hover:bg-[#27282E] border border-[#1B1C21] hover:text-white";

  useEffect(() => {
    Promise.all([
      handleGetSummaryData(),
      handleGetSomeTransaction(),
      handleGetCategoryData(),
    ]).finally(() => setLoading(false));
  }, []);

  async function handleGetCategoryData() {
    try {
      const result: any = await handleGetCategoryBreakDown();
      if (result?.labels && result?.series) {
        const categoryData = result.labels.map(
          (label: string, index: number) => ({
            name: label,
            amount: result.series[index] ?? 0,
          })
        );

        setData((prev) => ({ ...prev, categoryData }));
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  async function handleGetSummaryData() {
    try {
      const result: any = await handleGetSummary();
      if (result) {
        setData((pre) => ({
          ...pre,
          summary: {
            balance: result?.data?.balance,
            totalExpenses: result?.data?.totalExpenses,
            totalIncome: result?.data?.totalIncome,
          },
          pieData: [
            { name: pre.pieData[0].name, value: result?.data?.totalIncome },
            { name: pre.pieData[1].name, value: result?.data?.totalExpenses },
          ],
        }));
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  async function handleGetSomeTransaction() {
    try {
      const body = { _id: userId };
      const res = await handleGetTransaction(1, 5, "", body);
      if (res) {
        setData((pre) => ({
          ...pre,
          transactionData: res?.result?.data?.transactions,
        }));
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  }

  const pieChartSeries = data.pieData.map((item) => item.value);
  const pieChartLabels = data.pieData.map((item) => item.name);

  const barChartSeries = [
    {
      name: "Amount",
      data: data.categoryData.map((item: any) => item?.amount),
    },
  ];

  if (loading) {
    return (
      <div className="p-4 py-6 gap-4 space-y-8">
        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCardSkeleton theme={theme} />
          <SummaryCardSkeleton theme={theme} />
          <SummaryCardSkeleton theme={theme} />
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <ChartSkeleton theme={theme} title="pie" height="h-80" />
          <ChartSkeleton
            theme={theme}
            title="bar"
            span="xl:col-span-2"
            height="h-80"
          />
        </div>

        {/* Transactions Skeleton */}
        <TableSkeleton theme={theme} />
      </div>
    );
  }

  if (isNew.budgets || isNew.transaction)
    return (
      <div
        className={`w-full flex items-center justify-center flex-col gap-4 p-8 rounded-xl ${textPrimary}`}
      >
        <div
          className={`p-4 rounded-full ${
            theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
          }`}
        >
          <FaWallet
            className={`text-3xl ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
        </div>

        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
            {isNew.budgets && isNew.transaction
              ? "No Budget and Transactions Found"
              : isNew.budgets
              ? "No Budget Found"
              : "No Transaction Found"}
          </h3>
          <p className={`mb-4 ${textSecondary}`}>
            {isNew.budgets && isNew.transaction
              ? "Add a budget and your first transaction to start tracking your expenses."
              : isNew.budgets
              ? "Add a budget to begin managing your spending limits."
              : "Add a transaction to start tracking your expenses."}
          </p>
          <div className="flex items-center justify-center">
            <Link
              href={
                isNew.budgets && isNew.transaction
                  ? "/budget"
                  : isNew.budgets
                  ? "/budget"
                  : "/transaction"
              }
              className={`flex items-center justify-center w-fit gap-2 px-2.5 py-1.5 cursor-pointer transition-all rounded-md ${hover}`}
            >
              <FaPlus /> Add{" "}
              {isNew.budgets && isNew.transaction
                ? "Budget"
                : isNew.budgets
                ? "Budget"
                : "Transaction"}
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4 py-6 gap-4">
      <SummaryCards
        theme={theme}
        totalExpenses={data?.summary?.totalExpenses}
        totalIncome={data?.summary?.totalIncome}
        balance={data?.summary?.balance}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 p-4 gap-6">
        <DynamicChart
          type="pie"
          series={pieChartSeries}
          title="Income vs Expenses"
          subtitle="Distribution of your financial activity"
          height={350}
          colors={["#10B981", "#EF4444"]}
          options={{
            labels: pieChartLabels,
          }}
          className={`w-full p-4 rounded-lg border ${
            theme === "dark" ? "bg-[#27282E]/20" : "bg-white border-gray-200"
          } shadow-sm  `}
        />
        {data.categoryData.length > 0 ? (
          <DynamicChart
            type="bar"
            series={barChartSeries}
            title="Spending by Category"
            subtitle="Breakdown of your expenses across different categories"
            height={350}
            colors={[
              "#3B82F6",
              "#8B5CF6",
              "#F59E0B",
              "#EF4444",
              "#6B7280",
              "#10B981",
              "#F97316",
            ]}
            options={{
              xaxis: {
                categories: data.categoryData.map((item: any) => item.name),
              },
            }}
            className={`w-full p-4 rounded-lg xl:col-span-2 border ${
              theme === "dark" ? "bg-[#27282E]/20" : "bg-white border-gray-200"
            } shadow-sm `}
          />
        ) : (
          <div
            className={`flex flex-col h-full items-center justify-center w-full lg:col-span-2 p-6 rounded-lg text-center ${
              theme === "dark"
                ? "bg-gray-800/50 text-gray-300"
                : "bg-white text-gray-600"
            } shadow-sm border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <p className="text-xl font-semibold mb-2 text-center">
              No Expense Data Available
            </p>
            <p className="text-sm">
              Add an expense transaction to see the breakdown by category here.
            </p>
          </div>
        )}
      </div>

      {data.transactionData.length > 0 && (
        <div
          className={`p-4 m-4 rounded-xl border ${
            theme === "dark" ? "bg-[#27282E]/20" : "bg-gray-100 border-gray-200"
          }  shadow-sm`}
        >
          <div className="flex justify-between  items-center mb-6">
            <h3 className={`text-lg font-semibold ${textPrimary}`}>
              Recent Activity
            </h3>
            <Link
              href="/transaction"
              className={`text-sm underline ${textSecondary} hover:${textPrimary}`}
            >
              All Transactions
            </Link>
          </div>

          <div className="space-y-3">
            {data.transactionData.slice(0, 5).map((tx: any, index: number) => (
              <div
                key={index}
                className={`rounded-lg p-4 flex flex-col gap-2 ${
                  theme === "dark" ? "bg-[#27282E]/50" : "bg-white"
                } `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col justify-between ">
                    <h4 className={`font-medium ${textPrimary}`}>
                      {tx.category || "Transaction"}
                    </h4>
                    <div className="flex justify-between items-center text-xs">
                      <p className={textSecondary}>
                        {new Date(tx.date).toLocaleString("en-US", {
                          hour12: false,
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold text-sm ${
                      tx.type === "Income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.type === "Income" ? "+" : "-"}₹{tx.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
