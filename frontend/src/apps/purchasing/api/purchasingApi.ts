import { API_BASE } from "../../../config";
import type { Supplier, PurchaseOrder } from "../types/purchasing";

const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Thai Silk & Textile Fabrics Co.",
    code: "SUP-001",
    contact_person: "Khun Somchai",
    email: "somchai@thaisilk.co.th",
    phone: "+66 81 234 5678",
    address: "Bangkok Industrial Park, Sector 4",
    is_active: true,
    lead_time_days: 7,
    created_at: "2026-01-15",
  },
  {
    id: 2,
    name: "Bangkok Garment Accessories Ltd.",
    code: "SUP-002",
    contact_person: "Khun Napat",
    email: "napat@bkkgarments.com",
    phone: "+66 82 987 6543",
    address: "Sukhumvit Soi 55, Bangkok",
    is_active: true,
    lead_time_days: 5,
    created_at: "2026-02-10",
  },
  {
    id: 3,
    name: "Akkara Premium Packaging Co.",
    code: "SUP-003",
    contact_person: "Khun Ananda",
    email: "contact@akkarapackaging.co.th",
    phone: "+66 83 555 1212",
    address: "Ratchada Road, Bangkok",
    is_active: true,
    lead_time_days: 3,
    created_at: "2026-03-01",
  },
];

const mockOrders: PurchaseOrder[] = [
  {
    id: 101,
    po_number: "PO-2026-001",
    supplier_id: 1,
    supplier_name: "Thai Silk & Textile Fabrics Co.",
    order_date: "2026-08-20",
    expected_delivery: "2026-08-28",
    status: "Received",
    total_cost: 145000,
    notes: "Restock material for Akkara Fall Collection 2026",
    destination_location_name: "Central Warehouse",
    lines: [
      {
        id: 1,
        product_id: 1,
        product_name: "Silk Shirt - Navy Blue",
        sku: "AKK-SS-NAV",
        quantity_ordered: 200,
        quantity_received: 200,
        unit_cost: 500,
        total_amount: 100000,
      },
      {
        id: 2,
        product_id: 2,
        product_name: "Linen Trousers - Beige",
        sku: "AKK-LT-BEI",
        quantity_ordered: 150,
        quantity_received: 150,
        unit_cost: 300,
        total_amount: 45000,
      },
    ],
  },
  {
    id: 102,
    po_number: "PO-2026-002",
    supplier_id: 2,
    supplier_name: "Bangkok Garment Accessories Ltd.",
    order_date: "2026-08-25",
    expected_delivery: "2026-09-02",
    status: "Sent",
    total_cost: 48000,
    notes: "Buttons & Zippers bulk order for Pop-up stock replenish",
    destination_location_name: "Central Warehouse",
    lines: [
      {
        id: 3,
        product_id: 3,
        product_name: "Brass Signature Buttons",
        sku: "AKK-ACC-BTN",
        quantity_ordered: 1000,
        quantity_received: 0,
        unit_cost: 48,
        total_amount: 48000,
      },
    ],
  },
];

export async function getSuppliers(): Promise<Supplier[]> {
  try {
    const res = await fetch(`${API_BASE}/purchasing/suppliers/`);
    if (res.ok) return await res.json();
  } catch {
    /* fallback to mock */
  }
  return mockSuppliers;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  try {
    const res = await fetch(`${API_BASE}/purchasing/orders/`);
    if (res.ok) return await res.json();
  } catch {
    /* fallback to mock */
  }
  return mockOrders;
}
