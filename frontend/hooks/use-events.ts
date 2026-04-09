import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface EventDate {
  dateTime: string;
  timeZone?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: EventDate;
  end: EventDate;
  htmlLink?: string;
}

export interface NewEvent {
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
}

export const useEvents = () => {
  return useQuery<CalendarEvent[]>({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await api.get("/events");
      // Backend returns data directly as an array or wrapped in response.data
      return data.data || data; 
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: NewEvent) => {
      const { data } = await api.post("/events", event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, event }: { id: string; event: NewEvent }) => {
      const { data } = await api.put(`/events/${id}`, event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/events/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
