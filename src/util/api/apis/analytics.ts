/* eslint-disable @typescript-eslint/no-explicit-any */
import endpoints from "@/util/constant/endpoint";
import axiosInstance from "../interpreter";
import { showErrorToast } from "@/util/services/toast";

const analyticsEndpoints = endpoints.analytics;

export async function handleGetSummary() {
  try {
    const response = await axiosInstance.get(analyticsEndpoints.totalIncome);
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.message);
  }
}

export async function handleGetCategoryBreakDown() {
  try {
    const response = await axiosInstance.get(
      analyticsEndpoints.categoryExpense
    );
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.message);
  }
}

export async function handleGetMonthlyTrends() {
  try {
    const response = await axiosInstance.get(analyticsEndpoints.monthlyTrends);
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.message);
  }
}
