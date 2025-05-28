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
import { useRouter } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { handleMobileMenuOpen } from "@/store/slice/uiSlice";
import Image from "next/image";

function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userData = useSelector((state: RootState) => state.user.userDetail);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const dispatch = useDispatch();
  const router = useRouter();

  function handleShowUserMenu() {
    setUserMenuOpen((pre) => !pre);
  }

  function handleChangeTheme() {
    dispatch(handleThemeChange());
  }

  function handleLogOut() {
    dispatch(handleUserSignOut());
    localStorage.removeItem("authToken");
    localStorage.removeItem("OtpToken");
    localStorage.removeItem("email");
    localStorage.removeItem("correctOtpToken");
    setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);
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
      className={`w-full fixed top-0 z-50 border-b border-b-[#27282E] flex items-center lg:justify-end justify-between px-6 py-3 shadow ${
        theme === "dark" ? "bg-[#1B1C21]" : "bg-white"
      }`}
    >
      <div
        className="p-2 rounded-md hover:bg-[#27282E] cursor-pointer border border-[#27282E] transition-all hover:!text-white lg:hidden"
        onClick={() => dispatch(handleMobileMenuOpen())}
      >
        <HiOutlineMenuAlt1 />
      </div>
      <div className="flex items-center gap-4 ">
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

        <div ref={userMenuRef} className="relative cursor-pointer">
          <div
            className="flex items-center gap-1.5"
            onClick={handleShowUserMenu}
          >
            {userData?.profilePic ? (
              <Image
                src={userData?.profilePic}
                className="object-cover rounded-4xl w-8 h-8"
                alt="Avatar"
              />
            ) : (
              <RxAvatar className="w-8 h-8" />
            )}

            <span className="hidden md:inline">{userData.username}</span>
            <IoIosArrowDown />
          </div>
          <div
            className={`absolute md:left-0 left-[-80px] top-[42px] md:top-[37px] z-10 w-[150px] rounded-b-md shadow-2xl px-8 py-3 flex flex-col items-start
              transition-all duration-300 ease-in-out transform origin-top ${
                userMenuOpen
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              } ${theme === "dark" ? "bg-black" : "bg-white"}`}
          >
            <p className="mt-2 flex items-center gap-2">
              <RxAvatar size={18} />
              Profile
            </p>
            <p className="mt-2 flex items-center gap-2" onClick={handleLogOut}>
              <CiLogout scale={18} />
              Log out
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
