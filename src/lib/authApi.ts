import { apiClient } from "./apiClient";
import { LoginInput, LoginResponse } from "../../types/auth";

export async function loginRequest(
  payload: LoginInput
): Promise<LoginResponse> {
  const res = await apiClient.post("/auth/login", payload);
  return res.data;
}
