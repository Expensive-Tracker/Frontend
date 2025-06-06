import { InferType, number, object, string } from "yup";

export const budgetSchema = object({
  budget: number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )

    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
});

export const budgetSchemaMain = object({
  budget: number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === null ? undefined : value
    )

    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
  category: string().required("Category is required"),
});

export type FormValue = InferType<typeof budgetSchema>;
