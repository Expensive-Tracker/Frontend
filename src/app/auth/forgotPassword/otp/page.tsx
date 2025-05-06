"use client";
import InputAndLabel from "@/components/common/inputAndLabel";
import Text from "@/components/common/text";
import { handleOtpVerification } from "@/util/api/apis/userApi";
import { otp } from "@/util/interface/auth";
import { otpValidationSchema } from "@/util/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function Otp() {
  const [err, setErr] = useState({
    showErr: false,
    errMsg: "",
  });

  useEffect(() => {
    const otpToken = localStorage.getItem("OtpToken");
    if (!otpToken) {
      redirect("/auth/forgotPassword/emailVerification");
    }
  });

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<otp>({
    defaultValues: {
      otp: 0,
    },
    resolver: yupResolver(otpValidationSchema),
  });

  async function handleSubmitForm() {
    setErr(() => ({ showErr: false, errMsg: "" }));
    const { otp } = getValues();
    const userEmail = localStorage.getItem("email");
    const userData = {
      email: userEmail || "",
      otp,
    };
    const respond = await handleOtpVerification(userData);
    if (typeof respond !== "string") {
      localStorage.setItem("correctOtpToken", respond.correctOtpToken);
      redirect("/auth/forgotPassword/resetPassword");
    } else {
      setErr(() => ({ errMsg: respond, showErr: true }));
    }
  }

  return (
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
            errorMessage={errors?.otp?.message}
            labelText="otp"
            type="number"
            name="otp"
            inputStyle="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            divStyle="mt-6"
            placeHolder="Enter Otp"
            min="1000"
          />
          <button className="block w-full bg-[#7688C9] md:mt-8 mt-4 text-black py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Otp;
