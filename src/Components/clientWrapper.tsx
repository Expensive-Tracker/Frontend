"use client";
import { imagePath } from "@/util/constant/imagePath";
import Image from "next/image";
import Text from "./common/text";
import { IoMdCheckmark, IoMdMoon } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Header from "./header";
import { MdOutlineWbSunny } from "react-icons/md";
import { handleThemeChange } from "@/store/slice/themeSlice";
import SideBar from "./sideBar";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = useSelector((state: RootState) => state.user.token);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const uiSideBar = useSelector((state: RootState) => state.uiSlice.sidebar);
  const dispatch = useDispatch();
  function handleChangeTheme() {
    dispatch(handleThemeChange());
  }
  return (
    <div
      className={`${
        theme === "dark"
          ? "dark:bg-[#1B1C21] dark:text-white"
          : "bg-white  text-black"
      } transition-all h-screen`}
    >
      {authToken !== "" || window.location.href.includes("imageUpload") ? (
        <div className="relative">
          {!window.location.href.includes("imageUpload") && <Header />}
          {!window.location.href.includes("imageUpload") && <SideBar />}
          <div
            className={` ml-auto p-6
              ${
                uiSideBar.isOpen || uiSideBar.isHovered
                  ? "w-[calc(100%_-_220px)]"
                  : "w-[calc(100%_-_60px)]"
              }
              `}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 relative items-center justify-center lg:grid-cols-2 h-screen ">
          <div
            className={`absolute md:bottom-6 lg:right-10 p-3 rounded-full text-black hover:bg-gray-200 transition-all bg-white shadow-md bottom-4 right-4 md:right-6  ${
              theme === "dark" ? "shadow-white" : "shadow-gray-700"
            } cursor-pointer`}
            onClick={handleChangeTheme}
          >
            {theme === "dark" ? (
              <MdOutlineWbSunny size={24} />
            ) : (
              <IoMdMoon size={24} />
            )}
          </div>
          <div className="  h-screen bg-[#15161A] hidden lg:block !text-white">
            <div className="justify-center gap-12 flex flex-col items-center w-[381px] m-auto h-screen">
              <Image
                src={imagePath.authBanner}
                alt="auth banner"
                width={307}
                height={214}
              />
              <Text
                Element="h2"
                text="One app for any financial journey"
                style="lg:!text-2xl"
              />
              <div className="flex flex-col gap-4 xl:gap-8 ">
                <div className="flex items-start gap-3 xl:gap-4 ">
                  <div>
                    <IoMdCheckmark size={24} height={24} color="#4CAF50" />
                  </div>
                  <div>
                    <Text
                      Element="h4"
                      text="All-in-one tool"
                      isDes={false}
                      style="mb-1 !text-base"
                    />
                    <Text
                      text="View and organize your finances all in one place
and build your future with smarter wealth management"
                      style="opacity-70 !text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 xl:gap-4 ">
                  <div>
                    <IoMdCheckmark size={24} height={24} color="#4CAF50" />
                  </div>
                  <div>
                    <Text
                      Element="h4"
                      text="Secure and bank-grade encryption"
                      isDes={false}
                      style="mb-1 !text-base"
                    />
                    <Text
                      text="Your financial data is tokenized and masked with the latest Finch security. with end-to-end encryption and data privacy vaults"
                      style="opacity-70 !text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center h-screen items-center">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
