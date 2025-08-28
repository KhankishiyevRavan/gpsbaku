import React, { useEffect, useState } from "react";
import isEqual from "lodash.isequal"; // lodash-dan `isEqual` istifadə edək (install et: `npm i lodash.isequal`)

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

interface Role {
  _id: string;
  name: string;
}

interface PermissionsSectionProps {
  roles: Role[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setPermissionsData: React.Dispatch<React.SetStateAction<any>>;
  permissions?: {
    roles?: any; // array və ya object ola bilər
    finance?: { [itemId: string]: boolean };
    contracts?: { [itemId: string]: boolean };
  };
}

type PermType = "create" | "read" | "edit" | "delete";

const PermissionComponent: React.FC<PermissionsSectionProps> = ({
  roles,
  setFormData,
  permissions,
  setPermissionsData,
}) => {
  // useEffect(() => {
  //   if (permissions?.roles) {
  //     const cleanedRoles = Array.isArray(permissions.roles)
  //       ? permissions.roles.filter((r: any) =>
  //           roles.some((role) => role._id === r.role)
  //         )
  //       : Object.keys(permissions.roles)
  //           .filter((roleId) => roles.some((role) => role._id === roleId))
  //           .reduce((acc: any, roleId) => {
  //             acc[roleId] = permissions.roles[roleId];
  //             return acc;
  //           }, {});

  //     if (
  //       (Array.isArray(cleanedRoles) &&
  //         cleanedRoles.length !== permissions.roles.length) ||
  //       (!Array.isArray(cleanedRoles) &&
  //         Object.keys(cleanedRoles).length !==
  //           Object.keys(permissions.roles).length)
  //     ) {
  //       setPermissionsData((prev: any) => ({
  //         ...prev,
  //         roles: cleanedRoles,
  //       }));
  //     }
  //   }
  // }, [permissions?.roles, roles, setPermissionsData]);
  const [sectionActive, setSectionActive] = useState<{
    [key: string]: boolean;
  }>({});

  // 🔔 Normalize roles: always as array
  const normalizedRoles = Array.isArray(permissions?.roles)
    ? permissions?.roles
    : permissions?.roles
    ? Object.keys(permissions.roles).map((roleId) => ({
        role: roleId,
        permissions: permissions.roles[roleId],
      }))
    : [];

  useEffect(() => {
    if (normalizedRoles.length === 0 && roles.length > 0) {
      const defaultRoles = roles.map((role) => ({
        role: role._id,
        permissions: {
          create: false,
          read: false,
          edit: false,
          delete: false,
        },
      }));
      setPermissionsData((prev: any) => ({
        ...prev,
        roles: defaultRoles,
      }));
    }
  }, [roles, normalizedRoles, setPermissionsData]);

  const handleMainToggle = (key: string, checked: boolean) => {
    setSectionActive((prev) => ({ ...prev, [key]: checked }));

    if (!checked) {
      setPermissionsData((prev: any) => {
        const updated = { ...prev };
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
        }
        return updated;
      });
    }
  };

  const handleSubPermissionChange = (
    sectionKey: string,
    permKey: string,
    value: boolean
  ) => {
    setPermissionsData((prev: any) => ({
      ...prev,
      [sectionKey]: {
        ...(prev?.[sectionKey] || {}),
        [permKey]: value,
      },
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
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [type]: value,
              },
            }
          : r
      ),
    }));
  };
  // useEffect(() => {
  //   const updatedSectionActive: { [key: string]: boolean } = {};
  //   permissionsConfig.forEach((section) => {
  //     if (section.key === "roles") {
  //       // Roles üçün ayrıca yoxlama
  //       const hasAnyRolePermission = normalizedRoles.some((r: any) =>
  //         Object.values(r.permissions || {}).some(Boolean)
  //       );
  //       updatedSectionActive[section.key] = hasAnyRolePermission;
  //     } else {
  //       const sectionPerms = (permissions as any)?.[section.key] || {};
  //       const hasAnySubPermission = section.subPermissions.some(
  //         (sub) => sectionPerms[sub.key]
  //       );
  //       updatedSectionActive[section.key] = hasAnySubPermission;
  //     }
  //   });
  //   setSectionActive(updatedSectionActive);
  // }, [permissions, normalizedRoles]);

  useEffect(() => {
    if (permissions?.roles) {
      const cleanedRoles = Array.isArray(permissions.roles)
        ? permissions.roles.filter((r: any) =>
            roles.some((role) => role._id === r.role)
          )
        : Object.keys(permissions.roles)
            .filter((roleId) => roles.some((role) => role._id === roleId))
            .reduce((acc: any, roleId) => {
              acc[roleId] = permissions.roles[roleId];
              return acc;
            }, {});

      const isDifferent = !isEqual(cleanedRoles, permissions.roles);

      if (isDifferent) {
        setPermissionsData((prev: any) => ({
          ...prev,
          roles: cleanedRoles,
        }));
      }
    }
  }, [permissions?.roles, roles, setPermissionsData]);

  useEffect(() => {
    const hasRoles =
      permissions?.roles &&
      ((Array.isArray(permissions.roles) && permissions.roles.length > 0) ||
        (!Array.isArray(permissions.roles) &&
          Object.keys(permissions.roles).length > 0));

    if (!hasRoles && roles.length > 0) {
      const defaultRoles = roles.map((role) => ({
        role: role._id,
        permissions: {
          create: false,
          read: false,
          edit: false,
          delete: false,
        },
      }));
      setPermissionsData((prev: any) => ({
        ...prev,
        roles: defaultRoles,
      }));
    }
  }, [permissions?.roles, roles, setPermissionsData]);

  return (
    <div className="space-y-6">
      {permissionsConfig.map((section) => (
        <div key={section.key} className="border p-4 rounded-md">
          <label className="flex items-center gap-2 font-semibold">
            <input
              type="checkbox"
              checked={sectionActive[section.key] || false}
              onChange={(e) => handleMainToggle(section.key, e.target.checked)}
              disabled={(() => {
                if (section.key === "roles") {
                  return normalizedRoles.some((r: any) =>
                    Object.values(r.permissions || {}).some(Boolean)
                  );
                } else {
                  const sectionPerms =
                    (permissions as any)?.[section.key] || {};
                  return section.subPermissions.some(
                    (sub) => sectionPerms[sub.key]
                  );
                }
              })()}
            />
            {section.label}
          </label>

          {sectionActive[section.key] && (
            <>
              {section.key === "roles" ? (
                <div className="mt-2 space-y-2 ml-4">
                  {roles.map((role) => {
                    const roleItem = normalizedRoles.find(
                      (r: any) => r.role === role._id
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
                          ).map((permType) => (
                            <label
                              key={permType}
                              className="flex items-center gap-1"
                            >
                              <input
                                type="checkbox"
                                checked={rolePerm[permType]}
                                onChange={(e) =>
                                  handleRolePermissionChange(
                                    role._id,
                                    permType,
                                    e.target.checked
                                  )
                                }
                              />
                              {permType}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : section.subPermissions.length > 0 ? (
                <div className="ml-4 mt-2 space-y-2">
                  {section.subPermissions.map((sub) => (
                    <label key={sub.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          ((permissions as any)?.[section.key]?.[
                            sub.key
                          ] as boolean) || false
                        }
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
              ) : (
                <p className="text-sm text-gray-500 mt-2 ml-4">
                  Alt icazə yoxdur
                </p>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default PermissionComponent;
