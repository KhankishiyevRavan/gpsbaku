import { useEffect, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { getUser, updateUser } from "../../services/userService";
import { getAllRoles } from "../../services/roleService";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Radio from "../../components/form/input/Radio";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import DatePicker from "../../components/form/date-picker";
import PhoneInputAz from "../../components/form/group-input/PhoneInputAz";

export default function EditUserDataForm() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const { id } = useParams<{ id: string }>(); // Role params ilə alırıq

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles(); // Backend-dən bütün rolları alırıq
        console.log(data);
        setRoles(data); // Rolları state-ə saxlayırıq
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
    const fetchUser = async () => {
      if (!id) return;
      const data = await getUser(id);
      console.log(data);

      setFormData({
        ...data,
        ...data.dynamicFields,
      });
    };
    fetchUser();
  }, []);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    fathername: "",
    email: "",
    status: true,
    role: "",
    identityNumber: "AZ12345678",
    phoneNumber: "",
    address: "",
    bDate: "",
  });
  // Form məlumatları
  const [errors, setErrors] = useState<{
    fname?: string;
    lname?: string;
    fathername?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    bDate?: string;
    emptyFields?: string;
    authError?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emptyErrors: typeof errors = {};

    const { fname, lname, fathername, email, phoneNumber, address } = formData;

    const isFNameEmpty = !fname?.trim();
    const isLNameEmpty = !lname?.trim();
    const isFatherNameEmpty = !fathername?.trim();
    const isEmailEmpty = !email?.trim();
    const isPhoneNumber = !phoneNumber?.trim();
    const isAddressEmpty = !address?.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isEmailEmpty) {
      emptyErrors.email = "Elektron poçt qeyd edilməlidir";
    } else if (!emailRegex.test(email)) {
      emptyErrors.email = "Elektron poçt düzgün formatda deyil";
    }

    if (isFNameEmpty) emptyErrors.fname = "İstifadəçi adı qeyd edilməlidir";
    if (isLNameEmpty) emptyErrors.lname = "İstifadəçi Soyadı qeyd edilməlidir";
    if (isFatherNameEmpty)
      emptyErrors.fathername = "İstifadəçi Ata adı qeyd edilməlidir";

    if (!phoneNumber?.slice(4).trim())
      emptyErrors.phoneNumber = "Mobil nömrə qeyd edilməlidir.";

    console.log(phoneNumber?.slice(4)?.trim()?.length);

    if (
      phoneNumber?.slice(4)?.trim()?.length !== 9 &&
      phoneNumber?.slice(4)?.trim()?.length > 0
    )
      emptyErrors.phoneNumber = "Mobil nömrə düzgün qeyd edilməlidir.";
    if (isAddressEmpty) emptyErrors.address = "Ünvan qeyd edilməlidir.";

    console.log(emptyErrors);
    setErrors(emptyErrors);

    if (Object.keys(emptyErrors).length !== 0) return;

    try {
      const userData = {
        identityNumber: formData.identityNumber, // Edit-də mövcud identityNumber saxlanmalıdır
        fname: formData.fname,
        lname: formData.lname,
        fathername: formData.fathername,
        email: formData.email,
        status: formData.status,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bDate: formData.bDate,
      };
      console.log(userData);

      if (!id) return;

      let data = await updateUser(id, userData);
      console.log(data);

      navigate(`/list`);
      alert(data.message);
    } catch (err: any) {
      setErrors(err.response?.data?.errors || {});
      console.error(err);
    }
  };

  const handleRadioChange = (value: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
    console.log("Selected:", value ? "Aktiv" : "Passiv");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(formData);
  };
  useEffect(() => {
    setOptions([]);
    roles?.map((d) => {
      console.log(d.name);
      setOptions((prev) => [...prev, { label: d.name, value: d._id }]);
    });
  }, [roles]);
  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setFormData({ ...formData, role: value });
  };
  // const setAddress = (field: string, value: string) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     address: value,
  //   }));
  // };
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

  const countries = [
    { code: "AZ", label: "+994" },
    { code: "TR", label: "+90" },
    { code: "RU", label: "+7" },
    { code: "GE", label: "+995" },
  ];
  const handleBirthDayChange = (dates: Date[], currentDateString: string) => {
    console.log({ dates, currentDateString });
    setFormData({ ...formData, bDate: currentDateString });
  };
  return (
    <ComponentCard title="">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="input-label">Rollar</Label>
            <Select
              options={options}
              placeholder="Select Option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              value={formData.role}
            />
          </div>
          <div>
            <Label htmlFor="fname" className="input-label">
              {errors.fname && (
                <div className="error-message">{errors.fname}</div>
              )}
              Adı
            </Label>
            <Input
              type="text"
              id="fname"
              name="fname"
              onChange={handleChange}
              value={formData.fname}
              className={
                errors.fname
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <Label htmlFor="lname" className="input-label">
              {errors.lname && (
                <div className="error-message">{errors.lname}</div>
              )}
              Soyadı
            </Label>
            <Input
              type="text"
              name="lname"
              onChange={handleChange}
              value={formData.lname}
              id="lname"
              className={
                errors.lname
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <Label htmlFor="fathername" className="input-label">
              {errors.fathername && (
                <div className="error-message">{errors.fathername}</div>
              )}
              Ata adı
            </Label>
            <Input
              type="text"
              name="fathername"
              onChange={handleChange}
              value={formData.fathername}
              id="fathername"
              className={
                errors.fathername
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your father name"
            />
          </div>
          <div>
            <Label htmlFor="address" className="input-label">
              {errors.address && (
                <div className="error-message">{errors.address}</div>
              )}
              Ünvan
            </Label>
            <Input
              type="text"
              id="address"
              name="address"
              onChange={handleChange}
              value={formData.address}
              className={
                errors.address
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator address"
            />
          </div>
          <div>
            <DatePicker
              // className={
              //   errors.bDate
              //     ? "border-2 border-red-500 dark:border-red-500"
              //     : ""
              // }
              value={formData.bDate}
              id="date-picker"
              label="Doğum günü"
              placeholder="Select a date"
              // error={errors.bDate}
              onChange={(dates, currentDateString) =>
                handleBirthDayChange(dates, currentDateString)
              }
            />
          </div>
          <div>
            <Label htmlFor="email" className="input-label">
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
              E-poçt
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className={
                errors.email
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator email"
            />
          </div>
          <div>
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
              value={formData.phoneNumber}
              className={
                errors.phoneNumber
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
            />
          </div>
          {/* <AddressSection address={formData?.address} setAddress={setAddress} /> */}
          <div>
            <Label htmlFor="status" className="input-label">
              {/* {errors.status && (
                <div className="error-message">{errors.status}</div>
              )} */}
              Status
            </Label>
            <div className="flex flex-wrap items-center gap-4">
              <Radio
                id="Aktiv"
                name="status"
                value="true"
                label="Aktiv"
                checked={formData.status === true}
                onChange={() => handleRadioChange(true)}
              />
              <Radio
                id="Passiv"
                name="status"
                value="false"
                label="Passiv"
                checked={formData.status === false}
                onChange={() => handleRadioChange(false)}
              />
            </div>
          </div>
        </div>
        <Button size="sm" type="submit" className="mt-7">
          İstifadəçini yeniləyin
        </Button>
      </form>
    </ComponentCard>
  );
}
