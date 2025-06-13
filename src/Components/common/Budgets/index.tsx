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
import { useEffect, useState, useRef } from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { handleRefetch } from "@/store/slice/uiSlice";
import Button from "../button/button";
import { BiLineChartDown } from "react-icons/bi";
import { showErrorToast } from "@/util/services/toast";

interface props {
  handleModelOpen: (id: string) => void;
  setIsLoading: (id: boolean) => void;
  loading: boolean;
}

// Skeleton Loader Component
const BudgetSkeleton = ({ theme }: { theme: string }) => {
  const bgColor = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const borderColor = theme === "dark" ? "border-zinc-700" : "border-gray-200";
  const skeletonBg = theme === "dark" ? "bg-zinc-800" : "bg-gray-200";
  const skeletonShimmer =
    theme === "dark"
      ? "bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800"
      : "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200";

  return (
    <div
      className={`flex flex-col gap-6 p-6 rounded-xl shadow-lg transition-colors duration-300 ${bgColor} ${borderColor} border animate-pulse`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`h-6 w-32 rounded ${skeletonBg} animate-shimmer`}></div>
        <div className={`h-8 w-8 rounded-lg ${skeletonBg}`}></div>
      </div>

      {/* Main Budget Display */}
      <div
        className={`p-4 rounded-lg ${skeletonBg} border-l-4 border-l-gray-400`}
      >
        <div
          className={`h-12 w-48 rounded mb-2 ${skeletonShimmer} animate-shimmer`}
        ></div>
        <div
          className={`h-4 w-36 rounded ${skeletonShimmer} animate-shimmer`}
        ></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((item) => (
          <div
            key={item}
            className={`p-4 rounded-lg ${skeletonBg} border-l-4 border-l-gray-400`}
          >
            <div className="flex items-center justify-between mb-2">
              <div
                className={`h-4 w-20 rounded ${skeletonShimmer} animate-shimmer`}
              ></div>
              <div
                className={`h-8 w-8 rounded-md ${skeletonShimmer} animate-shimmer`}
              ></div>
            </div>
            <div
              className={`h-8 w-24 rounded ${skeletonShimmer} animate-shimmer`}
            ></div>
          </div>
        ))}
      </div>

      {/* Budget Health */}
      <div
        className={`flex items-center justify-between p-3 rounded-lg ${skeletonBg}`}
      >
        <div
          className={`h-4 w-24 rounded ${skeletonShimmer} animate-shimmer`}
        ></div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${skeletonShimmer} animate-shimmer`}
          ></div>
          <div
            className={`h-4 w-16 rounded ${skeletonShimmer} animate-shimmer`}
          ></div>
        </div>
      </div>
    </div>
  );
};

const BudgetArea = ({ handleModelOpen, setIsLoading, loading }: props) => {
  const isNew = useSelector((state: RootState) => state.user.isNew);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const userId = useSelector((state: RootState) => state.user.userDetail._id);
  const budgets = useSelector((state: RootState) => state.budget);
  const refetch = useSelector((state: RootState) => state.uiSlice.refetch);
  const [edit, setEdit] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [hasBudget, setHasBudget] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const bgColor = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const labelText = theme === "dark" ? "text-gray-400" : "text-gray-500";
  const borderColor = theme === "dark" ? "border-zinc-700" : "border-gray-200";

  const chartColors = {
    spent: {
      iconBg: theme === "dark" ? "bg-red-500/20" : "bg-red-100",
      iconColor: theme === "dark" ? "text-red-400" : "text-red-600",
      textColor: theme === "dark" ? "text-red-300" : "text-red-700",
      accentBorder: theme === "dark" ? "border-l-red-400" : "border-l-red-500",
    },
    income: {
      iconBg: theme === "dark" ? "bg-green-500/20" : "bg-green-100",
      iconColor: theme === "dark" ? "text-green-400" : "text-green-600",
      textColor: theme === "dark" ? "text-green-300" : "text-green-700",
      accentBorder:
        theme === "dark" ? "border-l-green-400" : "border-l-green-500",
    },
    remaining: {
      positive: {
        textColor: theme === "dark" ? "text-green-400" : "text-green-600",
        bgColor: theme === "dark" ? "bg-green-500/10" : "bg-green-50",
      },
      negative: {
        textColor: theme === "dark" ? "text-red-400" : "text-red-600",
        bgColor: theme === "dark" ? "bg-red-500/10" : "bg-red-50",
      },
    },
  };

  const buttonColors = {
    primary:
      theme === "dark"
        ? "bg-blue-600 hover:bg-blue-700 text-white"
        : "bg-blue-500 hover:bg-blue-600 text-white",
    success:
      theme === "dark"
        ? "bg-green-600 hover:bg-green-700 text-white"
        : "bg-green-500 hover:bg-green-600 text-white",
    secondary:
      theme === "dark"
        ? "bg-zinc-700 hover:bg-zinc-600 text-gray-200"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800",
  };

  const menuColors = {
    menuBg: theme === "dark" ? "bg-zinc-800" : "bg-white",
    menuShadow:
      theme === "dark"
        ? "shadow-2xl shadow-black/20"
        : "shadow-xl shadow-gray-300/20",
    hoverBg: theme === "dark" ? "hover:bg-zinc-700" : "hover:bg-gray-100",
    danger: {
      text: theme === "dark" ? "text-red-400" : "text-red-600",
    },
  };

  const {
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      budget: undefined,
    },
    resolver: yupResolver(budgetSchema),
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (refetch) dispatch(handleRefetch());
    getUserBudget();
  }, [refetch]);

  useEffect(() => {
    const userHasBudget = budgets && budgets._id && budgets.budgetAmount;
    setHasBudget(!!userHasBudget);

    if (userHasBudget && isNew?.remain?.budgets === true) {
      dispatch(handleSetRemainFalse("budgets"));
    }
  }, [budgets, isNew, dispatch]);

  const getUserBudget = async () => {
    try {
      setIsLoading(true);
      const result = await handleGetUserBudget(userId);
      if (!result) {
        setIsLoading(false);
        return;
      }
      dispatch(handleSetBudget(result?.budget));
      dispatch(handleSetRemainFalse("budgets"));
      setHasBudget(true);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        dispatch(handleSetRemainTrue("budgets"));
        setHasBudget(false);
        console.log("No budget found - 404");
      } else {
        console.error("Error fetching user budget:", err?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (edit && budgets.budgetAmount) {
      setValue("budget", budgets.budgetAmount);
    } else if (!edit) {
      reset({ budget: undefined });
    }
  }, [edit, budgets.budgetAmount, setValue, reset]);

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);
      const { budget } = getValues();

      if (!budget || budget <= 0) {
        showErrorToast("Please enter a valid budget amount");
        return;
      }

      if (edit) {
        const body = {
          budgetAmount: budget,
          id: budgets._id,
        };
        const result = await handleEditBudget(body);
        if (result) {
          dispatch(handleSetBudget(result.budget));
          setEdit(false);
          setHasBudget(true);
          reset({ budget: undefined });
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
          dispatch(handleSetRemainFalse("budgets"));
          setShowForm(false);
          setHasBudget(true);
          reset({ budget: undefined });
        }
      }
    } catch (error: any) {
      showErrorToast("Something went wrong");
      console.error("Error submitting budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEdit(false);
    reset({ budget: undefined });
  };

  const handleShowForm = () => {
    setShowForm(true);
    reset({ budget: undefined });
  };

  const handleDeleteBudget = async () => {
    handleModelOpen(budgets._id || "");
  };

  const remainingAmount = budgets?.totalRemain || 0;
  const isPositive = remainingAmount >= 0;
  const remainingColors = isPositive
    ? chartColors.remaining.positive
    : chartColors.remaining.negative;

  if (loading && !(isNew?.remain?.budgets === true)) {
    return <BudgetSkeleton theme={theme} />;
  }

  if (!hasBudget && !showForm && !edit) {
    return (
      <div
        className={`w-full flex items-center justify-center flex-col gap-4 p-8 rounded-xl  ${textPrimary} `}
      >
        <div
          className={`p-4 rounded-full ${
            theme === "dark" ? "bg-blue-500/20" : "bg-blue-100"
          }`}
        >
          <AiOutlineLineChart
            className={`text-3xl ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
        </div>
        <div className="text-center">
          <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
            No Budget Set
          </h3>
          <p className={`mb-4 ${textSecondary}`}>
            Create your first budget to start tracking your expenses
          </p>
        </div>
        <Button
          className={`flex items-center gap-2 px-6 py-3 -mt-2 rounded-lg font-medium transition-all duration-200 `}
          onClick={handleShowForm}
        >
          <FaPlus />
          Add Budget
        </Button>
      </div>
    );
  }

  // Show form for creating or editing budget
  if (showForm || edit) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`flex flex-col gap-6 p-6 rounded-xl shadow-lg transition-colors duration-300 ${bgColor} ${textPrimary} ${borderColor} border`}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-xl font-semibold ${textPrimary}`}>
            {edit ? "Edit your Budget" : "Set Your Budget"}
          </h2>
          <RxCross1
            onClick={edit ? handleCancelEdit : () => setShowForm(false)}
            className={`cursor-pointer transition-colors duration-200 ${
              theme === "dark" ? "hover:text-red-400" : "hover:text-red-500"
            }`}
          />
        </div>

        <div
          className={`p-4 rounded-lg ${
            theme === "dark" ? "bg-zinc-800" : "bg-gray-50"
          }`}
        >
          <InputAndLabel
            name="budget"
            type="number"
            inputStyle={`${
              theme === "dark"
                ? "placeholder:!text-gray-400 !bg-transparent"
                : "placeholder:!text-gray-500 !bg-transparent"
            } !text-4xl !border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none`}
            labelStyle={`hidden ${labelText}`}
            placeHolder="e.g. 5000"
            register={register}
            errorMessage={errors.budget?.message}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg text-lg font-medium transition-all duration-200 ${
            buttonColors.success
          } ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          } flex items-center justify-center gap-2`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {edit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{edit ? "Update Budget" : "Submit Budget"}</>
          )}
        </button>
      </form>
    );
  }

  return (
    <div
      className={`flex flex-col gap-6 p-6 rounded-xl shadow-lg transition-colors duration-300 ${bgColor} ${textPrimary} ${borderColor} border`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${textPrimary}`}>Your Budget</h2>

        <div className="relative">
          <button
            className={`p-2 rounded-lg transition-colors duration-200 ${menuColors.hoverBg}`}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <BsThreeDots className={`w-4 h-4 ${textSecondary}`} />
          </button>

          <div
            ref={menuRef}
            className={`absolute right-0 top-12 ${menuColors.menuBg} ${
              menuColors.menuShadow
            } rounded-lg overflow-hidden z-10 min-w-[120px] transition-all duration-300 ease-in-out transform ${
              showMenu
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <button
              className={`w-full px-4 py-3 flex items-center gap-3 ${textSecondary} ${menuColors.hoverBg} transition-colors duration-200`}
              onClick={() => {
                setEdit(true);
                setShowMenu(false);
              }}
            >
              <FaRegEdit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <div className={`h-px ${borderColor} bg-current opacity-10`}></div>
            <button
              className={`w-full px-4 py-3 flex items-center gap-3 ${menuColors.danger.text} ${menuColors.hoverBg} transition-colors duration-200`}
              onClick={handleDeleteBudget}
            >
              <MdDelete className="w-4 h-4" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`p-4 rounded-lg ${remainingColors.bgColor} border-l-4 ${
          isPositive
            ? chartColors.remaining.positive.textColor.replace(
                "text-",
                "border-l-"
              )
            : chartColors.remaining.negative.textColor.replace(
                "text-",
                "border-l-"
              )
        }`}
      >
        <p className={`text-4xl font-bold ${remainingColors.textColor}`}>
          ₹{" "}
          {remainingAmount === 0
            ? budgets?.budgetAmount
            : Math.abs(remainingAmount)}
        </p>
        <p className={`text-sm mt-1 ${textSecondary}`}>
          {isPositive ? "Available to spend" : "Over budget"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 rounded-lg ${
            theme === "dark" ? "bg-zinc-800" : "bg-gray-50"
          } border-l-4 ${chartColors.spent.accentBorder}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${textSecondary}`}>
              Total Spent
            </h3>
            <div className={`p-2 rounded-md ${chartColors.spent.iconBg}`}>
              <BiLineChartDown
                className={`text-lg ${chartColors.spent.iconColor}`}
              />
            </div>
          </div>
          <p className={`text-2xl font-bold ${chartColors.spent.textColor}`}>
            ₹ {budgets?.totalSpent || 0}
          </p>
        </div>

        <div
          className={`p-4 rounded-lg ${
            theme === "dark" ? "bg-zinc-800" : "bg-gray-50"
          } border-l-4 ${chartColors.income.accentBorder}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${textSecondary}`}>
              Total Income
            </h3>
            <div className={`p-2 rounded-md ${chartColors.income.iconBg}`}>
              <AiOutlineLineChart
                className={`text-lg ${chartColors.income.iconColor}`}
              />
            </div>
          </div>
          <p className={`text-2xl font-bold ${chartColors.income.textColor}`}>
            ₹ {budgets?.budgetAmount || 0}
          </p>
        </div>
      </div>

      <div
        className={`flex items-center justify-between p-3 rounded-lg ${
          theme === "dark" ? "bg-zinc-800/50" : "bg-gray-100/50"
        }`}
      >
        <span className={`text-sm ${textSecondary}`}>Budget Health:</span>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isPositive ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className={`text-sm font-medium ${remainingColors.textColor}`}>
            {isPositive ? "On Track" : "Over Budget"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BudgetArea;
