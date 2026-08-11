import { apiClient } from "./client";
import type { FactoryResponse } from "../types/api";

export function listFactories() {
  return apiClient.get<FactoryResponse[]>("/factories");
}
