export interface User {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
};
export type LoginInput = {
  identifier: string;
  password: string;
};
export type LoginResponse = {
  access_token: string;
  session: AuthUser;
};
// Add this:
export type Room = {
  id: number;
  name: string;
  status: string;
  type?: string;
  floor?: number;
  capacity?: number;
  price?: number;
};