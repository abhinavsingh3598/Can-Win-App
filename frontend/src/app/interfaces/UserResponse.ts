import { User } from "../models/user";

export interface UserResponse {
    message: string;
    users: User[];
  }
  