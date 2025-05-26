const endpoints = {
  user: {
    registration: "/register",
    login: "/login",
    updProfile: "/update-profile",
    passwordChange: "/change-password",
    deleteUser: "/delete-user",
    emailValidation: "/email-valid",
    otpVerification: "/otp-verification",
  },
  transaction: {
    newTransaction: "/transactions/new",
    getUserTransaction: "/transactions",
    specificTransition: "/transactions/:id",
    updTransition: "/transactions/:id",
    deleteTransition: "/transactions/:id",
    totalExpense: "/transactions/summary",
  },
};

export default endpoints;
