import { useMutation } from "@tanstack/react-query";
import { login as loginApi, logout as logoutApi, forgotPassword as forgotPasswordApi } from "../../src/api/auth";

export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
  });
}

export function useLogout() {
  return useMutation({ mutationFn: logoutApi });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPasswordApi(email),
  });
}
