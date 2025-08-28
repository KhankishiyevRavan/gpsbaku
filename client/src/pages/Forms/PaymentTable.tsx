import { useEffect, useState } from "react";
import { markMonthAsPaid } from "../../services/paymentService";
import {
  ContractInterface,
  getContractsBySubscriberId,
} from "../../services/contractService";
import { useNavigate, useParams } from "react-router";
import { getUser, userDataInterface } from "../../services/userService";
interface PaymentScheduleItem {
  month: string;
  amount: number;
  status: "paid" | "unpaid";
  paidAt?: string;
}
function PaymentTable() {
  const navigate = useNavigate();

  const { id: subscriberId } = useParams();
  const [contracts, setContracts] = useState<ContractInterface[]>([]);
  const [selectedContract, setSelectedContract] =
    useState<ContractInterface | null>(null);
  const [user, setUser] = useState<userDataInterface | null>(null);
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        if (!subscriberId) return;
        const data = await getContractsBySubscriberId(subscriberId);
        setContracts(data);
        const dataUser = await getUser(subscriberId);
        setUser(dataUser);
        console.log("User:", dataUser);

        // İlk müqaviləni avtomatik seç (sayından asılı olmayaraq)
        if (data.length > 0) {
          setSelectedContract(data[0]);
        }
      } catch (err) {
        console.error("Müqavilələr alınarkən xəta:", err);
      }
    };

    fetchContracts();
  }, [subscriberId]);

  const handleSelectContract = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const found = contracts.find((c) => c._id === selectedId);
    if (found) setSelectedContract(found);
  };

  // const handlePay = async (month: string) => {
  //   if (!selectedContract || !selectedContract._id) {
  //     alert("Müqavilə və ya ID tapılmadı!");
  //     return;
  //   }

  //   try {
  //     const res = await markMonthAsPaid(selectedContract._id, month);
  //     alert(res.message);

  //     const updatedContracts = await getContractsBySubscriberId(subscriberId!);
  //     const updated = updatedContracts.find(
  //       (c) => c._id === selectedContract._id
  //     );
  //     setSelectedContract(updated || null);
  //   } catch (err) {
  //     console.error("Ödəniş zamanı xəta:", err);
  //   }
  // };

  return (
    <div className="p-4">
      {/* <h2 className="text-lg font-bold mb-4">Müqavilə üzrə ödəniş cədvəli</h2> */}

      {contracts.length > 1 && (
        <select
          onChange={handleSelectContract}
          className="mb-4 p-2 border"
          value={selectedContract?._id}
        >
          <option value="">Müqavilə seçin</option>
          {contracts.map((c) => (
            <option key={c._id} value={c._id}>
              {c.contractNumber}
            </option>
          ))}
        </select>
      )}
      {selectedContract ? (
        <>
          <div>
            <label htmlFor="">
              Müqavilə dəyəri : <span>{selectedContract?.contractValue}</span>
            </label>
          </div>
          <div>
            <label htmlFor="">
              Istifadəçi balansı : <span>{user?.balance}</span>
            </label>
          </div>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Ay</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {selectedContract.paymentSchedule.map(
                (item: PaymentScheduleItem) => (
                  <tr key={item.month}>
                    <td className="p-2 border">{item.month}</td>
                    <td className="p-2 border">
                      {item.status === "paid" ? "✔️ Ödənilib" : "❌ Gözləmədə"}
                    </td>
                    <td className="p-2 border">
                      {item.status === "unpaid" && (
                        <button
                          onClick={() =>
                            navigate(
                              `/payments/new?contractId=${selectedContract._id}&month=${item.month}&userId=${user?._id}`
                            )
                          }
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Ödə
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </>
      ) : (
        <p>Müqavilə seçilməyib.</p>
      )}
    </div>
  );
}

export default PaymentTable;
