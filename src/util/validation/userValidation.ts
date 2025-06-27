import { object, string } from "yup";

export const userEditSchema = object({
  username: string().required("Username is requires"),
  email: string().email("Email must be valid").required("Email is require"),
});
