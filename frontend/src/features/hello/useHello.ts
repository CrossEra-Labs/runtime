import { useQuery } from "@tanstack/react-query";
import { fetchHello } from "./helloApi";

export const useHello = () => {
  return useQuery({
    queryKey: ["hello"],
    queryFn: ({ signal }) => fetchHello(signal),
    retry: 1,
  });
};
