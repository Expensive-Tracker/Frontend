export interface Transaction {
  _id: string | number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date | string;
  isRecurring: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface bodyTransaction {
  _id: string | number;
  filter?: {
    date: {
      startDate: string;
      endDate: string;
    };
    type: string;
    category: string;
  };
}
