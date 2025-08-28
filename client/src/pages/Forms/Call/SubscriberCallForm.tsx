import React, { useState } from "react";
import Label from "../../../components/form/Label";
import PhoneInput from "../../../components/form/group-input/PhoneInput";
import { CallPayload, createCall } from "../../../services/callService";
import PhoneInputAz from "../../../components/form/group-input/PhoneInputAz";

const SubscriberCallForm = () => {
  const [formData, setFormData] = useState({
    fullName: "Test",
    phoneNumber: "",
    address: "Sabunchu",
  });
  const [errors, setErrors] = useState<{
    phoneNumber?: string;
    emptyFields?: string;
    authError?: string;
  }>({});
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Subscriber Call Data:", formData);
  const emptyErrors: typeof errors = {};

  const { phoneNumber } = formData;

  if (!phoneNumber?.trim()) {
    emptyErrors.phoneNumber = "Mobile Nömrə qeyd edilməlidir.";
  }

  // Əlavə check: phoneNumber uzunluğu düzgün deyil
  if (
    phoneNumber?.slice(4)?.trim()?.length !== 9 &&
    phoneNumber?.slice(4)?.trim()?.length > 0
  ) {
    emptyErrors.phoneNumber = "Mobil nömrə düzgün qeyd edilməlidir";
  }

  setErrors(emptyErrors);
  if (Object.keys(emptyErrors).length !== 0) return;

  const payload: CallPayload = {
    type: "abuneci",
    ...formData,
  };

  try {
    console.log(payload);

    const result = await createCall(payload);
    console.log("Call yaradıldı:", result);
    alert("Çağırış uğurla yaradıldı!");
  } catch (err: any) {
    alert(err.message || "Çağırış yaradılarkən xəta baş verdi");
  }
};

  const countries = [
    { code: "AZ", label: "+994" },
    { code: "TR", label: "+90" },
    { code: "RU", label: "+7" },
    { code: "GE", label: "+995" },
  ];
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
      <h2 className="text-xl font-bold mb-4">Abunəçi Çağırış Formu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          {/* <label className="block mb-1">Telefon</label>
          <input
            type="text"
            name="phone"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          /> */}
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
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Yadda saxla
        </button>
      </form>
    </div>
  );
};

export default SubscriberCallForm;
