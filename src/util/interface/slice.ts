export interface userSliceState {
  userDetail: {
    username: string;
    email: string;
    password?: string;
    profilePic?: string;
    createdAt?: string;
    _id: string;
    updatedAt?: string;
    confirmPassword?: string;
  };
  token: string;
  isNew: {
    new: boolean;
    remain: {
      budgets?: boolean;
      transaction?: boolean;
    };
  };
}

export interface themeSliceState {
  theme: "dark" | "light";
}

export interface uiSliceState {
  sidebar: {
    isHovered: boolean;
    mobileOpen: boolean;
    isOpen: boolean;
  };
  splashScreen: boolean;
  splashFlag: boolean;
  refetch: boolean;
  modal: {
    isOpen: boolean;
  };
}

export interface BudgetTransaction {
  totalSpent: number;
  totalRemain: number;
}

export interface SubBudget {
  categoryName: string;
  subBudgetAmount: number;
  budgetTransaction: BudgetTransaction;
  spentPercentage?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  _id?: string;
  budgetAmount: number;
  category?: SubBudget[];
  month: string;
  totalSpent?: number;
  totalRemain?: number;
  createdAt?: string;
  updatedAt?: string;
}
