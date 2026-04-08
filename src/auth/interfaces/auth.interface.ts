export interface ITokenPayload {
  id: string;
  email: string;
  roles: string[];
}

export interface IUserResponse {
  _id: unknown;
  username: string;
  email: string;
  profileImage: string;
  roles: string[];
  isVerified: boolean;
  isOtpVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAuthResponse {
  message: string;
  token?: string;
  user?: Record<string, unknown>;
}

export interface IMessageResponse {
  message: string;
}
