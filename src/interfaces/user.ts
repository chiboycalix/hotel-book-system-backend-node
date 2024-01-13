export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  IsVerified: boolean;
  IsAdmin: boolean;
  phoneNumber?: string;
}

export interface ILoginUser extends Document {
  email: string;
  password: string;
}
