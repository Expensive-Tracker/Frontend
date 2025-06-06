/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RootState } from "@/store/store";
import { budgetSchema, FormValue } from "@/util/validation/budgetValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import InputAndLabel from "../input/inputAndLabel";
import moment from "moment";
import {
  handleAddBudget,
  handleEditBudget,
  handleGetUserBudget,
} from "@/util/api/apis/budgets";
import { handleSetBudget } from "@/store/slice/budgetSlice";
import {
  handleSetRemainFalse,
  handleSetRemainTrue,
} from "@/store/slice/userSlice";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { handleRefetch } from "@/store/slice/uiSlice";

const BudgetArea = () => {
  const isNew = useSelector((state: RootState) => state.user.isNew);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const userId = useSelector((state: RootState) => state.user.userDetail._id);
  const [edit, setEdit] = useState<boolean>(false);
  const budgets = useSelector((state: RootState) => state.budget);
  const refetch = useSelector((state: RootState) => state.uiSlice.refetch);
  const dispatch = useDispatch();

  const bgColor = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const labelText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  const {
    getValues,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      budget: edit ? budgets.budgetAmount : undefined,
    },
    resolver: yupResolver(budgetSchema),
  });

  useEffect(() => {
    if (refetch) dispatch(handleRefetch());
    getUserBudget();
  }, [refetch]);

  const getUserBudget = async () => {
    try {
      const result = await handleGetUserBudget(userId);
      if (!result) {
        return;
      }
      dispatch(handleSetBudget(result?.budget));
    } catch (err: any) {
      if (err?.response?.status === 404) {
        dispatch(handleSetRemainTrue("budgets"));
        console.log("hi");
      } else {
        console.error("Error fetching user budget:", err?.message);
      }
    }
  };

  useEffect(() => {
    if (edit) {
      reset({ budget: budgets.budgetAmount });
    }
  }, [edit, budgets.budgetAmount, reset]);

  const onSubmit = async () => {
    try {
      const { budget } = getValues();
      if (edit) {
        const body = {
          budgetAmount: budget,
          id: budgets._id,
        };
        const result = await handleEditBudget(body);
        if (result) {
          dispatch(handleSetBudget(result.budget));
          setEdit(false);
        }
      } else {
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
          console.log("hi new");
          dispatch(handleSetRemainFalse("budgets"));
        }
      }
    } catch (error) {
      console.error("Error submitting budget:", error);
    }
  };

  return (
    <>
      {isNew.remain.budgets || edit ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex flex-col gap-4 p-6 rounded-xl shadow-lg transition-colors duration-300 ${bgColor} ${textPrimary}`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {edit ? "Edit your Budget" : "Set Your Budget"}
            </h2>
            {edit && (
              <RxCross1
                onClick={() => setEdit(false)}
                className="cursor-pointer"
              />
            )}
          </div>

          <InputAndLabel
            name="budget"
            type="number"
            inputStyle={` ${
              theme === "dark"
                ? "placeholder:!text-white"
                : "placeholder:!text-black/50"
            } !text-4xl !border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            labelStyle={`hidden ${labelText}`}
            placeHolder="e.g. 5000"
            register={register}
            errorMessage={errors.budget?.message}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors duration-200 cursor-pointer"
          >
            Submit Budget
          </button>
        </form>
      ) : (
        <div
          className={`flex flex-col gap-4 p-6 rounded-xl shadow-lg transition-colors duration-300 ${bgColor} ${textPrimary}`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Remaining Budget</h2>

            <FaRegEdit
              className="cursor-pointer"
              onClick={() => setEdit(true)}
            />
          </div>
          <p className="!text-4xl">₹ {budgets.budgetAmount}</p>
          <div></div>
        </div>
      )}
    </>
  );
};

export default BudgetArea;
