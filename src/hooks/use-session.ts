"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getSession,
  logIn,
  logOut,
  recoverPassword,
  resetPassword,
  signUp,
  updateProfile,
} from "@/actions/auth";
import { linkCartToCustomer } from "@/actions/cart";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/queries/customer";
import { useCartStore } from "@/store/cart-store";

function linkExistingCartToCustomer() {
  const cartId = useCartStore.getState().cartId;
  if (cartId) linkCartToCustomer(cartId);
}

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: () => getSession(),
  });
}

export function useLogIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      logIn(email, password),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["session"] });
        linkExistingCartToCustomer();
      }
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => signUp(input),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["session"] });
        linkExistingCartToCustomer();
      }
    },
  });
}

export function useRecoverPassword() {
  return useMutation({
    mutationFn: (email: string) => recoverPassword(email),
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token, password }: { id: string; token: string; password: string }) =>
      resetPassword(id, token, password),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["session"] });
        linkExistingCartToCustomer();
      }
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCustomerInput) => updateProfile(input),
    onSuccess: (result) => {
      if (result.success) queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}

export function useLogOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logOut(),
    onSuccess: () => {
      queryClient.setQueryData(["session"], null);
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}
