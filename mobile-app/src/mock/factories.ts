import type { FactoryResponse } from "../types/api";

export const MOCK_FACTORY_CHENNAI = "mock-factory-chennai";
export const MOCK_FACTORY_PUNE = "mock-factory-pune";
export const MOCK_FACTORY_VIZAG = "mock-factory-vizag";

export const mockFactories: FactoryResponse[] = [
  {
    id: MOCK_FACTORY_CHENNAI,
    name: "Chennai Manufacturing Unit",
    location: "Ambattur Industrial Estate, Chennai",
    timezone: "Asia/Kolkata",
    createdAt: "2025-01-14T09:00:00.000Z",
  },
  {
    id: MOCK_FACTORY_PUNE,
    name: "Pune Assembly Plant",
    location: "Chakan MIDC, Pune",
    timezone: "Asia/Kolkata",
    createdAt: "2025-02-03T09:00:00.000Z",
  },
  {
    id: MOCK_FACTORY_VIZAG,
    name: "Vizag Steel Fabrication Yard",
    location: "Gajuwaka, Visakhapatnam",
    timezone: "Asia/Kolkata",
    createdAt: "2025-03-11T09:00:00.000Z",
  },
];
