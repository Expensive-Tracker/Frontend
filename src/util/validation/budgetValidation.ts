import { number, object } from "yup";

export const budgetSchema = object().shape({
  budget: number()
    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
});
