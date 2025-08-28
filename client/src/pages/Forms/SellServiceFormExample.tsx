import { useState, useMemo, useEffect } from "react";
import {
  getAllServicePackages,
  ServicePackageInterface,
} from "../../services/servicePackageService";


export default function PayServiceFormExample() {
  const [servicePackages, setServicePackages] = useState<
    ServicePackageInterface[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"percent" | "amount">(
    "percent"
  );
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");

  const totalPrice = useMemo(() => {
    const base = servicePackages
      .filter((pkg) => pkg._id && selectedPackages.includes(pkg._id))
      .reduce((sum, pkg) => sum + pkg.totalPrice, 0);

    const discounted =
      discountType === "percent"
        ? base - base * (discount / 100)
        : base - discount;

    return Math.max(discounted, 0).toFixed(2);
  }, [selectedPackages, discount, discountType]);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await getAllServicePackages();
        console.log(data);

        setServicePackages(data);
      } catch (err: any) {
        console.error("Error fetching servicePackages:", err);
      }
    };

    fetchPackages();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const saleRecord = {
      customerId: selectedCustomer,
      packages: selectedPackages,
      discount,
      discountType,
      paymentMethod,
      totalPrice,
      status: paymentMethod === "cash" ? "Ödənilib" : "Ödəniş Gözləmədə",
    };

    console.log("Satış qeydi:", saleRecord);
    // TODO: Göndər API-yə
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold">Example Xidmət Satışı</h2>

      <div>
        <label className="block">Müştəri ID</label>
        <input
          type="text"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="input"
          placeholder="Məs: 12345"
          required
        />
      </div>

      <div>
        <label className="block">Paket Seçimi</label>
        {servicePackages.map((pkg) => (
          <label key={pkg._id} className="block border rounded p-2 my-1">
            <input
              type="checkbox"
              checked={selectedPackages.includes(pkg._id!)}
              onChange={() =>
                setSelectedPackages((prev) =>
                  prev.includes(pkg._id!)
                    ? prev.filter((id) => id !== pkg._id)
                    : [...prev, pkg._id!]
                )
              }
            />{" "}
            {pkg.name} — {pkg.totalPrice} AZN ({pkg.validity} ay)
          </label>
        ))}
      </div>

      <div>
        <label className="block">Endirim</label>
        <select
          value={discountType}
          onChange={(e) =>
            setDiscountType(e.target.value as "percent" | "amount")
          }
          className="input"
        >
          <option value="percent">Faiz (%)</option>
          <option value="amount">Məbləğ</option>
        </select>
        <input
          type="number"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="input mt-1"
          placeholder={discountType === "percent" ? "% dəyəri" : "AZN/USD/EUR"}
          min={0}
        />
      </div>
      <div>
        <label className="block">Ödəniş Metodu</label>
        <label>
          <input
            type="radio"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={() => setPaymentMethod("cash")}
          />{" "}
          Nağd
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="online"
            checked={paymentMethod === "online"}
            onChange={() => setPaymentMethod("online")}
          />{" "}
          Onlayn
        </label>
      </div>

      <div className="text-right font-semibold">
        Ümumi Qiymət: {totalPrice} AZN
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Satışı Yadda Saxla
      </button>
    </form>
  );
}
