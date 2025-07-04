"use client";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { RxAvatar } from "react-icons/rx";
import { IoIosArrowDown, IoMdMoon } from "react-icons/io";
import { handleThemeChange } from "@/store/slice/themeSlice";
import { useState, useEffect, useRef } from "react";
import { CiLogout } from "react-icons/ci";
import { MdOutlineWbSunny } from "react-icons/md";
import { handleUserSignOut } from "@/store/slice/userSlice";
import { redirect, usePathname } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { handleMobileMenuOpen } from "@/store/slice/uiSlice";
import Text from "./common/text/text";
import { BiWalletAlt } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { showSuccessToast } from "@/util/services/toast";

function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userDetail);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const pathname = usePathname();
  const isProfilePage = pathname.includes("/profile");

  const dispatch = useDispatch();

  function handleShowUserMenu() {
    setUserMenuOpen((pre) => !pre);
  }

  function handleChangeTheme() {
    dispatch(handleThemeChange());
  }

  function handleLogOut() {
    dispatch(handleUserSignOut());
    localStorage.clear();
    showSuccessToast("Logout successful ");
    redirect("/auth/signin");
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className={`w-full fixed top-0 z-50 border-b border-b-[#27282E] flex items-center lg:justify-end justify-between px-6 py-3 shadow  ${
        theme === "dark" ? "bg-[#1B1C21]" : "bg-white"
      }`}
    >
      <div
        className="p-2 rounded-md hover:bg-[#27282E] cursor-pointer border border-[#27282E] transition-all hover:!text-white lg:hidden"
        onClick={() => dispatch(handleMobileMenuOpen())}
      >
        <HiOutlineMenuAlt1 />
      </div>
      <div className={`flex items-center gap-2 lg:hidden `}>
        <BiWalletAlt size={25} />
        <div>
          <Text Element="h2" text="Expense" style="font-bold" />
          <Text Element="p" text="Tracker" style="font-light -mt-1.5" isDes />
        </div>
      </div>
      <div
        className={`flex items-center sm:gap-4 gap-2 ${
          isProfilePage ? "py-1" : ""
        }`}
      >
        {theme === "dark" ? (
          <MdOutlineWbSunny
            size={24}
            className="cursor-pointer"
            onClick={handleChangeTheme}
          />
        ) : (
          <IoMdMoon
            size={24}
            className="cursor-pointer"
            onClick={handleChangeTheme}
          />
        )}
        {isProfilePage ? (
          <p
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogOut}
          >
            <CiLogout scale={18} size={24} />
            <span className="sm:block hidden">Log out</span>
          </p>
        ) : (
          <>
            <div ref={userMenuRef} className="relative cursor-pointer">
              <div
                className="flex items-center gap-1.5"
                onClick={handleShowUserMenu}
              >
                {userData?.profilePic ? (
                  <div className="w-8 h-8 relative rounded-full overflow-hidden">
                    <Image
                      src={userData?.profilePic}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="32px"
                      priority
                    />
                  </div>
                ) : (
                  <RxAvatar className="w-8 h-8" />
                )}

                <span className="hidden lg:inline ">{userData.username}</span>
                <IoIosArrowDown />
              </div>
              <div
                className={`absolute lg:-left-2 left-[-80px] lg:top-[45px] top-[46px] md:top-[50px] z-10 w-[150px] rounded-b-md shadow-2xl px-8 py-3  flex-col items-start
              transition-all duration-300 ease-in-out transform origin-top   ${
                userMenuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              } ${
                  theme === "dark"
                    ? "bg-[#1B1C21] border-r border-white border-b border-l"
                    : "bg-white"
                }`}
              >
                <Link
                  href="/profile"
                  className="mt-2 cursor-pointer flex items-center gap-2"
                  onClick={handleShowUserMenu}
                >
                  <RxAvatar size={18} />
                  Profile
                </Link>
                <p
                  className="mt-2 flex items-center cursor-pointer gap-2"
                  onClick={() => {
                    handleLogOut();
                    handleShowUserMenu();
                  }}
                >
                  <CiLogout scale={18} />
                  Log out
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
