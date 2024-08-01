import { useEffect } from "react";
import { supabase } from "@/utils/supabase";
import { useAuthStore } from "./authStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsNewUpdateAvailable } from "components/newsUpdateStore";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  created_at: Date;
}


const fetchNewsData = async (): Promise<NewsItem[]> => {
  const { data, error } = await supabase
    .from("News")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new Error("Failed to fetch news");
  }

  return data as NewsItem[];
};

export default function useFetchNews() {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuthStore();
  const { newUpdateAvailable, update } = useIsNewUpdateAvailable();

  const { data: posts, error, isLoading, refetch } = useQuery<NewsItem[], Error>({
    queryKey: ["news"],
    queryFn: fetchNewsData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("News")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            refetch();
            update(false);
          } else {
            if (!newUpdateAvailable) {
              update(true);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "News" },
        (payload) => {
          if (isLoggedIn) {
            refetch();
            update(false);
          } else {
            if (!newUpdateAvailable) {
              update(true);
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoggedIn, newUpdateAvailable, refetch, update]);

  const applyUpdates = () => {
    update(false);
  };

  return {
    fetchError: error?.message || "",
    posts: posts || [],
    refetch,
    updateAvailable: newUpdateAvailable,
    applyUpdates,
    isFetching: isLoading,
  };
}
