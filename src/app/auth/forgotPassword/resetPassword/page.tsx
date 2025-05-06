"use client";
import InputAndLabel from "@/components/common/inputAndLabel";
import Text from "@/components/common/text";
import { handleResetPassword } from "@/util/api/apis/userApi";
import { password } from "@/util/interface/auth";
import { passwordValidationSchema } from "@/util/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function ResetPassword() {
  const [isPasswordChange, setIsPasswordChange] = useState<boolean>(false);
  const [err, setErr] = useState({
    showErr: false,
    errMsg: "",
  });

  useEffect(() => {
    localStorage.removeItem("OtpToken");
    const otpToken = localStorage.getItem("correctOtpToken");
    if (!otpToken) {
      console.log("err");
      redirect("/auth/forgotPassword/emailVerification");
    }
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<password>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(passwordValidationSchema),
  });

  function handleClearStorage() {
    localStorage.removeItem("correctOtpToken");
  }

  async function handleSubmitForm() {
    setErr(() => ({ showErr: false, errMsg: "" }));
    const { password } = getValues();
    const userEmail = localStorage.getItem("email");
    const userData = {
      email: userEmail || "",
      password,
    };
    const respond = await handleResetPassword(userData);
    if (typeof respond !== "string") {
      localStorage.removeItem("email");
      setIsPasswordChange(true);
    } else {
      setIsPasswordChange(false);
      setErr(() => ({ errMsg: respond, showErr: true }));
    }
  }

  return isPasswordChange ? (
    <div className="flex sm:w-[450px] w-[320px] lg:w-[400px] xl:w-[450px] items-center flex-col justify-center">
      <Text
        Element="h2"
        style="xl:!text-[32px] text-[20px] md:text-[28px] leading-[24px]"
        text="Password Change Successfully"
      />
      <h4 className="sm:text-base text-[12px] mt-3 opacity-70">
        Please try signing in again{" "}
        <Link
          href="/auth/signin"
          className="text-[#7688C9]"
          onClick={() => handleClearStorage()}
        >
          Sign in here
        </Link>
      </h4>
    </div>
  ) : (
    <div className="flex sm:w-[450px] w-[320px] lg:w-[400px] xl:w-[450px] items-center flex-col justify-center">
      <Text
        Element="h2"
        style="xl:!text-[32px] text-[20px] md:text-[28px] leading-[24px]"
        text="Otp For Reset Password"
      />
      <h4 className="sm:text-base text-[12px] mt-3 opacity-70">
        Otp sended on email
      </h4>
      {err.showErr && (
        <p className="text-red-400 mt-3 text-base">{err.errMsg}</p>
      )}
      <div className=" mt-[20px] w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
          <InputAndLabel
            register={register}
            errorMessage={errors?.password?.message}
            labelText="Password"
            name="password"
            isPass
            inputStyle="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            divStyle="mt-6"
            placeHolder="Enter Password"
          />
          <InputAndLabel
            register={register}
            errorMessage={errors?.confirmPassword?.message}
            labelText="Confirm Password"
            isPass
            name="confirmPassword"
            inputStyle="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            divStyle="mt-6"
            placeHolder="Re-enter Password"
          />
          <button className="block w-full bg-[#7688C9] md:mt-8 mt-4 text-black py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
