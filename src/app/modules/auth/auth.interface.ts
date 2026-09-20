export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IRefreshToken {
  token: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
}

export interface IResetPassword {
  email: string;
  otp: string;
  newPassword: string;
}

