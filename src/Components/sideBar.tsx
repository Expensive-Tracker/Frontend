import React, { useEffect } from "react";
import Text from "./common/text/text";
import navItem from "@/util/constant/navItem";
import { navItemInterface } from "@/util/interface/props";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  handleHoverIn,
  handleHoverOut,
  handleMobileMenuOpen,
  handleOpenAndClose,
} from "@/store/slice/uiSlice";
import { usePathname } from "next/navigation";
import { BiWalletAlt } from "react-icons/bi";

const SideBar = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const uiData = useSelector((state: RootState) => state.uiSlice.sidebar);
  const pathname = usePathname();
  const dispatch = useDispatch();
  useEffect(() => {
    if (uiData.mobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [uiData.mobileOpen]);

  const handleShowMenu = () => {
    dispatch(handleOpenAndClose());
  };

  const sidebarWidth =
    uiData.isOpen || uiData.isHovered ? "w-[220px]" : "w-[60px]";

  return (
    <nav>
      <div
        onMouseEnter={() => {
          dispatch(handleHoverIn());
        }}
        onMouseLeave={() => {
          dispatch(handleHoverOut());
        }}
        className={`fixed hidden lg:block ${sidebarWidth} z-50 left-0 top-0 h-full  ${
          theme === "dark" ? "bg-[#1B1C21]" : "bg-white"
        } border-r border-collapse lg:block hidden border-r-[#27282E] transition-all `}
      >
        <div
          className={`px-6 py-1 pb-2.5 ${
            uiData.isOpen || uiData.isHovered ? "" : " mt-4 pl-4.5 py-[5px]"
          }  flex items-start border-b border-b-[#27282E]  flex-col gap-0 relative`}
        >
          <div className={`flex items-center gap-2 `}>
            <BiWalletAlt size={25} />
            {uiData.isOpen || uiData.isHovered ? (
              <div>
                <Text Element="h2" text="Expense" style="font-bold" />
                <Text
                  Element="p"
                  text="Tracker"
                  style="font-light -mt-1.5"
                  isDes
                />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div
            className={`absolute  ${
              uiData.isOpen || uiData.isHovered ? "top-[12px]" : "top-0"
            } hidden -right-4 lg:block cursor-pointer z-50 transition-all p-2 shadow rounded-full ${
              uiData.isOpen ? "rotate-0" : "rotate-180"
            } ${theme === "dark" ? "bg-[#27282E]" : "bg-white"} `}
            onClick={handleShowMenu}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 256 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path>
            </svg>
          </div>
        </div>
        <div className={`px-3 py-4 h-full overflow-y-hidden`}>
          <ul className="flex items-start gap-2.5 flex-col">
            {navItem.map((item: navItemInterface) => {
              const isExpanded = uiData.isOpen || uiData.isHovered;
              const isActive = pathname === item.path;

              const commonClasses = `flex items-center gap-2 text-base focus:outline-none ${
                isExpanded ? "py-3 px-3" : "py-3 px-2"
              } rounded-md transition-all cursor-pointer w-full ${
                isActive
                  ? theme === "dark"
                    ? "text-white bg-[#27282E] shadow shadow-[#27282E]"
                    : "bg-black text-white shadow shadow-[#27282E]"
                  : theme === "dark"
                  ? "hover:text-white hover:bg-[#27282E] hover:shadow hover:shadow-[#27282E]"
                  : "hover:bg-black hover:text-white hover:shadow hover:shadow-[#27282E]"
              }`;

              if (isExpanded) {
                return (
                  <li key={item.id} className={commonClasses}>
                    <span className="!text-xl">{item.icon}</span>
                    <Link href={item.path}>{item.navName}</Link>
                  </li>
                );
              } else {
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    className={commonClasses}
                  >
                    <span className="!text-xl">{item.icon}</span>
                  </Link>
                );
              }
            })}
          </ul>
        </div>
      </div>
      {/* mobile */}

      <div
        className={`fixed lg:hidden inset-0 z-[1000] grid grid-cols-[220px_auto] top-[59px] md:top-[67px] transition-transform duration-300 ${
          uiData.mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar */}
        <div
          className={`h-full shadow z-[100] ${
            theme === "dark" ? "bg-[#1B1C21]" : "bg-white"
          }`}
        >
          <div className="px-3 py-4 h-full">
            <ul className="flex items-start gap-5 flex-col">
              {navItem.map((item: navItemInterface) => {
                const isActive = pathname === item.path;

                const commonClasses = `flex items-center w-full gap-2 text-base focus:outline-none py-3 px-3 rounded-md transition-all cursor-pointer ${
                  isActive
                    ? theme === "dark"
                      ? "text-white bg-[#27282E] shadow shadow-[#27282E]"
                      : "bg-black text-white shadow shadow-[#27282E]"
                    : theme === "dark"
                    ? "hover:text-white hover:bg-[#27282E] hover:shadow hover:shadow-[#27282E]"
                    : "hover:bg-black hover:text-white hover:shadow hover:shadow-[#27282E]"
                }`;

                return (
                  <Link
                    href={item.path}
                    key={item.id}
                    className={commonClasses}
                    onClick={() => dispatch(handleMobileMenuOpen())}
                  >
                    <span className="!text-xl">{item.icon}</span>
                    <span>{item.navName}</span>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Backdrop */}
        <div
          onClick={() => dispatch(handleMobileMenuOpen())}
          className={`h-full bg-black/20 backdrop-blur-sm z-[50] transition-opacity duration-300 ${
            uiData.mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      </div>
    </nav>
  );
};

export default SideBar;
