import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface User {
  id: string;
  email: string;
  discordId: string | null;
}

export const useUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data; // data.data because of the response wrapper
    },
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      window.location.href = "/login";
    },
  });
};

export const useUpdateDiscord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (discordId: string) => {
      const { data } = await api.post("/auth/update-discord", { discordId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
