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
