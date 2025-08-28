import { useState, useMemo, useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import Select from "../../components/form/Select";
import {
  getServicePackageById,
  updateServicePackage,
} from "../../services/servicePackageService";
import { useNavigate, useParams } from "react-router";

export default function EditPackageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const generateIdentityNumber = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    return `STD-${randomNum}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    identityNumber: generateIdentityNumber(),
    status: "active",
    technicalInspection: "1",
    manualPrice: "",
    discount: "0",
  });

  const [errors, setErrors] = useState<any>({});

  const finalPrice = useMemo(() => {
    const base = formData.manualPrice ? parseFloat(formData.manualPrice) : 0;
    const discount = formData.discount ? parseFloat(formData.discount) : 0;

    const discounted = base - (base * discount) / 100;
    return Math.round(discounted * 100) / 100;
  }, [formData.manualPrice, formData.discount]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description } = formData;
    const emptyErrors: any = {};

    if (!name.trim()) emptyErrors.name = "Xidmət Paketi Adı daxil edilməlidir";
    if (!description.trim())
      emptyErrors.description = "Qısa təsvir daxil edilməlidir";

    setErrors(emptyErrors);
    if (Object.keys(emptyErrors).length > 0) return;

    const newPackage = {
      ...formData,
      manualPrice: formData.manualPrice || String(finalPrice),
      identityNumber: formData.identityNumber,
      totalPrice: finalPrice,
    };

    console.log("Yeni Paket:", newPackage);
    console.log(id);

    try {
      if (!id) return;
      let data = await updateServicePackage(id, newPackage);
      console.log(data);

      alert(data.message);
      navigate(`/`);
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
      console.log(err.response?.data?.errors);

      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(typeof value);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const options = [
    { value: "active", label: "Aktiv" },
    { value: "passive", label: "Passiv" },
  ];
  const technicalInspection = [
    { value: "1", label: "1 dəfə" },
    { value: "2", label: "2 dəfə" },
  ];
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, status: value });
  };
  const handleSelectChangeTechnicalInspection = (value: string) => {
    setFormData({ ...formData, technicalInspection: value });
  };
  useEffect(() => {
    const fetchRoles = async () => {
      if (!id) return;
      try {
        const data = await getServicePackageById(id); // Backend-dən bütün rolları alırıq
        console.log(data);
        setFormData(data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);
  return (
    <ComponentCard title="Xidmət Paketi Əlavə etmə Formu">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="identityNumber">Paket kodu</Label>
            <Input
              type="text"
              id="identityNumber"
              name="identityNumber"
              value={formData.identityNumber}
              disabled
            />
          </div>
          <div>
            <Label htmlFor="name" className="input-label">
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
              Adı
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="Xidmət paketi adını daxil edin"
            />
          </div>
          <div className="lg:col-span-2">
            <Label htmlFor="description" className="input-label">
              {errors.description && (
                <div className="error-message">{errors.description}</div>
              )}
              Qısa Təsvir
            </Label>
            <TextArea
              rows={4}
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              error={!!errors.description}
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              options={options}
            />
          </div>
          <div>
            <Label htmlFor="technicalInspection">Texniki Baxış</Label>
            <Select
              name="technicalInspection"
              value={formData.technicalInspection}
              onChange={handleSelectChangeTechnicalInspection}
              options={technicalInspection}
            />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="manualPrice">Aylıq xidmət haqqı (AZN)</Label>
            <Input
              type="number"
              name="manualPrice"
              value={formData.manualPrice}
              onChange={handleChange}
              placeholder="Aylıq xidmət haqqı daxil edin"
              min="0"
            />
          </div>

          <div>
            <Label htmlFor="discount">Endirim (%)</Label>
            <Input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="0"
              min="0"
              max="100"
            />
          </div>
          <div className="pt-6">
            <p className="text-sm text-gray-700">
              <strong>Endirimli qiymət:</strong> {finalPrice} AZN
            </p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button type="submit">Yadda Saxla</Button>
          {/* <Button
            type="button"
            variant="outline"
            onClick={() => console.log("Əvvəlcədən baxış:", formData)}
          >
            Əvvəlcədən Baxış
          </Button> */}
        </div>
      </form>
    </ComponentCard>
  );
}
