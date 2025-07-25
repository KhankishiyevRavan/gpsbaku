import React from "react";
// import { Check, X } from 'lucide-react';

interface PermissionsSectionProps {
  roles: any[]; // Rol məlumatları
  permissions: {
    [key: string]: {
      create: boolean;
      read: boolean;
      edit: boolean;
      delete: boolean;
    };
  }; // Permissions verilənləri
  onPermissionChange: (
    roleName: string,
    permissionType: "create" | "read" | "edit" | "delete",
    checked: boolean
  ) => void;
}

const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  roles,
  permissions,
  onPermissionChange,
}) => {
  // Permission növləri
  const permissionTypes = [
    { key: "create", label: "Yaratmaq" },
    { key: "read", label: "Görmək" },
    { key: "edit", label: "Redaktə" },
    { key: "delete", label: "Silmək" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="py-3 px-4 font-medium">Rol</th>
              {permissionTypes.map((type) => (
                <th
                  key={type.key}
                  className="py-3 px-4 font-medium text-center"
                >
                  {type.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr
                key={role._id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30"
              >
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                  {role.name}
                </td>
                {permissionTypes.map((type) => (
                  <td
                    key={`${role._id}-${type.key}`}
                    className="py-2 px-4 text-center"
                  >
                    <button
                      onClick={() =>
                        onPermissionChange(
                          role._id,
                          type.key as "create" | "read" | "edit" | "delete",
                          !permissions?.[role._id]?.[
                            type.key as keyof (typeof permissions)[string]
                          ]
                        )
                      }
                      className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${
                        permissions?.[role._id]?.[
                          type.key as keyof (typeof permissions)[string]
                        ]
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {permissions?.[role._id]?.[
                        type.key as keyof (typeof permissions)[string]
                      ]
                        ? 1
                        : // <Check size={14} />
                          2 // <X size={14} />
                      }
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionsSection;
