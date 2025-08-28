import { useEffect, useState } from "react";
import BalanceHeader from "./balance/BalanceHeader";
import PaymentTabs from "./balance/PaymentTabs";
import DeferredPayment from "./balance/DeferredPayment";
import BalanceTopUpForm from "../form/BalanceTopUpForm";
import { getUser, userDataInterface } from "../../services/userService";
import ContractUser from "./contract/ContractUser";

export default function BalanceDashboard() {
  const [activeTab, setActiveTab] = useState("topup");
  const userId = localStorage.getItem("id");
  const [user, setUser] = useState<userDataInterface | null>(null);
  const fetchUser = async () => {
    if (!userId) return;
    try {
      let data = await getUser(userId);
      console.log(data);
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="p-6 space-y-6">
      <BalanceHeader balance={Number(user?.balance)} expiryDate="2025-06-28" />
      <PaymentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "topup" && (
        <>
          <DeferredPayment amount={2037} connectedAt="2025-06-23" />
          <BalanceTopUpForm userId={String(userId)} />
        </>
      )}

      {activeTab === "contracts" && <ContractUser />}
      {activeTab === "services" && <div>Əlaqəli xidmətlər</div>}
      {activeTab === "bonuses" && <div>Bonuslar və endirim kodları</div>}
      {activeTab === "documents" && <div>Sənədlər</div>}
      {activeTab === "history" && <div>Əməliyyat tarixçəsi</div>}
    </div>
  );
}
