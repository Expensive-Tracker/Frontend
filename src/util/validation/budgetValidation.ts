import { InferType, number, object, string } from "yup";

export const budgetSchema = object({
  budget: number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const trimmed = originalValue.trim();
        if (trimmed === "") return undefined;
        const num = Number(trimmed);
        return isNaN(num) ? undefined : num;
      }
      return value;
    })
    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
});

export const budgetSchemaMain = object({
  budget: number()
    .transform((value, originalValue) => {
      if (typeof originalValue === "string") {
        const trimmed = originalValue.trim();
        if (trimmed === "") return undefined;
        const num = Number(trimmed);
        return isNaN(num) ? undefined : num;
      }
      return value;
    })
    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),

  category: string().required("Category is required"),
});
export type FormValue = InferType<typeof budgetSchema>;
export type FormValueMain = InferType<typeof budgetSchemaMain>;
