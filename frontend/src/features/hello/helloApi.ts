import ky from "ky";
import type { HelloResponse } from "./hello.types";

const api = ky.create({
  prefix: import.meta.env.VITE_API_URL,
  retry: 0,
});

export function fetchHello(signal: AbortSignal): Promise<HelloResponse> {
  return api.get("api/hello", { signal }).json<HelloResponse>();
}
