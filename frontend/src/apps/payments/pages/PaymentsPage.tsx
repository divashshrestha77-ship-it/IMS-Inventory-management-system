import { useEffect, useState } from "react";
import { getPayments } from "../api/paymentsApi";
import type { Payment } from "../types/payments";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments()
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Payment Transactions</h1>
          <div className="sub">PromptPay, Shopee Pay, Credit Cards & Cash logs</div>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="state">
            <div className="spinner" />
            Loading payments...
          </div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Payment Ref</th>
                <th>Order Ref</th>
                <th>Method</th>
                <th>Channel</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="mono" style={{ fontWeight: 700 }}>{p.payment_number}</td>
                  <td className="mono" style={{ color: "var(--primary)" }}>{p.order_number}</td>
                  <td>
                    <span className="badge badge-amber">{p.payment_method}</span>
                  </td>
                  <td>{p.channel}</td>
                  <td className="muted">{p.timestamp}</td>
                  <td>
                    <span className="badge badge-green">{p.status}</span>
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 700 }}>
                    ฿{p.amount.toLocaleString()}
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
