import { useSuspenseQuery } from "@tanstack/react-query";
import { getCategory } from "./network";

export function useGetAllCategory() {
  const { data } = useSuspenseQuery({
    queryKey: ["all", "category"],
    queryFn: getCategory,
  });

  return { data };
}
