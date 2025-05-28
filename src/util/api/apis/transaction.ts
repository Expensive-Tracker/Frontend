/* eslint-disable @typescript-eslint/no-explicit-any */
import { bodyTransaction } from "@/util/interface/api";
import axiosInstance from "../interpreter";
import endpoints from "@/util/constant/endpoint";

const transactionEndpoint = endpoints.transaction;

export async function handleGetTransaction(
  page: number,
  limit: number,
  search: string,
  body: bodyTransaction
) {
  try {
    const response = await axiosInstance.post(
      `${transactionEndpoint.getUserTransaction}?page=${page}&limit=${limit}&search=${search}`,
      body
    );
    return response.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}

export async function handleGetSpecificTransaction(id: string) {
  try {
    const response = await axiosInstance.get(
      `${transactionEndpoint.specificTransition.replace(":id", id)}`
    );
    return response.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}

export async function handleDeleteTransactions(id: string) {
  try {
    const response = await axiosInstance.delete(
      `${transactionEndpoint.deleteTransition.replace(":id", id)}`
    );
    return response.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}

export async function handleAddNewTransaction(body: any) {
  try {
    const res = await axiosInstance.post(
      `${transactionEndpoint.newTransaction}`,
      body
    );
    return res.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}

export async function handleUpdateTransaction(id: string, body: any) {
  try {
    const result: any = await axiosInstance.put(
      `${transactionEndpoint.updTransition.replace(":id", id)}`,
      body
    );
    return result.data;
  } catch (err: any) {
    console.error(err?.message);
  }
}
