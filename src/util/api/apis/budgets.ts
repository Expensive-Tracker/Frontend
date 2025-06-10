/* eslint-disable @typescript-eslint/no-explicit-any */

import endpoints from "@/util/constant/endpoint";
import axiosInstance from "../interpreter";
import { showErrorToast } from "@/util/services/toast";
const budgetEndpoints = endpoints.budgets;

export async function handleAddBudget(body: any) {
  try {
    const response = await axiosInstance.post(
      `${budgetEndpoints.allBudgets.replace("/:id", "")}`,
      body
    );
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.response?.data?.message || "Something went wrong");
    console.error(err?.message);
  }
}

export async function handleGetUserBudget(id: string) {
  const result: any = await axiosInstance.get(
    `${budgetEndpoints.allBudgets.replace(":id", id)}`
  );
  return result.data;
}

export async function handleEditBudget(body: any) {
  const response = await axiosInstance.put(
    `${budgetEndpoints.updBudgets.replace(":id", body.id)}`,
    body
  );
  return response.data;
}

export async function getSpecificSubBudget(
  budgetId: string,
  subBudgetId: string
) {
  try {
    const response = await axiosInstance.get(
      `${budgetEndpoints.specificBudgets
        .replace(":id", budgetId)
        .replace(":subId", subBudgetId)}`
    );
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.response?.data?.message || "Something went wrong");
    console.error(err?.message);
  }
}

export async function handleCreateSubBudget(body: {
  id: string;
  categoryName: string;
  subBudgetAmount: number;
}) {
  try {
    const response = await axiosInstance.post(
      endpoints.budgets.subBudgetCreate,
      body
    );
    return response.data;
  } catch (err: any) {
    console.error(err?.message);
    throw err;
  }
}

export async function handleEditSubBudget(
  budgetId: string,
  subBudgetId: string,
  body: any
) {
  try {
    const response = await axiosInstance.put(
      `${budgetEndpoints.specificBudgets
        .replace(":id", budgetId)
        .replace(":subId", subBudgetId)}`,
      body
    );
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.response?.data?.message || "Something went wrong");
    console.error(err?.message);
  }
}

export async function handleDeleteCategory(id: string, subId: string) {
  try {
    const response = await axiosInstance.delete(
      `${budgetEndpoints.subDeleteBudgets
        .replace(":id", id)
        .replace(":subId", subId)}`
    );
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.response?.data?.message || "Something went wrong");
    console.error(err?.message);
  }
}

export async function handleDeleteBudgetUser(id: string) {
  try {
    const result: any = await axiosInstance.delete(
      `${budgetEndpoints.DeleteBudgets.replace(":id", id)}`
    );
    return result.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}
