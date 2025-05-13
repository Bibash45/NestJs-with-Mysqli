import { Role } from '@prisma/client';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
}

export type PublicUser = Omit<User, 'password'>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
