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

const LoadingAnalysis = ({ theme }: { theme: string }) => {
  return (
    <div className="p-4 py-6 space-y-8">
      <ChartSkeleton height="h-96" chartType="line" theme={theme} />
      <ChartSkeleton height="h-96" chartType="pie" theme={theme} />
      <ChartSkeleton height="h-96" chartType="bar" theme={theme} />
    </div>
  );
};

// Empty State Component
const EmptyState = ({
  theme,
  title,
  description,
  icon,
}: {
  theme: string;
  title: string;
  description: string;
  icon: string;
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

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

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
        setError("Failed to load analytics data. Please try again later.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching analytics data:", err);
      setError("An unexpected error occurred while loading analytics data.");
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

  if (error) {
    return (
      <div className="p-4 py-6">
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
            <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
              Unable to Load Analytics
            </h3>
            <p className={`mb-4 ${textSecondary}`}>{error}</p>
            <button
              onClick={fetchAnalyticsData}
              className={`px-4 py-2 rounded-md transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no data at all, show empty state
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
      {/* Monthly Expense Trend (Line Chart) */}
      {hasSummaryData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800/50" : "bg-white"
            } shadow-sm border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h4 className={`text-sm font-medium ${textSecondary} mb-1`}>
              Total Income
            </h4>
            <p className={`text-2xl font-bold text-green-500`}>
              ₹{data.summary.totalIncome.toLocaleString()}
            </p>
          </div>

          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800/50" : "bg-white"
            } shadow-sm border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h4 className={`text-sm font-medium ${textSecondary} mb-1`}>
              Total Expenses
            </h4>
            <p className={`text-2xl font-bold text-red-500`}>
              ₹{data.summary.totalExpenses.toLocaleString()}
            </p>
          </div>

          <div
            className={`p-6 rounded-lg ${
              theme === "dark" ? "bg-gray-800/50" : "bg-white"
            } shadow-sm border ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h4 className={`text-sm font-medium ${textSecondary} mb-1`}>
              Net Balance
            </h4>
            <p
              className={`text-2xl font-bold ${
                data.summary.balance >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ₹{data.summary.balance.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          theme={theme}
          title="No Summary Data"
          description="Add income and expense transactions to see your financial summary."
          icon="💰"
        />
      )}
      {hasMonthlyData ? (
        <DynamicChart
          type="line"
          title="📆 Monthly Expense Trend"
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
          className={`w-full p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800/50" : "bg-white"
          } shadow-sm border ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Monthly Trend Data"
          description="Add transactions across different months to see your income and expense trends."
          icon="📈"
        />
      )}

      {/* Expense Breakdown by Category (Pie Chart) */}
      {hasCategoryData ? (
        <DynamicChart
          type="pie"
          title="🥧 Expense Breakdown by Category"
          subtitle="Shows percentage split of expenses across categories"
          series={data.categoryBreakdown.series}
          options={{
            labels: data.categoryBreakdown.labels,
            legend: {
              position: "bottom",
            },
          }}
          colors={["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#f97316"]}
          className={`w-full p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800/50" : "bg-white"
          } shadow-sm border ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Category Data Available"
          description="Add expense transactions with different categories to see the breakdown."
          icon="🥧"
        />
      )}

      {/* Income vs. Expense Comparison (Bar Chart) */}
      {hasMonthlyData ? (
        <DynamicChart
          type="bar"
          title="📊 Income vs. Expense Comparison"
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
          className={`w-full p-6 rounded-lg ${
            theme === "dark" ? "bg-gray-800/50" : "bg-white"
          } shadow-sm border ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          }`}
        />
      ) : (
        <EmptyState
          theme={theme}
          title="No Comparison Data"
          description="Add income and expense data to see monthly comparisons."
          icon="📊"
        />
      )}

      {/* Summary Cards */}
    </div>
  );
};

export default Analysis;
