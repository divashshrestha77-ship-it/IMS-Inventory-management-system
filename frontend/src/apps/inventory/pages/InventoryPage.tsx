import ShopeeReturnManager from "../components/ShopeeReturnManager";
import PopupStoreAuditor from "../components/PopupStoreAuditor";

export default function InventoryPage() {
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Stock Overview & Channel Audit</h1>
          <div className="sub">
            Real-time stock levels across Storefronts, 10 Pop-ups, Shopee & Line Official
          </div>
        </div>
      </div>

      <PopupStoreAuditor />
      <ShopeeReturnManager />
    </div>
  );
}
