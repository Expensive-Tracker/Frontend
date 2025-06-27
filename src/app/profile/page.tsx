"use client";

import { RootState } from "@/store/store";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import Modal from "@/components/common/modal/modal";
import { handleOpenAndCloseModal } from "@/store/slice/uiSlice";

const Page = () => {
  const userDetail = useSelector((state: RootState) => state.user.userDetail);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const modelOpen = useSelector(
    (state: RootState) => state.uiSlice.modal.isOpen
  );
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState(false);
  const [modal, setModal] = useState({
    id: "",
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const hover =
    theme === "dark"
      ? " hover:bg-black border border-white/20"
      : "hover:bg-[#27282E] border border-[#1B1C21] hover:text-white";
  const menuBg = theme === "dark" ? "bg-zinc-800" : "bg-white";
  const menuShadow =
    theme === "dark"
      ? "shadow-2xl shadow-black/20"
      : "shadow-xl shadow-gray-300/20";

  return (
    <div className={`py-10 px-6 md:px-20`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${textPrimary}`}>Profile</h1>

          <div className="relative">
            <button
              className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${hover}`}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <BsThreeDots className={`w-4 h-4 ${textSecondary}`} />
            </button>

            <div
              ref={menuRef}
              className={`absolute right-0 top-12 ${menuBg} ${menuShadow} rounded-lg overflow-hidden z-10 min-w-[120px] transition-all duration-300 ease-in-out transform ${
                showMenu
                  ? "opacity-100 scale-100 pointer-events-auto"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              <button
                className={`w-full px-4 transition-all py-3 flex rounded-t-lg cursor-pointer items-center gap-3 ${textSecondary} ${hover}`}
                onClick={() => {
                  setModal(() => ({
                    id: "edit_user",
                  }));
                  dispatch(handleOpenAndCloseModal());
                }}
              >
                <FaRegEdit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <div className="h-px bg-gray-300/20 dark:bg-white/10"></div>
              <button
                className={`w-full px-4 transition-all py-3 flex rounded-b-lg cursor-pointer items-center gap-3 text-red-600 ${hover}`}
                onClick={() => {
                  setModal(() => ({
                    id: "delete_user",
                  }));
                  dispatch(handleOpenAndCloseModal());
                }}
              >
                <MdDelete className="w-4 h-4" />
                <span className="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl p-6 shadow-md border border-${
            theme === "dark" ? "white/20" : "black/20"
          }`}
        >
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 relative rounded-full overflow-hidden border border-gray-300">
              {userDetail?.profilePic ? (
                <Image
                  src={userDetail.profilePic}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center text-xl font-semibold ${textSecondary}`}
                >
                  {userDetail?.username?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div>
              <p className={`text-xl font-semibold ${textPrimary}`}>
                {userDetail?.username || "Username"}
              </p>
              <p className={`text-sm ${textSecondary}`}>
                Member since{" "}
                {new Date(userDetail?.createdAt || "").toLocaleDateString() ||
                  "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className={`text-sm ${textSecondary}`}>Email</p>
              <p className={`text-lg font-medium ${textPrimary}`}>
                {userDetail?.email || "N/A"}
              </p>
            </div>

            <div>
              <p className={`text-sm ${textSecondary}`}>Last Profile Updated</p>
              <p className={`text-lg ${textPrimary}`}>
                {userDetail?.updatedAt
                  ? new Date(userDetail.updatedAt).toLocaleDateString() +
                    ", " +
                    new Date(userDetail.updatedAt).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
      {modelOpen && <Modal id={modal.id} />}
    </div>
  );
};

export default Page;
