export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isAdmin: boolean;
  phoneNumber?: string;
}

export interface ILoginUser extends Document {
  email: string;
  password: string;
}
