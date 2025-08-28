import { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { createRole, getAllRoles } from "../../services/roleService";
import PermissionsSection from "../../components/auth/PermissionsSection";
import { useNavigate } from "react-router";
import PermissionComponent from "../../components/auth/PermissionSectionNew";

// Dinamik sahələr üçün tipləri müəyyən edirik
interface Field {
  name: string;
  type: string;
  required: boolean;
  key: string;
}

export default function CreateRoleForm() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [permissionsData, setPermissionsData] = useState<any>({
    roles: {},
    finance: {},
    contracts: {},
  });

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    fields?: string[];
  }>({});
  const toEnglish = (text: string): string => {
    const map: Record<string, string> = {
      ç: "c",
      ə: "e",
      ğ: "g",
      ı: "i",
      ö: "o",
      ş: "s",
      ü: "u",
      Ç: "c",
      Ə: "e",
      Ğ: "g",
      I: "i",
      İ: "i",
      Ö: "o",
      Ş: "s",
      Ü: "u",
    };
    return text.replace(/[çəğıöşüÇƏĞIÖŞÜ]/g, (char) => map[char] || char);
  };

  const formatName = (text: string): string => {
    const englishText = toEnglish(text);
    return englishText.toLowerCase().replace(/\s+/g, ""); // boşluqları silir
  };
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles(); // Backend-dən bütün rolları alırıq
        console.log(data);

        setRoles(data); // Rolları state-ə saxlayırıq
      } catch (err) {
        console.error("Error fetching roles:", err);
        alert("Naməlum xəta")
      }
    };
    fetchRoles();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    showName: "",
    // description: "",
    roleType: "user",
    permissions: {} as {
      [key: string]: {
        create: boolean;
        read: boolean;
        edit: boolean;
        delete: boolean;
      };
    }, // Permissions will be tracked per role
    fields: [
      { key: "fname", name: "Adı", type: "string", required: true },
      { key: "lname", name: "Soyadı", type: "string", required: true },
      { key: "fathername", name: "Ata adı", type: "string", required: true },
      { key: "email", name: "E-poçt", type: "string", required: true },
      // { key: "position", name: "Pozisiyası", type: "string", required: true },
      { key: "password", name: "Şifrə", type: "string", required: true },
      { key: "status", name: "Status", type: "boolean", required: true },
    ] as Field[], // Dinamik sahələr
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") {
      const normalizedName = formatName(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: normalizedName,
        showName: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emptyErrors: typeof errors = {};
    console.log("submir");
    console.log(permissionsData);

    const { name } = formData;
    const isNameEmpty = !name?.trim();
    if (isNameEmpty) emptyErrors.name = "Rol adı qeyd olunmalıdır";

    setErrors(emptyErrors);

    if (Object.keys(emptyErrors).length !== 0) return;

    try {
      console.log(formData.permissions);
      console.log(permissionsData);

      console.log(permissionsData);

      const roleData = {
        ...formData,
        permissions: permissionsData,
      };
      console.log(roleData);

      let data = await createRole(roleData);
      alert(data.message);
      console.log("Role created:", data);
      navigate("/roles");
    } catch (err: any) {
      console.error(err);

      setErrors(err.response?.data?.errors || {});

      if (err.response?.data?.message) {
        console.log(err);
        alert(err.response?.data?.message);
      }
    }
  };
  return (
    <ComponentCard title="">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Role Name */}
          <div>
            <Label htmlFor="name" className="input-label">
              {errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
              Rol adı
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={formData.showName}
              className={errors.name ? "border-2 border-red-500" : ""}
              placeholder="Məsələn: Abunəçi"
            />
          </div>
        </div>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5"></div>
        <div></div>
        {/* Permissions Section */}

        {/* <PermissionsSection
          roles={roles}
          permissions={formData.permissions}
          setFormData={setFormData}
          setPermissionsData={setPermissionsData}
        /> */}
        {/* <PermissionComponent
          roles={roles}
          setFormData={setFormData}
          permissions={permissionsData}
          setPermissionsData={setPermissionsData}
        /> */}
        <div className="flex gap-3 mt-6">
          <Button size="sm" type="submit">
            Rolu yadda saxla
          </Button>
          <Button size="sm" variant="outline" onClick={()=>navigate(-1)}>
            Ləğv et
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
