"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Button from "@/components/common/button/button";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isDark = theme === "dark";
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  });

  return (
    <div
      className={`relative  h-screen overflow-hidden flex flex-col items-center justify-center text-center px-2 md:px-0 ${
        isDark ? "bg-[#1B1C21] text-white" : "bg-white text-black"
      }`}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        height="158"
        viewBox="0 0 472 158"
        fill="none"
      >
        <rect
          x="203.103"
          y="41.7015"
          width="22.1453"
          height="20.7141"
          rx="2.63433"
          fill="#465FFF"
          stroke="#465FFF"
          strokeWidth="0.752667"
        />
        <rect
          x="246.752"
          y="41.7015"
          width="22.1453"
          height="20.7141"
          rx="2.63433"
          fill="#465FFF"
          stroke="#465FFF"
          strokeWidth="0.752667"
        />
        <rect
          x="258.201"
          y="98.2303"
          width="22.1453"
          height="20.7141"
          rx="2.63433"
          fill="#465FFF"
          stroke="#465FFF"
          strokeWidth="0.752667"
        />
        <rect
          x="191.654"
          y="98.2303"
          width="22.1453"
          height="20.7141"
          rx="2.63433"
          fill="#465FFF"
          stroke="#465FFF"
          strokeWidth="0.752667"
        />
        <rect
          x="207.396"
          y="82.847"
          width="57.5655"
          height="20.7141"
          rx="2.63433"
          fill="#465FFF"
          stroke="#465FFF"
          strokeWidth="0.752667"
        />
        <rect
          x="152.769"
          y="15.167"
          width="166.462"
          height="130.311"
          rx="28"
          stroke="#465FFF"
          strokeWidth="24"
        />
        <rect
          x="0.0405273"
          y="0.522461"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          fill="#465FFF"
        />
        <rect
          x="0.0405273"
          y="0.522461"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          stroke="#465FFF"
        />
        <rect
          x="75.8726"
          y="3.16748"
          width="32.6255"
          height="154.31"
          rx="6.26271"
          fill="#465FFF"
        />
        <rect
          x="75.8726"
          y="3.16748"
          width="32.6255"
          height="154.31"
          rx="6.26271"
          stroke="#465FFF"
        />
        <rect
          x="16.7939"
          y="91.3442"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          transform="rotate(-90 16.7939 91.3442)"
          fill="#465FFF"
        />
        <rect
          x="16.7939"
          y="91.3442"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          transform="rotate(-90 16.7939 91.3442)"
          stroke="#465FFF"
        />
        <rect
          x="363.502"
          y="0.522461"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          fill="#465FFF"
        />
        <rect
          x="363.502"
          y="0.522461"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          stroke="#465FFF"
        />
        <rect
          x="439.334"
          y="3.16748"
          width="32.6255"
          height="154.31"
          rx="6.26271"
          fill="#465FFF"
        />
        <rect
          x="439.334"
          y="3.16748"
          width="32.6255"
          height="154.31"
          rx="6.26271"
          stroke="#465FFF"
        />
        <rect
          x="380.255"
          y="91.3442"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          transform="rotate(-90 380.255 91.3442)"
          fill="#465FFF"
        />
        <rect
          x="380.255"
          y="91.3442"
          width="32.6255"
          height="77.5957"
          rx="6.26271"
          transform="rotate(-90 380.255 91.3442)"
          stroke="#465FFF"
        />
      </svg>
      <p className="mt-4 text-base sm:text-lg max-w-sm text-center">
        We can’t seem to find the page you are looking for!
      </p>

      <Button
        className={`flex items-center gap-2 px-4 py-2 mt-2 rounded-lg font-medium transition-all duration-200`}
        onClick={() => (token ? redirect("/") : redirect("/auth/signin"))}
      >
        Go to home
      </Button>
    </div>
  );
}
