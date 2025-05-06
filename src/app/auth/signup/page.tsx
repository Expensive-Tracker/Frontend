"use client";
import Text from "@/components/common/text";
import Link from "next/link";
import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { register } from "@/util/interface/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidationSchema } from "@/util/validation";
import InputAndLabel from "@/components/common/inputAndLabel";
import { handleRegister } from "@/util/api/apis/userApi";
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
  } = useForm<register>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(registerValidationSchema),
  });

  async function handleSubmitForm() {
    setErr(() => ({ errMsg: "", showErr: false }));
    const userData = getValues();
    const respond = await handleRegister(userData);
    console.log(respond);
    if (typeof respond !== "string") {
      delete respond.data.data.password;
      dispatch(handleSignIn(respond.data.data));
      localStorage.setItem("authToken", respond.data.token);
      dispatch(handleHydrateToken(respond.data.token));
      redirect("/");
    } else {
      setErr(() => ({ errMsg: respond, showErr: true }));
    }
  }

  return (
    <div className="flex sm:w-[450px] w-[320px] lg:w-[400px] xl:w-[450px] items-center flex-col justify-center">
      <Text
        Element="h2"
        style="xl:!text-[32px] text-[20px] md:text-[28px] leading-[24px]"
        text="Create an Account"
      />
      <h4 className="sm:text-base text-[12px] mt-3 opacity-70">
        Already have an account?{" "}
        <Link href={"/auth/signin"} className="text-[#7688C9]">
          {" "}
          Sign in here
        </Link>
      </h4>
      {err.showErr && (
        <p className="text-red-400 mt-3 text-base">{err.errMsg}</p>
      )}
      <div className=" lg:mt-[44px] w-full md:mt-[32px] mt-[26px] xl:mt-[81px] ">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
          <InputAndLabel
            register={register}
            errorMessage={errors?.username?.message}
            labelText="username"
            type="text"
            name="username"
            placeHolder="Enter Username"
          />
          <InputAndLabel
            register={register}
            errorMessage={errors?.email?.message}
            labelText="Email"
            type="email"
            name="email"
            divStyle="mt-6"
            placeHolder="Enter Email"
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
          <button className="block w-full bg-[#7688C9] md:mt-8 mt-4 text-black py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
