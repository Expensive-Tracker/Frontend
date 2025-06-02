/* eslint-disable @typescript-eslint/no-explicit-any */

import endpoints from "@/util/constant/endpoint";
import axiosInstance from "../interpreter";
const budgetEndpoints = endpoints.budgets;

export async function handleAddBudget(body: any) {
  try {
    const response = await axiosInstance.post(
      `${budgetEndpoints.allBudgets}`,
      body
    );
    return response.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}
