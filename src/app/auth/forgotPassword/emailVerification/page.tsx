"use client";
import InputAndLabel from "@/components/common/inputAndLabel";
import Text from "@/components/common/text";
import { handleEmailVerification } from "@/util/api/apis/userApi";
import { emailValidation } from "@/util/interface/auth";
import { emailValidationSchema } from "@/util/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

function EmailValidation() {
  const [err, setErr] = useState({
    showErr: false,
    errMsg: "",
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<emailValidation>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(emailValidationSchema),
  });

  async function handleSubmitForm() {
    setErr(() => ({ showErr: false, errMsg: "" }));
    const userData = getValues();
    const respond = await handleEmailVerification(userData);
    if (typeof respond !== "string") {
      localStorage.setItem("email", userData.email);
      localStorage.setItem("OtpToken", respond.otpToken);
      redirect("/auth/forgotPassword/otp");
    } else {
      setErr(() => ({ errMsg: respond, showErr: true }));
    }
  }

  return (
    <div className="flex sm:w-[450px] w-[320px] lg:w-[400px] xl:w-[450px] items-center flex-col justify-center">
      <Text
        Element="h2"
        style="xl:!text-[32px] text-[20px] md:text-[28px] leading-[24px]"
        text="Verify Email"
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
      <div className=" mt-[20px] w-full">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
          <InputAndLabel
            register={register}
            errorMessage={errors?.email?.message}
            labelText="Email"
            type="email"
            name="email"
            divStyle="mt-6"
            placeHolder="Enter Email"
          />
          <button className="block w-full bg-[#7688C9] md:mt-8 mt-4 text-black py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all">
            Send Otp
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailValidation;
