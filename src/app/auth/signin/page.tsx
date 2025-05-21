"use client";
import Text from "@/components/common/text";
import Link from "next/link";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { logIn } from "@/util/interface/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidationSchema } from "@/util/validation";
import { handleLogIn } from "@/util/api/apis/userApi";
import InputAndLabel from "@/components/common/inputAndLabel";
import { useDispatch } from "react-redux";
import { handleHydrateToken, handleSignIn } from "@/store/slice/userSlice";
import { redirect } from "next/navigation";

function Login() {
  const dispatch = useDispatch();
  const [err, setErr] = useState({
    showErr: false,
    errMsg: "",
  });

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
    setErr(() => ({ errMsg: "", showErr: false }));
    const userData = getValues();
    const respond = await handleLogIn(userData);
    if (typeof respond !== "string") {
      delete respond.response.detail.password;
      dispatch(handleSignIn(respond.response.detail));
      localStorage.setItem("authToken", respond.response.token);
      dispatch(handleHydrateToken(respond.response.token));
      redirect("/");
    } else {
      setErr(() => ({ errMsg: respond, showErr: true }));
    }
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
          <button className="block w-full bg-[#7688C9] md:mt-5 mt-4 text-white py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
