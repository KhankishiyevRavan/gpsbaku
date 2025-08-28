import React, { useState } from "react";
import Label from "../../../components/form/Label";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import Input from "../../../components/form/input/InputField";
import { CallPayload, createCall } from "../../../services/callService";
import PhoneInputAz from "../../../components/form/group-input/PhoneInputAz";

const NonSubscriberCallForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<{
    fullName?: string;
    phoneNumber?: string;
    address?: string;
    emptyFields?: string;
    authError?: string;
  }>({});
  const countries = [
    { code: "AZ", label: "+994" },
    { code: "TR", label: "+90" },
    { code: "RU", label: "+7" },
    { code: "GE", label: "+995" },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Non-Subscriber Call Data:", formData);

  const emptyErrors: typeof errors = {};
  const { fullName, phoneNumber, address } = formData;

  const isFullNameEmpty = !fullName?.trim();
  const isAddressEmpty = !address?.trim();

  const selectedCountry = countries.find((country) =>
    phoneNumber.startsWith(country.label)
  );

  let afterCode = "";
  let isPhoneNumberEmpty = false;
  if (selectedCountry) {
    afterCode = phoneNumber.replace(selectedCountry.label, "").trim();
    isPhoneNumberEmpty = afterCode.length === 0;
  } else {
    isPhoneNumberEmpty = !phoneNumber?.trim();
  }

  if (isPhoneNumberEmpty)
    emptyErrors.phoneNumber = "Mobil nömrə qeyd edilməlidir.";

  // 🔔 Əlavə yoxlama: telefon nömrəsinin uzunluğu düzgün deyil
  if (
    afterCode.length > 0 &&
    afterCode.length !== 9
  ) {
    emptyErrors.phoneNumber = "Mobil nömrə düzgün qeyd edilməlidir.";
  }

  if (isFullNameEmpty) emptyErrors.fullName = "Tam ad qeyd edilməlidir.";
  if (isAddressEmpty) emptyErrors.address = "Adres qeyd edilməlidir.";

  console.log(emptyErrors);
  setErrors(emptyErrors);
  if (Object.keys(emptyErrors).length !== 0) return;

  const payload: CallPayload = {
    type: "qeyriabuneci",
    ...formData,
  };

  try {
    const result = await createCall(payload);
    console.log("Call yaradıldı:", result);
    alert("Çağırış uğurla yaradıldı!");
  } catch (err: any) {
    alert(err.message || "Çağırış yaradılarkən xəta baş verdi");
  }
};


  const handlePhoneNumberChange = (phoneNumber: string) => {
    // Əgər 10 simvoldan artıqdırsa, əlavə daxil etməyə icazə vermirik
    console.log(phoneNumber.length);

    setFormData({ ...formData, phoneNumber: phoneNumber });
    console.log("Updated phone number:", phoneNumber);

    setErrors((prev) => ({
      ...prev,
      phoneNumber: undefined,
    }));

    if (!phoneNumber?.slice(4).trim()) {
      setErrors({ ...errors, phoneNumber: "Mobil nömrə qeyd edilməlidir" });
    }
    console.log(phoneNumber?.slice(4)?.trim()?.length);

    if (
      phoneNumber?.slice(4)?.trim()?.length !== 9 &&
      phoneNumber?.slice(4)?.trim()?.length > 0
    ) {
      setErrors({
        ...errors,
        phoneNumber: "Mobil nömrə düzgün qeyd edilməlidir",
      });
    }
  };
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Qeyri-Abunəçi Çağırış Formu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <Label htmlFor="fname" className="input-label">
            {errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
            Ad/Soyad
          </Label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={
              errors.fullName
                ? "border-2 border-red-500 dark:border-red-500"
                : ""
            }
          />
        </div>
        <div className="mb-3">
          <Label className="input-label">
            {errors.phoneNumber && (
              <div className="error-message">{errors.phoneNumber}</div>
            )}
            Telefon nömrəsi
          </Label>
          <PhoneInputAz
            selectPosition="end"
            countries={countries}
            placeholder="+994 (55) 000-00-00"
            onChange={handlePhoneNumberChange}
            className={
              errors.phoneNumber
                ? "border-2 border-red-500 dark:border-red-500"
                : ""
            }
          />
        </div>
        <div className="mb-3">
          <Label className="input-label">
            {errors.address && (
              <div className="error-message">{errors.address}</div>
            )}
            Ünvan
          </Label>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={
              errors.address
                ? "border-2 border-red-500 dark:border-red-500"
                : ""
            }
            // required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Yadda saxla
        </button>
      </form>
    </div>
  );
};

export default NonSubscriberCallForm;
