export interface logIn {
  userNameOrEmail: string;
  password: string;
}

export interface register {
  username: string;
  email: string;
  password: string;
}

export interface emailValidation {
  email: string;
}

export interface otp {
  otp: number | string;
}

export interface password {
  password: string;
  confirmPassword: string;
}
