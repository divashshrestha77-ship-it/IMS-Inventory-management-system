import { useEffect, useState } from "react";
import { getCustomers } from "../api/customersApi";
import type { Customer } from "../types/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Customer Directory</h1>
          <div className="sub">Omnichannel customer profiles & purchase value</div>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading customers...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Email / Phone</th>
                <th>Preferred Channel</th>
                <th>Orders</th>
                <th style={{ textAlign: "right" }}>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td className="mono">{c.id}</td>
                  <td style={{ fontWeight: 700 }}>{c.name}</td>
                  <td>
                    <div>{c.email}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{c.phone}</div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{c.preferred_channel}</span>
                  </td>
                  <td>{c.total_orders} orders</td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    ฿{c.total_spent.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
