import { useEffect, useState } from "react";
import { addBalancePayment } from "../../services/paymentService";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { getUser, userDataInterface } from "../../services/userService";

interface BalanceTopUpFormProps {
  userId: string;
  onSuccess?: (newBalance: number) => void;
}

const BalanceTopUpForm: React.FC<BalanceTopUpFormProps> = ({
  userId,
  onSuccess,
}) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");

  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<"cash" | "online">("cash");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await addBalancePayment(userId, amount, "cash");
      if (onSuccess) onSuccess(data.newBalance);
      alert(`Balans uğurla artırıldı: ${data.newBalance} AZN`);
      setAmount(0);
    } catch (err) {
      setError("Balans artırılarkən xəta baş verdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Ad
          </label>
          <Input
            type="text"
            value={user?.fname}
            disabled
            onChange={() => console.log("")}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Soyad
          </label>
          <Input
            type="text"
            value={user?.lname}
            disabled
            onChange={() => console.log("")}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Balans (AZN)
          </label>
          <Input
            type="number"
            value={user?.balance}
            disabled
            onChange={() => console.log("")}
          />
        </div>
      </div>
      {permissions?.finance?.addBalance && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Məbləğ (AZN)
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Ödəniş üsulu
            </label>
            <Select
              value={method}
              //   onChange={(e) => setMethod(e.target.value as "cash" | "online")}
              onChange={() => console.log("salam")}
              options={[
                { value: "cash", label: "Nağd" },
                { value: "online", label: "Online" },
              ]}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading}>
            {loading ? "Gözləyin..." : "Balansı artır"}
          </Button>
        </form>
      )}
    </>
  );
};

export default BalanceTopUpForm;
