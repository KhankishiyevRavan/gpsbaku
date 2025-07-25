import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ContractInterface,
  getContractById,
} from "../../services/contractService";
import { markMonthAsPaid } from "../../services/paymentService";

function PaymentForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const contractId = searchParams.get("contractId");
  const month = searchParams.get("month");

  const [contract, setContract] = useState<ContractInterface | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");

  useEffect(() => {
    if (!contractId) return;
    const fetchContract = async () => {
      try {
        const data = await getContractById(contractId);
        setContract(data);
      } catch (err) {
        console.error("Müqavilə alınarkən xəta:", err);
      }
    };
    fetchContract();
  }, [contractId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractId || !month) return;

    const selectedMonth = contract?.paymentSchedule.find(
      (m: { month: string; }) => m.month === month
    );
    if (!selectedMonth) return;

    try {
      const res = await markMonthAsPaid(contractId, month, selectedMonth.amount, paymentMethod);
      alert(res.message);
      navigate(-1); // Geri qaytar
    } catch (err) {
      alert("Ödəniş zamanı xəta baş verdi.");
      console.error(err);
    }
  };

  const selectedMonth = contract?.paymentSchedule.find(
    (m: { month: string | null; }) => m.month === month
  );

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Ödəniş Et</h2>

      {contract && selectedMonth ? (
        <>
          <div className="mb-4">
            <p>
              <strong>Müqavilə Nömrəsi:</strong> {contract.contractNumber}
            </p>
            <p>
              <strong>Ödəniləcək Ay:</strong> {month}
            </p>
            <p>
              <strong>Məbləğ:</strong> {selectedMonth.amount} AZN
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedMonth.status === "paid" ? "✔️ Ödənilib" : "❌ Gözləmədə"}
            </p>
          </div>

          {selectedMonth.status === "paid" ? (
            <p className="text-green-600">Bu ay artıq ödənilib.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Ödəniş Metodu</label>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(e.target.value as "cash" | "online")
                  }
                  className="border p-2 rounded w-full"
                >
                  <option value="cash">Nağd</option>
                  <option value="online">Onlayn</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ödənişi Tamamla
              </button>
            </form>
          )}
        </>
      ) : (
        <p className="text-gray-600">Məlumatlar yüklənir və ya mövcud deyil.</p>
      )}
    </div>
  );
}

export default PaymentForm;
