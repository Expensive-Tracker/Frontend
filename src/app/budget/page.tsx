"use client";
import BudgetArea from "@/components/common/Budgets";
import Button from "@/components/common/button/button";
import Modal, { categories } from "@/components/common/modal/modal";
import SubCategory from "@/components/common/subBudgets";
import { handleOpenAndCloseModal } from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { BiCategoryAlt } from "react-icons/bi";

const Budgets = () => {
  const [modelDetail, setModalDetail] = useState<{
    id:
      | "add_subBudget"
      | "edit_subBudget"
      | "delete_subBudget"
      | "delete_Budget";
    transactionId: string;
  }>({
    id: "add_subBudget",
    transactionId: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const budgetCategory = useSelector(
    (state: RootState) => state.budget.category ?? []
  );
  const budgetExits = useSelector(
    (state: RootState) => state.user.isNew.remain.budgets
  );
  const modelOpen = useSelector(
    (state: RootState) => state.uiSlice.modal.isOpen
  );

  const bgColor = theme === "dark" ? "bg-zinc-900" : "bg-white";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";

  const allCategoriesAdded = categories.every((cat) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    budgetCategory.some((budgetCat: any) => budgetCat.categoryName === cat)
  );

  function handleResetState() {
    setModalDetail((pre) => ({
      ...pre,
      transactionId: "",
    }));
  }

  function handleAddModelDetail() {
    setModalDetail((pre) => ({
      ...pre,
      id: "add_subBudget",
    }));
    dispatch(handleOpenAndCloseModal());
  }

  function handleAddModelEditDetail(id: string) {
    setModalDetail(() => ({
      id: "edit_subBudget",
      transactionId: id,
    }));
    dispatch(handleOpenAndCloseModal());
  }

  function handleAddModelDeleteDetail(id: string) {
    setModalDetail(() => ({
      id: "delete_subBudget",
      transactionId: id,
    }));
    dispatch(handleOpenAndCloseModal());
  }

  function handleAddModelDelete(id: string) {
    setModalDetail(() => ({
      id: "delete_Budget",
      transactionId: id,
    }));
    dispatch(handleOpenAndCloseModal());
  }

  const renderNoCategoriesSection = () => (
    <div
      className={`w-full flex items-center justify-center flex-col gap-4 p-8 rounded-xl ${bgColor} ${textPrimary} `}
    >
      <div
        className={`p-4 rounded-full ${
          theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"
        }`}
      >
        <BiCategoryAlt
          className={`text-3xl ${
            theme === "dark" ? "text-purple-400" : "text-purple-600"
          }`}
        />
      </div>
      <div className="text-center">
        <h3 className={`text-lg font-semibold mb-2 ${textPrimary}`}>
          No Budget Categories
        </h3>
        <p className={` ${textSecondary}`}>
          Create budget categories to organize and track your spending
        </p>
      </div>
      {!allCategoriesAdded && (
        <Button
          className={`flex items-center gap-2  rounded-lg font-medium transition-all duration-200 `}
          onClick={() => {
            handleAddModelDetail();
            handleResetState();
          }}
        >
          <FaPlus />
          Add Category
        </Button>
      )}
    </div>
  );

  return (
    <div className="p-4 py-6">
      <BudgetArea
        handleModelOpen={handleAddModelDelete}
        setIsLoading={setIsLoading}
        loading={isLoading}
      />
      <div className="md:mt-6 mt-3">
        {budgetCategory?.length <= 0 ? (
          budgetExits ? (
            <></>
          ) : (
            renderNoCategoriesSection()
          )
        ) : (
          <div>
            <div className="flex items-center mb-4 justify-between">
              <h2 className={`text-2xl font-semibold ${textPrimary}`}>
                Categories
              </h2>
              {!allCategoriesAdded && (
                <Button
                  className={`md:flex hidden items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 `}
                  onClick={() => handleAddModelDetail()}
                >
                  <FaPlus /> Add Category
                </Button>
              )}
            </div>
            <div className="grid lg:grid-cols-2 2xl:grid-cols-3 grid-cols-1 gap-4">
              {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {budgetCategory.map((item: any) => (
                <SubCategory
                  key={item._id}
                  item={item}
                  loading={isLoading}
                  handleAddModelEditDetail={handleAddModelEditDetail}
                  handleAddModelDeleteDetail={handleAddModelDeleteDetail}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {modelOpen && (
        <Modal id={modelDetail.id} transactionId={modelDetail.transactionId} />
      )}
    </div>
  );
};

export default Budgets;
