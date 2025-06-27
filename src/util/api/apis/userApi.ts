/* eslint-disable @typescript-eslint/no-explicit-any */
import { emailValidation, logIn } from "@/util/interface/auth";
import { userSliceState } from "@/util/interface/slice";
import axios from "axios";
import axiosInstance from "../interpreter";
import endpoints from "@/util/constant/endpoint";
import { showErrorToast } from "@/util/services/toast";

const URL = process.env.NEXT_PUBLIC_BASE_API_URL + "auth" || "";
const userEndpoint = endpoints.user;

async function handleLogIn(userData: logIn) {
  try {
    const response = await axios.post(
      URL + userEndpoint.login,
      JSON.stringify(userData),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response.data.message;
  }
}

async function handleRegister(userData: FormData) {
  try {
    const response = await axios.post(
      URL + userEndpoint.registration,
      userData
    );
    return response.data;
  } catch (err: any) {
    return err.response.data.message;
  }
}

async function handleUpdateUser(userData: FormData) {
  try {
    const response = await axiosInstance.put(
      userEndpoint.updProfile,
      userData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (err: any) {
    showErrorToast(err?.response?.data?.message);
    console.error(err?.response?.data?.message);
  }
}

async function handleChangePassword(userData: Partial<userSliceState>) {
  try {
    const response = await axiosInstance.put(
      userEndpoint.passwordChange,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
}

async function handleDeleteUser() {
  try {
    const response = await axiosInstance.delete(
      "/auth" + userEndpoint.deleteUser
    );
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
}

async function handleEmailVerification(userData: emailValidation) {
  try {
    const response = await axios.post(
      URL + userEndpoint.emailValidation,
      JSON.stringify(userData),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response.data.message;
  }
}
async function handleOtpVerification(userData: {
  email: string;
  otp: number | string;
}) {
  try {
    const response = await axios.post(
      URL + userEndpoint.otpVerification,
      JSON.stringify(userData),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    console.error(err);
    return err.response.data.message;
  }
}

async function handleResetPassword(userData: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.put(
      URL + userEndpoint.passwordChange,
      JSON.stringify(userData),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response;
  }
}

export {
  handleLogIn,
  handleRegister,
  handleUpdateUser,
  handleChangePassword,
  handleDeleteUser,
  handleEmailVerification,
  handleOtpVerification,
  handleResetPassword,
};
