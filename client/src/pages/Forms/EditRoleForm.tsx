import { useEffect, useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import { getAllRoles, updateRole } from "../../services/roleService";
import { useNavigate, useParams } from "react-router";
import PermissionsSectionEdit from "../../components/auth/PermissionSectionEdit";
import PermissionComponent from "../../components/auth/PermissionSectionNew";
import PermissionSectionNewEdit from "../../components/auth/PermissionSectionNewEdit";

// Dinamik sahələr üçün tipləri müəyyən edirik
interface Field {
  name: string;
  type: string;
  required: boolean;
  key: string;
}

export default function EditRoleForm() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<any[]>([]);
  const [permissionsData, setPermissionsData] = useState<any>({
    roles: [],
    finance: {},
    contracts: {},
  });
  const [errors, setErrors] = useState<{
    name?: string;
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
        let roleData = data.find((d) => d._id == roleId);
        if (roleData) {
          setFormData(roleData as typeof formData);
          setPermissionsData(roleData.permissions);
        }
        console.log(roleData);

        setRoles(data); // Rolları state-ə saxlayırıq
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchRoles();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    showName: "",
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

  const handleFieldChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    const newFields = [...formData.fields];

    // Sahənin tipinə uyğun olaraq dəyişiklik edirik
    if (name === "type") {
      newFields[index] = {
        ...newFields[index],
        [name]: value,
      };
    }
    if (name === "name") {
      const newName = value;
      const newKey = toCamelCase(newName);
      newFields[index] = {
        ...newFields[index],
        name: newName,
        key: newKey,
      };
    }
    // Checkbox ilə 'required' sahəsini düzgün idarə edirik
    if (name === "required") {
      newFields[index] = {
        ...newFields[index],
        required: (e.target as HTMLInputElement).checked, // 'checked' dəyərini doğru alırıq
      };
    }

    setFormData((prevData) => ({
      ...prevData,
      fields: newFields,
    }));
  };

  function toCamelCase(str: string) {
    const words = str.trim().split(/\s+/);
    return words
      .map((word, index) => {
        const lower = word.toLowerCase();
        if (index === 0) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join("");
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emptyErrors: typeof errors = {};
    console.log("submir");
    console.log(permissionsData);

    const { name } = formData;

    const isNameEmpty = !name?.trim();

    if (isNameEmpty) emptyErrors.name = "Rol adı qeyd edilməlidir";

    setErrors(emptyErrors);

    if (Object.keys(emptyErrors).length !== 0) return;

    try {
      console.log(formData.permissions);
      console.log(permissionsData);

      if (permissionsData.roles) {
        setPermissionsData({
          roles: {},
        });
      }
      console.log(permissionsData);

      const roleData = {
        ...formData,
        permissions: permissionsData,
      };
      console.log(roleData);
      if (!roleId) return;
      let data = await updateRole(roleId, roleData);
      alert(data.message);
      console.log("Role created:", data);
      navigate("/");
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
    <ComponentCard title="Rol redaktə etmə formu">
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
              placeholder="Enter role name"
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
        {/* <PermissionsSectionEdit
          roles={roles}
          permissions={formData.permissions}
          setFormData={setFormData}
          setPermissionsData={setPermissionsData}
        /> */}
        <PermissionSectionNewEdit
          roles={roles}
          setFormData={setFormData}
          permissions={permissionsData}
          setPermissionsData={setPermissionsData}
        />
        <div className="flex gap-3 mt-6">
          <Button size="sm" type="submit">
            Rolu yadda saxla
          </Button>
          <Button size="sm" variant="outline" onClick={()=> navigate(-1)}>
            Ləğv et
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
