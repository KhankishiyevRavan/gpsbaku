import { useState, useEffect } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { getAllRoles, getRoleById } from "../../services/roleService";
import { getUser, updateUser } from "../../services/userService";
import Select from "../../components/form/Select";
import Radio from "../../components/form/input/Radio";
import DatePicker from "../../components/form/date-picker";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import AddressSection from "../../components/form/AddressSection";
import PhoneInputAz from "../../components/form/group-input/PhoneInputAz";
// Sahə tipini təyin edirik
interface Field {
  name: string;
  type: string;
  required: boolean;
  key: string;
  value?: string | boolean | Date | null; // Dinamik sahələrin qiyməti
}

export default function EditUserForm() {
  const navigate = useNavigate();
  // const roleName = localStorage.getItem("role");
  const [roleFields, setRoleFields] = useState<Field[]>([]); // Dinamik sahələr
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    dynamicFields: {
      address: {
        street: "",
        city: "",
        state: "",
        postCode: "",
        category: "",
      },
    },
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Xətalar
  const { role, id } = useParams<{ role: string; id: string }>(); // Role params ilə alırıq
  const [roleId, setRoleId] = useState<string>("");
  const [roles, setRoles] = useState<any[]>([]);
  const [roleName, setRoleName] = useState<string>("");
  const [options, setOptions] = useState<any[]>([]);
  useEffect(() => {
    const fetchRoleFields = async () => {
      console.log(role);

      if (!role) return; // Eğer role undefined veya boşsa, devam etmeyelim
      try {
        const data = await getRoleById(role); // Role məlumatlarını alırıq
        console.log(data);

        // Role ID və sahələri state-ə əlavə edirik
        setRoleId(data?._id || ""); // ID gəlməzsə boş dəyər təyin et
        setRoleFields(data?.fields || []); // Role sahələri təyin edirik
        // navigator("/")
      } catch (err: any) {
        console.error("Error fetching role data:", err); // Səhv baş verərsə konsola yazdırırıq
      }
    };

    fetchRoleFields();
  }, [role]); // `
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
  useEffect(() => {
    setOptions([]);
    roles?.map((d) => {
      console.log(d.name);
      setOptions((prev) => [...prev, { label: d.name, value: d._id }]);
    });
    let roleNameInfo: any = roles?.find((r) => r._id == role);
    console.log(roleNameInfo?.name);
    setRoleName(roleNameInfo?.name);
  }, [roles]);
  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    console.log(name);

    if (type === "checkbox" || type === "radio") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const generateIdentityNumber = () => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8 rəqəmli random number
    return `OP${randomNum}`;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors: { [key: string]: string } = {};
    console.log(formData);

    roleFields.forEach((field) => {
      let value;

      if (field.type === "address") {
        // Nested object validation
        const address = formData.dynamicFields?.address;
        if (!address || !address.street || !address.city) {
          validationErrors[field.key] = `${field.key} is required`;
        }
      } else {
        // Normal flat fields
        value = formData[field.key];
        if (
          field.required &&
          (value === undefined || value === null || value === "")
        ) {
          validationErrors[field.key] = `${field.key} is required`;
        }
      }
    });

    // Əgər error varsa, göstər və çıx
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    try {
      if (!formData.permissions) {
        formData.permissions = {
          create: false,
          read: false,
          edit: false,
          delete: false,
        };
      }
      const userData = {
        // Statik sahələr
        identityNumber: "",
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        dynamicFields: {
          ...roleFields.reduce((acc: { [key: string]: any }, field: Field) => {
            if (
              !["fname", "lname", "email", "password", "status"].includes(
                field.key
              ) &&
              field.type !== "address"
            ) {
              acc[field.key] = formData[field.key];
            }
            return acc;
          }, {} as { [key: string]: any }),
          address: formData.dynamicFields.address,
        },
      };
      userData.identityNumber = generateIdentityNumber();
      console.log(userData);
      if (!id) return;
      let data = await updateUser(id, userData);
      if (!role) return;
      let roleInfo = await getRoleById(role);
      alert(data.message);
      navigate(`/list/${roleInfo.name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectChange = (value: string) => {
    console.log("Selected value:", value);
    setFormData({ ...formData, role: value });
  };
  const handleRadioChange = (value: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
    console.log("Selected:", value ? "Aktiv" : "Passiv");
  };
  const countries = [
    { code: "AZ", label: "+994" },
    { code: "TR", label: "+90" },
    { code: "RU", label: "+7" },
    { code: "GE", label: "+995" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
    setFormData({ ...formData, phoneNumber: phoneNumber });
  };
  const setAddress = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      dynamicFields: {
        ...prevData.dynamicFields,
        address: {
          ...prevData.dynamicFields?.address,
          [field]: value,
        },
      },
    }));
  };
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  return (
    <ComponentCard title="Edit User Form">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="input-label">Rollar</Label>
            <Select
              options={options}
              placeholder="Select Option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              defaultValue={"dev"}
            />
          </div>
          {roleFields.map((field, index) => (
            <div key={index}>
              <Label className="input-label">
                {errors[field.key] && (
                  <div className="error-message">{errors[field.key]}</div>
                )}
                {field.name}
              </Label>
              {(field.type === "string" || field.type === "number") && (
                <Input
                  type={field.type == "number" ? "number" : "text"}
                  name={field.key}
                  onChange={handleFieldChange}
                  value={formData[field.key] || ""}
                  className={errors[field.key] ? "border-2 border-red-500" : ""}
                />
              )}

              {field.type === "select" && (
                <select
                  name={field.key}
                  onChange={handleFieldChange}
                  value={formData[field.key] || ""}
                  className={errors[field.key] ? "border-2 border-red-500" : ""}
                >
                  <option value="">Select an option</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                </select>
              )}
              {field.type === "phoneNumber" && (
                <PhoneInputAz
                  selectPosition="end"
                  countries={countries}
                  placeholder="+994 (55) 000-00-00"
                  onChange={handlePhoneNumberChange}
                />
              )}

              {field.type === "radio" && (
                <div className="flex items-center gap-3 col-span-full">
                  <div className="flex flex-wrap items-center gap-4">
                    <Radio
                      id="Aktiv"
                      name={field.key}
                      value="true"
                      label="Aktiv"
                      checked={formData[field.key] === true}
                      onChange={() => handleRadioChange(true)}
                    />
                    <Radio
                      id="Passiv"
                      name={field.key}
                      value="false"
                      label="Passiv"
                      checked={formData[field.key] === false}
                      onChange={() => handleRadioChange(false)}
                    />
                  </div>
                </div>
              )}

              {field.type === "date" && (
                <DatePicker
                  id="date-picker"
                  label=""
                  placeholder="Select a date"
                  value={formData[field.key] || ""}
                  onChange={(dates, currentDateString) => {
                    setFormData({
                      ...formData,
                      [field.key]: currentDateString,
                    });
                    // console.log({ dates, currentDateString });
                  }}
                />
              )}

              {field.type === "address" && (
                <>
                  <AddressSection
                    address={formData?.dynamicFields?.address}
                    setAddress={setAddress}
                  />
                </>
              )}

              {field.type === "boolean" && (
                <div className="flex items-center gap-3 col-span-full">
                  <Label className="m-0">Status:</Label>
                  <div className="flex flex-wrap items-center gap-4">
                    <Radio
                      id="Aktiv"
                      name={field.key}
                      value="true"
                      label="Aktiv"
                      checked={formData[field.key] === true}
                      onChange={() => handleRadioChange(true)}
                    />
                    <Radio
                      id="Passiv"
                      name={field.key}
                      value="false"
                      label="Passiv"
                      checked={formData[field.key] === false}
                      onChange={() => handleRadioChange(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <Button size="sm" type="submit">
            Update User
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
