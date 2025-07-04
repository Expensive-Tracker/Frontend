"use client";
import { imagePath } from "@/util/constant/imagePath";
import Image from "next/image";
import Text from "./common/text/text";
import { IoMdCheckmark, IoMdMoon } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Header from "./header";
import { MdOutlineWbSunny } from "react-icons/md";
import { handleThemeChange } from "@/store/slice/themeSlice";
import SideBar from "./sideBar";
import { useEffect, useState } from "react";
import SplashScreen from "./splashScreen";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import navItem, { authPath } from "@/util/constant/navItem";
import { usePathname } from "next/navigation";

const noSidebarOrHeaderPaths = ["/profile"];

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const authToken = useSelector((state: RootState) => state.user.token);
  const pathname = usePathname();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const [, forUpdate] = useState<number>(0);
  const uiSideBar = useSelector((state: RootState) => state.uiSlice.sidebar);
  const splashScreen = useSelector(
    (state: RootState) => state.uiSlice.splashScreen
  );
  const navPaths = navItem.map((item) => item.path);
  const isDashboardPath = navPaths.includes(pathname);
  const isAuthPath = authPath.includes(pathname);
  const isNoLayoutPath = noSidebarOrHeaderPaths.includes(pathname);

  const splashFlag = useSelector(
    (state: RootState) => state.uiSlice.splashFlag
  );
  const dispatch = useDispatch();

  function handleChangeTheme() {
    dispatch(handleThemeChange());
  }

  useEffect(() => {
    forUpdate((n) => n + 1);
  }, [splashFlag]);

  useEffect(() => {
    function colorBodyChange() {
      const body = document.body;
      body.classList.remove(
        "dark:bg-[#1B1C21]",
        "dark:text-white",
        "bg-white",
        "text-black"
      );

      if (theme === "dark") {
        body.classList.add("dark:bg-[#1B1C21]", "dark:text-white");
      } else {
        body.classList.add("bg-white", "text-black");
      }
    }

    colorBodyChange();
  }, [theme]);

  if (!isDashboardPath && !isAuthPath && !isNoLayoutPath) {
    return <>{children}</>;
  }
  return (
    <div className={`h-full transition-all`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={(context) => {
          const toastType = context?.type;
          return `rounded-lg px-5 mb-2 flex item center  py-4 pl-2 shadow-md border text-sm ${
            theme === "dark"
              ? "bg-[#1E1F25] text-white border-gray-700"
              : "bg-white text-gray-800 border-gray-200"
          } ${
            toastType === "success"
              ? "border-green-500"
              : toastType === "error"
              ? "border-red-500"
              : "border-blue-500"
          }`;
        }}
        progressClassName={`!h-1 ${
          theme === "dark" ? "bg-green-400" : "bg-green-500"
        }`}
        theme={theme === "dark" ? "dark" : "light"}
      />

      {authToken !== "" || window.location.href.includes("imageUpload") ? (
        splashScreen ? (
          <div className="h-screen flex items-center justify-center">
            <SplashScreen />
          </div>
        ) : (
          <div className="relative">
            {!window.location.href.includes("imageUpload") && <Header />}
            {!window.location.href.includes("imageUpload") && <SideBar />}
            <div
              className={`mt-[65px] max-w-[1920px] mx-auto ${
                uiSideBar.isOpen || uiSideBar.isHovered
                  ? "lg:pl-[220px]"
                  : "lg:pl-[60px]"
              }`}
            >
              {children}
            </div>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 relative items-center justify-center lg:grid-cols-2 h-full">
          <div
            className={`absolute md:bottom-6 lg:right-10 p-3 rounded-full text-black hover:bg-gray-200 transition-all bg-white shadow-md bottom-4 right-4 md:right-6 ${
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
          <div className="h-screen bg-[#15161A] hidden lg:block !text-white">
            <div className="justify-center gap-12 flex flex-col items-center w-[381px] m-auto h-full">
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
                  <IoMdCheckmark size={24} height={24} color="#4CAF50" />
                  <div>
                    <Text
                      Element="h4"
                      text="All-in-one tool"
                      isDes={false}
                      style="mb-1 !text-base"
                    />
                    <Text
                      text="View and organize your finances all in one place and build your future with smarter wealth management"
                      style="opacity-70 !text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-start gap-3 xl:gap-4 ">
                  <IoMdCheckmark size={24} height={24} color="#4CAF50" />
                  <div>
                    <Text
                      Element="h4"
                      text="Secure and bank-grade encryption"
                      isDes={false}
                      style="mb-1 !text-base"
                    />
                    <Text
                      text="Your financial data is tokenized and masked with the latest Finch security. with end-to-end encryption and data privacy vaults"
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
