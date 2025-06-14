/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { modalProps } from "@/util/interface/props";
import Text from "../text/text";
import { HiOutlineXMark } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { handleOpenAndCloseModal, handleRefetch } from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";
import { FaAngleDown } from "react-icons/fa";
import InputAndLabel from "../input/inputAndLabel";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { transactionSchema } from "@/util/validation/transactionValidation";
import { useEffect, useState } from "react";
import {
  handleAddNewTransaction,
  handleDeleteTransactions,
  handleGetSpecificTransaction,
  handleUpdateTransaction,
} from "@/util/api/apis/transaction";
import { budgetSchemaMain } from "@/util/validation/budgetValidation";
import {
  getSpecificSubBudget,
  handleCreateSubBudget,
  handleDeleteBudgetUser,
  handleDeleteCategory,
  handleEditSubBudget,
} from "@/util/api/apis/budgets";
import { showErrorToast } from "@/util/services/toast";
import { SubBudget } from "@/util/interface/slice";
import {
  handleSetRemainFalse,
  handleSetRemainTrue,
} from "@/store/slice/userSlice";
import { handleSetBudget } from "@/store/slice/budgetSlice";

const transactionType = ["Select Transaction Type", "Income", "Expense"];
export const categories = [
  "Food",
  "Rent",
  "Entertainment",
  "Salary",
  "Healthcare",
];

const Modal = ({ id = "add", transactionId = "" }: Partial<modalProps>) => {
  const dispatch = useDispatch();
  const userDetail = useSelector(
    (state: RootState) => state.user.userDetail._id
  );
  const budgetId = useSelector((state: RootState) => state.budget._id ?? "");
  const budgetCategory = useSelector(
    (state: RootState) => state.budget.category
  );
  const transactionExits = useSelector(
    (state: RootState) => state.user.isNew.remain
  );
  const updatedCategory =
    budgetCategory?.length ?? 0 > 0
      ? categories.filter(
          (data: string) =>
            !budgetCategory?.some(
              (item: SubBudget) => item.categoryName === data
            )
        )
      : categories;

  const [editDetail, setEditDetail] = useState({
    amount: 0,
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurring: false,
    type: "Select Transaction Type",
  });

  const theme = useSelector((state: RootState) => state.theme.theme);
  let modalContent;
  const isSubBudget = id.includes("subBudget");

  const {
    handleSubmit: handleTransactionSubmit,
    getValues: getTransactionValue,
    reset: resetTransaction,
    register: transactionRegister,
    formState: { errors: transactionError, isDirty: transactionIsDirty },
  } = useForm({
    defaultValues: {
      amount: id === "edit" ? editDetail.amount : 0,
      category: id === "edit" ? editDetail.category : "",
      date:
        id === "edit"
          ? editDetail.date
          : new Date().toISOString().split("T")[0],
      description: id === "edit" ? editDetail.description : "",
      recurring: id === "edit" ? editDetail.recurring : false,
      type: id === "edit" ? editDetail.type : "Select Transaction Type",
    },
    resolver: yupResolver(transactionSchema),
  });

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isDirty },
    watch,
  } = useForm({
    defaultValues: {
      budget: undefined,
      category: "",
    },
    resolver: yupResolver(budgetSchemaMain),
  });
  const watchBudget = watch("budget");

  function handleModalClose() {
    dispatch(handleOpenAndCloseModal());
  }

  useEffect(() => {
    resetTransaction();
    if (transactionId) {
      if (id.includes("delete_Budget")) return;
      if (isSubBudget) {
        handleGetSpecificSubBudget();
      } else {
        getTransactionDetail();
      }
    }
  }, [transactionId]);

  async function handleGetSpecificSubBudget() {
    try {
      const result = await getSpecificSubBudget(budgetId, transactionId);
      const budgetValue = result?.category.subBudgetAmount;

      reset({
        budget: budgetValue,
        category: result?.category?.categoryName,
      });
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  }

  async function getTransactionDetail() {
    try {
      const result: any = await handleGetSpecificTransaction(transactionId);
      const rawDate = result?.data?.date;
      const formattedDate = rawDate
        ? new Date(rawDate).toISOString().split("T")[0]
        : "";
      const data = {
        type: result?.data?.type || "Select Transaction Type",
        amount: result?.data?.amount || 0,
        category: result?.data?.category || "",
        date: formattedDate,
        description: result?.data?.description || "",
        recurring: result?.data?.recurring || false,
      };
      setEditDetail(data);
      resetTransaction(data);
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  }

  async function handleDeleteBudget() {
    try {
      await handleDeleteBudgetUser(transactionId);
      dispatch(handleSetRemainTrue("budgets"));
      dispatch(
        handleSetBudget({
          budgetAmount: 0,
          month: "",
          category: [],
          _id: "",
          totalRemain: 0,
          totalSpent: 0,
        })
      );
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  }

  const handleAddTransaction = async () => {
    try {
      const data = getTransactionValue();
      data._id = userDetail;
      await handleAddNewTransaction(data);
      if (transactionExits.transaction)
        dispatch(handleSetRemainFalse("transaction"));
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  };

  async function handleBudgetSubmit() {
    try {
      const data = getValues();
      const payload = {
        id: budgetId,
        categoryName: data.category,
        subBudgetAmount: Number(data.budget),
      };
      await handleCreateSubBudget(payload);
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err);
    }
  }

  async function handleBudgetEdit() {
    try {
      const data = getValues();
      const payload = {
        subBudgetAmount: Number(data.budget),
      };
      await handleEditSubBudget(budgetId, transactionId, payload);
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  }

  const handleEditTransaction = async () => {
    try {
      const data = getTransactionValue();
      data.type.toLowerCase();
      data.category.toLowerCase();
      await handleUpdateTransaction(transactionId, data);
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  };

  const handleCancel = () => {
    resetTransaction();
    reset();
    dispatch(handleOpenAndCloseModal());
  };
  const handleDeleteSubBudget = async () => {
    try {
      const result = await handleDeleteCategory(budgetId, transactionId);
      if (!result) return;
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      const result: any = await handleDeleteTransactions(transactionId);
      dispatch(handleRefetch());
      dispatch(handleOpenAndCloseModal());
      console.log(result);
    } catch (err: any) {
      showErrorToast("Something went wrong");
      console.error(err?.message);
    }
  };

  switch (id) {
    case "add":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Add Transaction"
            style="!text-xl lg:!text-2xl"
          />
          <form
            className="mt-6 space-y-3"
            onSubmit={handleTransactionSubmit(handleAddTransaction)}
          >
            <div className="relative w-full">
              <select
                {...transactionRegister("type")}
                className={`w-full p-2 pr-10 rounded-md focus:outline-none appearance-none transition-all peer ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }`}
              >
                {transactionType.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FaAngleDown
                className="absolute right-3 top-[13px] pointer-events-none transition-transform duration-300 peer-focus:rotate-180"
                size={16}
              />
              {transactionError.type && (
                <p className="text-red-400 text-base mt-1">
                  {transactionError.type.message}
                </p>
              )}
            </div>
            <InputAndLabel
              name="amount"
              type="number"
              labelText="Amount"
              placeHolder="Enter amount"
              register={transactionRegister}
              divStyle="!gap-1"
              inputStyle={` p-2  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }
                `}
              errorMessage={transactionError.amount?.message}
            />
            <div className="relative w-full">
              <label id="category">Category</label>
              <select
                {...transactionRegister("category")}
                className={`w-full mt-1 p-2 pr-10 rounded-md   focus:outline-none appearance-none transition-all peer ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FaAngleDown
                className="absolute right-3 top-[42px] pointer-events-none transition-transform duration-300 peer-focus:rotate-180"
                size={16}
              />
              {transactionError.category && (
                <p className="text-red-400 text-base mt-1">
                  {transactionError.category.message}
                </p>
              )}
            </div>
            <InputAndLabel
              name="date"
              type="date"
              labelText="Date"
              register={transactionRegister}
              divStyle="!gap-1"
              inputStyle={`p-2 ${
                theme === "dark"
                  ? "bg-[#27282E] border border-white text-white"
                  : "border border-black text-black"
              }`}
              errorMessage={transactionError.date?.message}
            />
            <InputAndLabel
              name="description"
              type="text"
              labelText="Description (optional)"
              placeHolder="Add a note"
              register={transactionRegister}
              divStyle="!gap-1"
              inputStyle={`p-2 ${
                theme === "dark"
                  ? "bg-[#27282E] border border-white text-white"
                  : "border border-black text-black"
              }`}
              errorMessage={transactionError.description?.message}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                {...transactionRegister("recurring")}
                className="w-4 h-4"
              />
              <label htmlFor="recurring" className="text-sm">
                Recurring Transaction
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2  justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
      break;
    case "edit":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Edit Transaction"
            style="!text-xl lg:!text-2xl"
          />
          <form
            className="mt-6 space-y-3"
            onSubmit={handleTransactionSubmit(handleEditTransaction)}
          >
            <div className="relative w-full">
              <select
                {...transactionRegister("type")}
                className={`w-full p-2 pr-10 rounded-md focus:outline-none appearance-none transition-all peer ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }`}
              >
                {editDetail.type ? (
                  <>
                    <option value={editDetail.type}>
                      {editDetail.type.charAt(0).toUpperCase() +
                        editDetail.type.slice(1)}
                    </option>
                    {transactionType
                      .filter(
                        (item) =>
                          item.toLowerCase() !== editDetail.type.toLowerCase()
                      )
                      .map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  </>
                ) : (
                  transactionType.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                )}
              </select>

              <FaAngleDown
                className="absolute right-3 top-[13px] pointer-events-none transition-transform duration-300 peer-focus:rotate-180"
                size={16}
              />
              {transactionError.type && (
                <p className="text-red-400 text-base mt-1">
                  {transactionError.type.message}
                </p>
              )}
            </div>
            <InputAndLabel
              name="amount"
              type="number"
              labelText="Amount"
              placeHolder="Enter amount"
              register={transactionRegister}
              divStyle="!gap-1"
              inputStyle={` p-2  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }
                `}
              errorMessage={transactionError.amount?.message}
            />
            <div className="relative w-full">
              <label id="category">Category</label>
              <select
                {...transactionRegister("category")}
                className={`w-full mt-1 p-2 pr-10 rounded-md   focus:outline-none appearance-none transition-all peer ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }`}
              >
                <option value="">Select Category</option>
                {editDetail.category ? (
                  <>
                    <option value={editDetail.category}>
                      {editDetail.category.charAt(0).toUpperCase() +
                        editDetail.category.slice(1)}
                    </option>
                    {categories
                      .filter(
                        (item) =>
                          item.toLowerCase() !== editDetail.type.toLowerCase()
                      )
                      .map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                  </>
                ) : (
                  categories.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))
                )}
              </select>
              <FaAngleDown
                className="absolute right-3 top-[42px] pointer-events-none transition-transform duration-300 peer-focus:rotate-180"
                size={16}
              />
              {transactionError.category && (
                <p className="text-red-400 text-base mt-1">
                  {transactionError.category.message}
                </p>
              )}
            </div>
            <InputAndLabel
              name="date"
              type="date"
              labelText="Date"
              register={transactionRegister}
              divStyle="!gap-1"
              inputStyle={`p-2 ${
                theme === "dark"
                  ? "bg-[#27282E] border border-white text-white"
                  : "border border-black text-black"
              }`}
              errorMessage={transactionError.date?.message}
            />
            <InputAndLabel
              name="description"
              type="text"
              labelText="description (optional)"
              placeHolder="Add a note"
              register={transactionRegister}
              divStyle="!gap-1"
              inputStyle={`p-2 ${
                theme === "dark"
                  ? "bg-[#27282E] border border-white text-white"
                  : "border border-black text-black"
              }`}
              errorMessage={transactionError.description?.message}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                {...transactionRegister("recurring")}
                className="w-4 h-4"
              />
              <label htmlFor="recurring" className="text-sm">
                Recurring Transaction
              </label>
            </div>

            <div className="flex gap-2  justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
                  !transactionIsDirty ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={!transactionIsDirty}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
      break;
    case "delete":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Delete Transaction"
            style="!text-xl lg:!text-2xl "
          />
          <div className="flex flex-col mt-4 gap-4">
            <div>
              <Text
                Element="h3"
                text="Are you sure about that?"
                style="!text-xl"
              />
              <Text
                isDes
                text="Action can not be reverted."
                style="-mt-1 text-gray-300"
              />
            </div>
            <div className="self-end flex items-center gap-4">
              {" "}
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleDeleteTransaction}
                className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
      break;
    case "add_subBudget":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Add Category"
            style="!text-xl lg:!text-2xl "
          />
          <form
            className="mt-4 space-y-4"
            onSubmit={handleSubmit(handleBudgetSubmit)}
          >
            <div className="relative w-full">
              <label id="category">Category</label>
              <select
                {...register("category")}
                className={`w-full mt-1 p-2 pr-10 rounded-md focus:outline-none appearance-none transition-all peer ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }`}
              >
                <option value="">Select Category</option>
                {updatedCategory
                  .filter((item) => item !== "Salary")
                  .map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
              <FaAngleDown
                className="absolute right-3 top-[40px] pointer-events-none transition-transform duration-300 peer-focus:rotate-180"
                size={16}
              />
              {errors.category && (
                <p className="text-red-400 text-base mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
            <InputAndLabel
              name="budget"
              type="number"
              labelText="Budget for category"
              placeHolder="Enter amount"
              register={register}
              divStyle="!gap-1 "
              inputStyle={` p-2  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }
                `}
              errorMessage={errors.budget?.message}
            />
            <div className="flex gap-2  justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md `}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
      break;
    case "edit_subBudget":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Edit Category Budget"
            style="!text-xl lg:!text-2xl "
          />
          <form
            className="mt-4 space-y-4"
            onSubmit={handleSubmit(handleBudgetEdit)}
          >
            <InputAndLabel
              name="budget"
              type="number"
              labelText="Budget for category"
              placeHolder="Enter amount"
              register={register}
              divStyle="!gap-1 "
              inputStyle={` p-2  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                ${
                  theme === "dark"
                    ? "bg-[#27282E] border border-white text-white"
                    : "border border-black text-black"
                }
                `}
              errorMessage={errors.budget?.message}
            />
            <div className="flex gap-2  justify-end">
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
                  !isDirty ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={!isDirty && watchBudget === getValues().budget}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      );
      break;
    case "delete_subBudget":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Delete Category"
            style="!text-xl lg:!text-2xl "
          />
          <div className="flex flex-col mt-4 gap-4">
            <div>
              <Text
                Element="h3"
                text="Are you sure about that?"
                style="!text-xl"
              />
              <Text
                isDes
                text="Action can not be reverted."
                style="-mt-1 text-gray-300"
              />
            </div>
            <div className="self-end flex items-center gap-4">
              {" "}
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleDeleteSubBudget}
                className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
      break;
    case "delete_Budget":
      modalContent = (
        <div>
          <Text
            Element="h2"
            text="Delete Category"
            style="!text-xl lg:!text-2xl "
          />
          <div className="flex flex-col mt-4 gap-4">
            <div>
              <Text
                Element="h3"
                text="Are you sure about that?"
                style="!text-xl"
              />
              <Text
                isDes
                text="Action can not be reverted."
                style="-mt-1 text-gray-300"
              />
            </div>
            <div className="self-end flex items-center gap-4">
              {" "}
              <button
                className="px-4 py-2 bg-gray-100 rounded-md text-black cursor-pointer"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleDeleteBudget}
                className="bg-red-600 text-white px-4 py-2 rounded-md cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      );
      break;
  }
  return (
    <>
      <style>
        {`
          .modal__backdrop {
    background: rgba(255, 255 , 255, 0.55);
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 1000;
          `}
      </style>
      <div className="modal__backdrop flex flex-col px-3 justify-center items-center">
        <div
          className={`${
            theme === "dark"
              ? "bg-[#27282E] border border-[#1B1C21]"
              : "bg-white text-black"
          } px-4 py-6 rounded-md shadow-xl md:max-w-[500px] h-auto  my-5 w-full relative`}
        >
          {modalContent}
          <div
            className={`p-2 cursor-pointer ${
              theme === "dark" ? "bg-gray-200 text-black" : "bg-gray-100"
            } w-fit rounded-full absolute right-[18px] top-[22px]`}
            onClick={handleModalClose}
          >
            <HiOutlineXMark size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
