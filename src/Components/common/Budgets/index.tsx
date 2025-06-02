/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RootState } from "@/store/store";
import { budgetSchema } from "@/util/validation/budgetValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import InputAndLabel from "../input/inputAndLabel";
import moment from "moment";
import { handleAddBudget } from "@/util/api/apis/budgets";
import { handleSetBudget } from "@/store/slice/budgetSlice";
import { handleIsUserNew } from "@/store/slice/userSlice";

type FormValue = {
  budget: number;
};

const BudgetArea = () => {
  const isNew = useSelector((state: RootState) => state.user.isNew);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const userId = useSelector((state: RootState) => state.user.userDetail._id);
  const budgetAmount = useSelector(
    (state: RootState) => state.budget.budgetAmount
  );
  const dispatch = useDispatch();
  const {
    getValues,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: yupResolver(budgetSchema),
  });

  const onSubmit = async () => {
    try {
      const { budget } = getValues();
      const currentMonth = moment().format("MMMM YYYY");
      const category: any[] = [];

      const body = {
        id: userId,
        budgetAmount: budget,
        category,
        month: currentMonth,
      };
      const result = await handleAddBudget(body);
      if (result) {
        dispatch(handleSetBudget(result.budget));
        dispatch(handleIsUserNew());
        alert("Budget set successfully!");
      } else {
        alert(result?.message || "Failed to set budget.");
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <>
      {isNew ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col gap-4 p-6 rounded-xl shadow-lg transition-colors duration-300  ${
            theme === "dark" ? "bg-[#1f1f23] text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-xl font-semibold">Set Your Budget</h2>

          <InputAndLabel
            name="budget"
            type="number"
            inputStyle="placeholder:!text-black/50 !text-4xl  !border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            labelStyle="hidden "
            placeHolder="e.g. 5000"
            register={register}
            errorMessage={errors.budget?.message}
          />

          <button
            type="submit"
            className="w-full bg-green-600  text-white py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            Submit Budget
          </button>
        </form>
      ) : (
        <div
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col gap-4 p-6 rounded-xl shadow-lg transition-colors duration-300  ${
            theme === "dark" ? "bg-[#1f1f23] text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-xl font-semibold"> Your Remaining Budget</h2>
          <p className="!text-4xl ">₹ {budgetAmount}</p>
          <div className=""></div>
        </div>
      )}
    </>
  );
};

export default BudgetArea;
