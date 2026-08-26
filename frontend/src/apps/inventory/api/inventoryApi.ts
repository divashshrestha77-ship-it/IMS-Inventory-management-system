import axios from "axios";

import type {
  Inventory,
  StockLocation,
  StockMovement,
  StockTransfer,
  StockCount,
  StockCountLine,
  CreateStockLocationPayload,
  UpdateStockLocationPayload,
  CreateStockMovementPayload,
  CreateStockTransferPayload,
  CreateStockCountPayload,
  CreateStockCountLinePayload,
} from "../types/inventory";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const inventoryApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------------------------------
// STOCK LOCATIONS
// ----------------------------------------------------

export const getStockLocations = async (): Promise<StockLocation[]> => {
  const response = await inventoryApi.get("/inventory/locations/");
  return response.data;
};

export const getStockLocation = async (
  id: number
): Promise<StockLocation> => {
  const response = await inventoryApi.get(`/inventory/locations/${id}/`);
  return response.data;
};

export const createStockLocation = async (
  data: CreateStockLocationPayload
): Promise<StockLocation> => {
  const response = await inventoryApi.post("/inventory/locations/", data);
  return response.data;
};

export const updateStockLocation = async (
  id: number,
  data: UpdateStockLocationPayload
): Promise<StockLocation> => {
  const response = await inventoryApi.patch(
    `/inventory/locations/${id}/`,
    data
  );

  return response.data;
};

export const deleteStockLocation = async (
  id: number
): Promise<void> => {
  await inventoryApi.delete(`/inventory/locations/${id}/`);
};

// ----------------------------------------------------
// INVENTORY
// ----------------------------------------------------

export const getInventory = async (): Promise<Inventory[]> => {
  const response = await inventoryApi.get("/inventory/");
  return response.data;
};

export const getInventoryByLocation = async (
  locationId: number
): Promise<Inventory[]> => {
  const response = await inventoryApi.get(
    `/inventory/?stock_location=${locationId}`
  );

  return response.data;
};

export const getInventoryByProduct = async (
  productId: number
): Promise<Inventory[]> => {
  const response = await inventoryApi.get(
    `/inventory/?product=${productId}`
  );

  return response.data;
};

// ----------------------------------------------------
// STOCK MOVEMENTS
// ----------------------------------------------------

export const getStockMovements = async (): Promise<StockMovement[]> => {
  const response = await inventoryApi.get("/inventory/movements/");
  return response.data;
};

export const createStockMovement = async (
  data: CreateStockMovementPayload
): Promise<StockMovement> => {
  const response = await inventoryApi.post(
    "/inventory/movements/",
    data
  );

  return response.data;
};

// ----------------------------------------------------
// STOCK TRANSFERS
// ----------------------------------------------------

export const getStockTransfers = async (): Promise<StockTransfer[]> => {
  const response = await inventoryApi.get("/inventory/transfers/");
  return response.data;
};

export const getStockTransfer = async (
  id: number
): Promise<StockTransfer> => {
  const response = await inventoryApi.get(
    `/inventory/transfers/${id}/`
  );

  return response.data;
};

export const createStockTransfer = async (
  data: CreateStockTransferPayload
): Promise<StockTransfer> => {
  const response = await inventoryApi.post(
    "/inventory/transfers/",
    data
  );

  return response.data;
};

export const updateStockTransfer = async (
  id: number,
  data: Partial<CreateStockTransferPayload>
): Promise<StockTransfer> => {
  const response = await inventoryApi.patch(
    `/inventory/transfers/${id}/`,
    data
  );

  return response.data;
};

// ----------------------------------------------------
// STOCK COUNTS
// ----------------------------------------------------

export const getStockCounts = async (): Promise<StockCount[]> => {
  const response = await inventoryApi.get("/inventory/counts/");
  return response.data;
};

export const getStockCount = async (
  id: number
): Promise<StockCount> => {
  const response = await inventoryApi.get(
    `/inventory/counts/${id}/`
  );

  return response.data;
};

export const createStockCount = async (
  data: CreateStockCountPayload
): Promise<StockCount> => {
  const response = await inventoryApi.post(
    "/inventory/counts/",
    data
  );

  return response.data;
};

export const getStockCountLines = async (
  countId: number
): Promise<StockCountLine[]> => {
  const response = await inventoryApi.get(
    `/inventory/counts/${countId}/lines/`
  );

  return response.data;
};

export const createStockCountLine = async (
  data: CreateStockCountLinePayload
): Promise<StockCountLine> => {
  const response = await inventoryApi.post(
    `/inventory/counts/${data.stock_count}/lines/`,
    data
  );

  return response.data;
};