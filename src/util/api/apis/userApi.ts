/* eslint-disable @typescript-eslint/no-explicit-any */
import { emailValidation, logIn, register } from "@/util/interface/auth";
import { userSliceState } from "@/util/interface/slice";
import axios from "axios";
import axiosInstance from "../interpreter";
import endpoints from "@/util/constant/endpoint";

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

async function handleRegister(userData: register) {
  try {
    const response = await axios.post(
      URL + userEndpoint.registration,
      userData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (err: any) {
    return err.response.data.message;
  }
}

async function handleUpdateUser(userData: Partial<userSliceState>) {
  try {
    const response = await axiosInstance.put(
      userEndpoint.updProfile,
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

async function handleDeleteUser(userData: Partial<userSliceState>) {
  try {
    const response = await axiosInstance.delete(userEndpoint.deleteUser, {
      headers: { "Content-Type": "application/json" },
      data: userData,
    });
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
async function handleOtpVerification(userData: { email: string; otp: number }) {
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
    console.log(err);
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
