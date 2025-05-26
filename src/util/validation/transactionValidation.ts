import { boolean, number, object, string } from "yup";

export const transactionSchema = object().shape({
  _id: string(),
  type: string()
    // .oneOf(["income", "expense"], "Transaction type must be Income or Expense")
    .notOneOf(["Select Transaction Type"], "Transaction Type is required")
    .required("Transaction type is required"),

  amount: number()
    .typeError("Amount must be a number")
    .positive("Amount must be a positive number")
    .required("Amount is required"),

  category: string().required("Category is required"),

  date: string().required("Date is required"),

  description: string()
    .max(500, "description should not exceed 500 characters")
    .nullable(),

  recurring: boolean(),
});
