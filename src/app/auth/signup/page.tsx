/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Text from "@/components/common/text/text";
import Link from "next/link";
import { useForm } from "react-hook-form";
import React, { useEffect, useRef, useState } from "react";
import { register as registerType } from "@/util/interface/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidationSchema } from "@/util/validation/authValidaion";
import InputAndLabel from "@/components/common/input/inputAndLabel";
import { redirect } from "next/navigation";
import { RxAvatar } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { handleRegister } from "@/util/api/apis/userApi";
import {
  handleSignIn,
  handleHydrateToken,
  handleIsUserNew,
} from "@/store/slice/userSlice";
import { handleShowSplashScreen } from "@/store/slice/uiSlice";
import { RootState } from "@/store/store";

function Register() {
  const dispatch = useDispatch();
  const [err, setErr] = useState({ showErr: false, errMsg: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | undefined>();
  const [fileData, setFileData] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const theme = useSelector((state: RootState) => state.theme.theme);

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
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (fileData) {
        formData.append("profilePic", fileData);
      }
      try {
        const response = await handleRegister(formData);
        if (typeof response !== "string") {
          const user = response.data.data;
          const token = response.data.token;
          dispatch(handleSignIn(user));
          dispatch(handleHydrateToken(token));
          dispatch(handleShowSplashScreen());
          dispatch(handleIsUserNew());
          localStorage.setItem("authToken", token);
          setTimeout(() => {
            redirect("/");
          }, 1000);
          setIsSubmitting(false);
        } else {
          setErr({ showErr: true, errMsg: response });
          setIsSubmitting(false);
        }
      } catch (apiErr: any) {
        setErr({
          showErr: true,
          errMsg: apiErr?.message,
        });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error(err?.message);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
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

          <button
            className="flex items-center justify-center gap-2 w-full  bg-[#7688C9] text-white md:mt-5 mt-4 py-3.5 rounded-md cursor-pointer hover:opacity-70 transition-all"
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
