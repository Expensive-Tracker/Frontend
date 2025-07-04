"use client";
import Text from "@/components/common/text/text";
import Link from "next/link";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { logIn } from "@/util/interface/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "@/util/validation/authValidaion";
import { handleLogIn } from "@/util/api/apis/userApi";
import InputAndLabel from "@/components/common/input/inputAndLabel";
import { useDispatch, useSelector } from "react-redux";
import { handleHydrateToken, handleSignIn } from "@/store/slice/userSlice";
import { redirect } from "next/navigation";
import {
  handleChangeSplashFlag,
  handleShowSplashScreen,
} from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";

function Login() {
  const dispatch = useDispatch();
  const [err, setErr] = useState({
    showErr: false,
    errMsg: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) redirect("/");
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<logIn>({
    defaultValues: {
      userNameOrEmail: "",
      password: "",
    },
    resolver: yupResolver(loginValidationSchema),
  });

  async function handleSubmitForm() {
    setIsSubmitting(true);
    setErr(() => ({ errMsg: "", showErr: false }));
    const userData = getValues();
    const respond = await handleLogIn(userData);
    if (typeof respond !== "string") {
      delete respond.response.detail.password;
      dispatch(handleSignIn(respond.response.detail));
      localStorage.setItem("authToken", respond.response.token);
      dispatch(handleHydrateToken(respond.response.token));
      dispatch(handleChangeSplashFlag());
      dispatch(handleShowSplashScreen());
      setTimeout(() => {
        redirect("/");
      }, 1000);
    } else {
      setErr(() => ({ errMsg: respond, showErr: true }));
    }
    setIsSubmitting(false);
  }

  return (
    <div className="flex sm:w-[450px] w-[304px] lg:w-[400px] xl:w-[450px] items-center flex-col justify-center">
      <Text
        Element="h2"
        style="xl:!text-[32px] text-[20px] md:text-[28px] leading-[24px]"
        text="Sign in"
      />
      <h4 className="sm:text-base text-[12px] mt-3 opacity-70">
        Don&apos;t have an account yet?{" "}
        <Link href={"/auth/signup"} className="text-[#7688C9]">
          {" "}
          Create an account
        </Link>
      </h4>
      {err.showErr && (
        <p className="text-red-400 mt-3 text-base">{err.errMsg}</p>
      )}
      <div className=" lg:mt-[38px] w-full md:mt-[32px] mt-[26px]">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
          <InputAndLabel
            register={register}
            errorMessage={errors?.userNameOrEmail?.message}
            labelText="Email or Username"
            type="text"
            name="userNameOrEmail"
            placeHolder="Enter Email or Username"
          />
          <InputAndLabel
            register={register}
            errorMessage={errors?.password?.message}
            labelText="Password"
            isPass={true}
            divStyle="mt-6"
            name="password"
            placeHolder="Enter Password"
          />
          <div className="text-right mt-2">
            <Link
              href="/auth/forgotPassword/emailVerification"
              className=" opacity-70 text-sm "
            >
              Forgot password?
            </Link>
          </div>
          <button
            className="flex items-center justify-center gap-2 w-full bg-[#7688C9] md:mt-5 mt-4 text-white py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg
                aria-hidden="true"
                className={`inline w-4 h-4  animate-spin  ${
                  theme === "dark"
                    ? "text-gray-200 fill-gray-600"
                    : "fill-gray-300 text-gray-600"
                }`}
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
