"use client";

import { redirect } from "next/navigation";

export default function Home() {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    redirect("/auth/signin");
  }
  return <div className="p-4 py-6">hello</div>;
}
