"use client";
import BudgetArea from "@/components/common/Budgets";
import Button from "@/components/common/button/button";
import Modal from "@/components/common/modal/modal";
import SubCategory from "@/components/common/subBudgets";
import { handleOpenAndCloseModal } from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const Budgets = () => {
  const [modelDetail, setModalDetail] = useState<{
    id: "add_subBudget" | "edit_subBudget" | "delete_subBudget";
    transactionId: string;
  }>({
    id: "add_subBudget",
    transactionId: "",
  });
  const dispatch = useDispatch();
  const budgetCategory = useSelector(
    (state: RootState) => state.budget.category ?? []
  );
  const modelOpen = useSelector(
    (state: RootState) => state.uiSlice.modal.isOpen
  );

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

  return (
    <div className="p-4 py-6">
      <BudgetArea />
      <div className="md:mt-6 mt-3">
        {budgetCategory?.length <= 0 ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2 className="text-xl">There are no Budget plan</h2>
            <Button
              className="md:flex hidden items-center gap-2"
              onClick={() => handleAddModelDetail()}
            >
              <FaPlus /> Add Category
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4 justify-between">
              <h2 className="text-2xl">Category</h2>
              <Button
                className="md:flex hidden items-center gap-2"
                onClick={() => handleAddModelDetail()}
              >
                <FaPlus /> Add Category
              </Button>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              {/*  eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {budgetCategory.map((item: any) => (
                <SubCategory
                  key={item._id}
                  item={item}
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
