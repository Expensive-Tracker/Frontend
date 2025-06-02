"use client";
import BudgetArea from "@/components/common/Budgets";
import SubCategory from "@/components/common/subBudgets";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const Budgets = () => {
  const budgetCategory = useSelector(
    (state: RootState) => state.budget.category ?? []
  );
  return (
    <div className="p-4 py-6">
      <BudgetArea />
      <div className="mt-3">
        {budgetCategory?.length <= 0 ? <p>There are no Budget plan</p> : <></>}
        <SubCategory />
      </div>
    </div>
  );
};

export default Budgets;
