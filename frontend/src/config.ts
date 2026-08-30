const REMOTE_HOST = "https://ims-r9e5.onrender.com";

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "/api"
    : `${REMOTE_HOST}/api`);

export const endpoints = {
  products: `${API_BASE}/products/`,
  categories: `${API_BASE}/categories/`,
  units: `${API_BASE}/units/`,
  variants: `${API_BASE}/variants/`,
  inventory: `${API_BASE}/inventory/inventory/`,
  locations: `${API_BASE}/inventory/locations/`,
  movements: `${API_BASE}/inventory/movements/`,
  transfers: `${API_BASE}/inventory/transfers/`,
  counts: `${API_BASE}/inventory/counts/`,
  countLines: `${API_BASE}/inventory/count-lines/`,
};
