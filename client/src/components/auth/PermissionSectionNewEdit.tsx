import React, { useEffect, useState } from "react";
import { useMemo } from "react";

const permissionsConfig = [
  {
    key: "finance",
    label: "Maliyyə",
    subPermissions: [
      { key: "addBalance", label: "Balans əlavə et" },
      { key: "makePayment", label: "Ödəniş et" },
      { key: "viewPayments", label: "Ödənişlərə bax" },
    ],
  },
  {
    key: "roles",
    label: "İstifadəçilər",
    subPermissions: [],
  },
  {
    key: "contracts",
    label: "Müqavilələr",
    subPermissions: [
      { key: "change_status", label: "Statusu dəyiş" },
      { key: "delete_documents", label: "Silmək" },
      { key: "upload_documents", label: "Yükləmək" },
      { key: "view_documents", label: "Baxmaq" },
      { key: "view_status", label: "Statusa baxmaq" },
    ],
  },
];

type PermType = "create" | "read" | "edit" | "delete";

interface Role {
  _id: string;
  name: string;
}

interface PermissionsSectionProps {
  roles: Role[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setPermissionsData: React.Dispatch<React.SetStateAction<any>>;
  permissions?: {
    roles?: any;
    finance?: { [key: string]: boolean };
    contracts?: { [key: string]: boolean };
  };
}

const PermissionSectionNewEdit: React.FC<PermissionsSectionProps> = ({
  roles,
  setFormData,
  permissions,
  setPermissionsData,
}) => {
  const [sectionActive, setSectionActive] = useState<{
    [key: string]: boolean;
  }>({});

  const normalizedRoles = useMemo(() => {
    return roles.map((role) => {
      const existing = Array.isArray(permissions?.roles)
        ? permissions.roles.find((r: any) => r.role === role._id)
        : permissions?.roles && permissions.roles[role._id]
        ? { role: role._id, permissions: permissions.roles[role._id] }
        : null;

      return {
        role: role._id,
        permissions: existing?.permissions || {
          create: false,
          read: false,
          edit: false,
          delete: false,
        },
      };
    });
  }, [permissions?.roles, roles]);

  // Init sectionActive from backend permissions
  useEffect(() => {
    const initial: { [key: string]: boolean } = {};
    permissionsConfig.forEach((section) => {
      if (section.key === "roles") {
        const hasRolePerms = normalizedRoles.some((r) =>
          Object.values(r.permissions || {}).some(Boolean)
        );
        initial[section.key] = hasRolePerms;
      } else {
        const perms = permissions?.[section.key] || {};
        const anyChecked = section.subPermissions.some((sub) => perms[sub.key]);
        initial[section.key] = anyChecked;
      }
    });
    setSectionActive(initial);
  }, [permissions, normalizedRoles]);

const handleMainToggle = (key: string, checked: boolean) => {
  setSectionActive((prev) => ({ ...prev, [key]: checked }));

  setPermissionsData((prev: any) => {
    const updated = { ...prev };
    if (checked) {
      if (key === "roles") {
        updated.roles = normalizedRoles.map((r: any) => ({
          ...r,
          permissions: {
            create: false,
            read: false,
            edit: false,
            delete: false,
          },
        }));
      } else {
        updated[key] = {};
        permissionsConfig
          .find((s) => s.key === key)
          ?.subPermissions.forEach((sub) => {
            updated[key][sub.key] = false;
          });
      }
    } else {
      if (key === "roles") {
        updated.roles = normalizedRoles.map((r: any) => ({
          ...r,
          permissions: {
            create: false,
            read: false,
            edit: false,
            delete: false,
          },
        }));
      } else {
        updated[key] = {};
        permissionsConfig
          .find((s) => s.key === key)
          ?.subPermissions.forEach((sub) => {
            updated[key][sub.key] = false;
          });
      }
    }
    return updated;
  });
};


  const handleSubPermissionChange = (
    sectionKey: string,
    permKey: string,
    value: boolean
  ) => {
    setPermissionsData((prev: any) => ({
      ...prev,
      [sectionKey]: { ...(prev?.[sectionKey] || {}), [permKey]: value },
    }));
  };

  const handleRolePermissionChange = (
    roleId: string,
    type: PermType,
    value: boolean
  ) => {
    setPermissionsData((prev: any) => ({
      ...prev,
      roles: normalizedRoles.map((r: any) =>
        r.role === roleId
          ? { ...r, permissions: { ...r.permissions, [type]: value } }
          : r
      ),
    }));
  };

  return (
    <div className="space-y-6">
      {permissionsConfig.map((section) => (
        <div key={section.key} className="border p-4 rounded-md">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={sectionActive[section.key] || false}
              onChange={(e) => handleMainToggle(section.key, e.target.checked)}
            />
            {section.label}
          </label>

          {sectionActive[section.key] && (
            <>
              {section.key === "roles" ? (
                <div className="ml-4 mt-2 space-y-2">
                  {roles.map((role) => {
                    const roleItem = normalizedRoles.find(
                      (r) => r.role === role._id
                    );
                    const rolePerm = roleItem?.permissions || {
                      create: false,
                      read: false,
                      edit: false,
                      delete: false,
                    };
                    return (
                      <div key={role._id}>
                        <div className="font-semibold">{role.name}</div>
                        <div className="flex gap-4 ml-4 mt-1">
                          {(
                            ["create", "read", "edit", "delete"] as PermType[]
                          ).map((perm) => (
                            <label
                              key={perm}
                              className="flex items-center gap-1"
                            >
                              <input
                                type="checkbox"
                                checked={rolePerm[perm]}
                                onChange={(e) =>
                                  handleRolePermissionChange(
                                    role._id,
                                    perm,
                                    e.target.checked
                                  )
                                }
                              />
                              {perm}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="ml-4 mt-2 space-y-2">
                  {section.subPermissions.map((sub) => (
                    <label key={sub.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={permissions?.[section.key]?.[sub.key] || false}
                        onChange={(e) =>
                          handleSubPermissionChange(
                            section.key,
                            sub.key,
                            e.target.checked
                          )
                        }
                      />
                      {sub.label}
                    </label>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PermissionSectionNewEdit;
