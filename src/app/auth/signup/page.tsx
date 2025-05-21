/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Text from "@/components/common/text";
import Link from "next/link";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { register as registerType } from "@/util/interface/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidationSchema } from "@/util/validation";
import InputAndLabel from "@/components/common/inputAndLabel";
import { redirect, useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { handleRegister } from "@/util/api/apis/userApi";
import { handleSignIn, handleHydrateToken } from "@/store/slice/userSlice";

function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [err, setErr] = useState({ showErr: false, errMsg: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | undefined>();
  const [fileData, setFileData] = useState<File | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) redirect("/");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<registerType>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: yupResolver(registerValidationSchema),
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
          setFileData(file);
          setErr({ showErr: false, errMsg: "" });
        };
        reader.readAsDataURL(file);
      } catch (validationError: any) {
        setErr({ showErr: true, errMsg: validationError.message });
        setImage(undefined);
        setFileData(null);
      }
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  async function handleSubmitForm() {
    setErr({ showErr: false, errMsg: "" });
    const values = getValues();
    console.log("Value =>>>", values);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (fileData) {
        formData.append("profilePic", fileData);
      }
      try {
        console.log(formData);

        const response = await handleRegister(formData);
        if (typeof response !== "string") {
          const user = response.data.data;
          const token = response.data.token;
          dispatch(handleSignIn(user));
          dispatch(handleHydrateToken(token));
          localStorage.setItem("authToken", token);
          router.push("/");
        } else {
          setErr({ showErr: true, errMsg: response });
        }
      } catch (apiErr: any) {
        setErr({
          showErr: true,
          errMsg: apiErr?.message,
        });
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  }

  return (
    <div className="flex sm:w-[450px] w-[304px] lg:w-[400px] xl:w-[450px] items-center flex-col justify-center">
      <Text
        Element="h2"
        style="xl:!text-[32px] text-[20px] md:text-[28px] leading-[24px]"
        text="Create an Account"
      />
      <h4 className="sm:text-base text-[12px] mt-3 opacity-70">
        Already have an account?{" "}
        <Link href={"/auth/signin"} className="text-[#7688C9]">
          Sign in here
        </Link>
      </h4>

      {/* Image Upload */}
      <div
        className="mt-5 md:w-28 md:h-28 w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer"
        onClick={handleIconClick}
      >
        {image ? (
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
        ) : (
          <RxAvatar className="text-gray-500 w-16 h-16 md:w-22 md:h-22" />
        )}
      </div>
      <input
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        onChange={handleImageChange}
        className="hidden"
        ref={fileInputRef}
      />
      {err.showErr && <p className="text-red-400 mt-3 text-sm">{err.errMsg}</p>}

      {/* Form */}
      <div className="lg:mt-[24px] w-full md:mt-[20px] mt-[16px]">
        <form onSubmit={handleSubmit(handleSubmitForm)} className="w-full">
          <InputAndLabel
            register={register}
            errorMessage={errors?.username?.message}
            labelText="Username"
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
            divStyle="mt-3"
            placeHolder="Enter Email"
          />
          <InputAndLabel
            register={register}
            errorMessage={errors?.password?.message}
            labelText="Password"
            isPass={true}
            divStyle="mt-3"
            name="password"
            placeHolder="Enter Password"
          />

          <button className="block w-full bg-[#7688C9] text-white md:mt-5 mt-4 py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
