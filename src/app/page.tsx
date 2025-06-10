"use client";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

export default function Home() {
  const isNew = useSelector((state: RootState) => state.user.isNew.remain);

  if (isNew.budgets || isNew.transaction) return <></>;
  return <div className="p-4 py-6">hello</div>;
}
