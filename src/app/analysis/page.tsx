"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DynamicChart from "@/components/common/chart";
import { RootState } from "@/store/store";
import {
  handleGetSummary,
  handleGetCategoryBreakDown,
  handleGetMonthlyTrends,
} from "@/util/api/apis/analytics";
import ChartSkeleton from "@/components/common/skeletion/chartSkeletion";
import SummaryCards from "@/components/common/summaryCard";
import Link from "next/link";
import { FaPlus, FaWallet } from "react-icons/fa";
import { showErrorToast } from "@/util/services/toast";

const LoadingAnalysis = ({ theme }: { theme: string }) => {
  return (
    <div className="p-4 py-6 space-y-8">
      <ChartSkeleton height="h-96" chartType="line" theme={theme} />
      <ChartSkeleton height="h-96" chartType="pie" theme={theme} />
      <ChartSkeleton height="h-96" chartType="bar" theme={theme} />
    </div>
  );
};

const EmptyState = ({
  theme,
  title,
  description,
  icon,
}: {
  theme: string;
  title: string;
  description: string;
  icon?: string;
}) => {
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-96 p-8 rounded-lg ${
        theme === "dark"
          ? "bg-gray-800/50 text-gray-300"
          : "bg-white text-gray-600"
      } shadow-sm border ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>{title}</h3>
        <p className={`${textSecondary}`}>{description}</p>
      </div>
    </div>
  );
};

const Analysis = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isNew = useSelector((state: RootState) => state.user.isNew.remain);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    monthlyTrends: {
      income: [],
      expenses: [],
      months: [],
    },
    categoryBreakdown: {
      series: [],
      labels: [],
    },
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
    },
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const hover =
    theme === "dark"
      ? "hover:text-white hover:bg-black border border-white/20"
      : "hover:bg-[#27282E] border border-[#1B1C21] hover:text-white";

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const [monthlyTrendsResult, categoryResult, summaryResult] =
        await Promise.allSettled([
          handleGetMonthlyTrends(),
          handleGetCategoryBreakDown(),
          handleGetSummary(),
        ]);

      if (
        monthlyTrendsResult.status === "fulfilled" &&
        monthlyTrendsResult.value
      ) {
        const trendsData =
          monthlyTrendsResult.value.data || monthlyTrendsResult.value;

        const incomeData =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          trendsData.series?.find((s: any) => s.name === "Income")?.data || [];
        const expensesData =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          trendsData.series?.find((s: any) => s.name === "Expenses")?.data ||
          [];

        setData((prev) => ({
          ...prev,
          monthlyTrends: {
            income: incomeData,
            expenses: expensesData,
            months: trendsData.categories || [],
          },
        }));
      }

      if (categoryResult.status === "fulfilled" && categoryResult.value) {
        const categoryData = categoryResult.value.data || categoryResult.value;

        setData((prev) => ({
          ...prev,
          categoryBreakdown: {
            series: categoryData.series || [],
            labels: categoryData.labels || [],
          },
        }));
      }

      if (summaryResult.status === "fulfilled" && summaryResult.value) {
        const summaryData = summaryResult.value.data || summaryResult.value;
        setData((prev) => ({
          ...prev,
          summary: {
            totalIncome: summaryData.totalIncome || 0,
            totalExpenses: summaryData.totalExpenses || 0,
            balance: summaryData.balance || 0,
          },
        }));
      }

      const failedCalls = [
        monthlyTrendsResult,
        categoryResult,
        summaryResult,
      ].filter((result) => result.status === "rejected");

      if (failedCalls.length === 3) {
        showErrorToast("Something went worng");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching analytics data:", err);
    } finally {
      setLoading(false);
    }
  };

  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const hasMonthlyData =
    data.monthlyTrends.income.length > 0 &&
    data.monthlyTrends.expenses.length > 0 &&
    (data.monthlyTrends.income.some((val) => val > 0) ||
      data.monthlyTrends.expenses.some((val) => val > 0));
  const hasCategoryData =
    data.categoryBreakdown.series.length > 0 &&
    data.categoryBreakdown.series.some((value) => value > 0);
  const hasSummaryData =
    data.summary.totalIncome > 0 || data.summary.totalExpenses > 0;

  if (loading) {
    return <LoadingAnalysis theme={theme} />;
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

  if (!hasMonthlyData && !hasCategoryData && !hasSummaryData) {
    return (
      <div className="p-4 py-6">
        <EmptyState
          theme={theme}
          title="No Analytics Data Available"
          description="Start adding income and expense transactions to see your financial analytics and insights."
          icon="📊"
        />
      </div>
    );
  }

  return (
    <div className="p-4 py-6 space-y-8">
      {hasSummaryData ? (
        <SummaryCards
          totalIncome={data.summary.totalIncome}
          totalExpenses={data.summary.totalExpenses}
          balance={data.summary.balance}
          theme={theme}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Summary Data"
          description="Add income and expense transactions to see your financial summary."
        />
      )}
      {hasMonthlyData ? (
        <DynamicChart
          type="line"
          title="Monthly Expense Trend"
          subtitle="Tracks expenses & income over selected months"
          series={[
            {
              name: "Income",
              data: data.monthlyTrends.income,
            },
            {
              name: "Expenses",
              data: data.monthlyTrends.expenses,
            },
          ]}
          options={{
            xaxis: {
              categories: data.monthlyTrends.months,
            },
            stroke: {
              curve: "smooth",
              width: 3,
            },
            markers: {
              size: 5,
            },
          }}
          colors={["#4ade80", "#f87171"]}
          className={`w-full p-6 rounded-lg border ${
            theme === "dark" ? "bg-[#27282E]/20" : "bg-white border-gray-200"
          } shadow-sm `}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Monthly Trend Data"
          description="Add transactions across different months to see your income and expense trends."
        />
      )}

      {hasCategoryData ? (
        <DynamicChart
          type="pie"
          title="Expense Breakdown by Category"
          subtitle="Shows percentage split of expenses across categories"
          series={data.categoryBreakdown.series}
          options={{
            labels: data.categoryBreakdown.labels,
            legend: {
              position: "bottom",
            },
          }}
          colors={["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#f97316"]}
          className={`w-full p-6 rounded-lg border ${
            theme === "dark" ? "bg-[#27282E]/20" : "bg-white border-gray-200"
          } shadow-sm `}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Category Data Available"
          description="Add expense transactions with different categories to see the breakdown."
        />
      )}

      {hasMonthlyData ? (
        <DynamicChart
          type="bar"
          title="Income vs. Expense Comparison"
          subtitle="Compares total income and expenses per month"
          series={[
            {
              name: "Income",
              data: data.monthlyTrends.income,
            },
            {
              name: "Expenses",
              data: data.monthlyTrends.expenses,
            },
          ]}
          options={{
            xaxis: {
              categories: data.monthlyTrends.months,
            },
            plotOptions: {
              bar: {
                borderRadius: 4,
                dataLabels: {
                  position: "top",
                },
              },
            },
          }}
          colors={["#60a5fa", "#f87171"]}
          className={`w-full p-6 rounded-lg border ${
            theme === "dark" ? "bg-[#27282E]/20" : "bg-white border-gray-200"
          } shadow-sm `}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Comparison Data"
          description="Add income and expense data to see monthly comparisons."
        />
      )}

      {/* Summary Cards */}
    </div>
  );
};

export default Analysis;
