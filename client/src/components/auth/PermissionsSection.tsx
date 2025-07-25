import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Check, X } from "lucide-react";

// Define the interfaces
interface Role {
  _id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    subItems: Array<{
      id: string;
      name: string;
    }>;
  }>;
}

interface PermissionsSectionProps {
  roles: Role[];
  permissions?: {
    roles?: {
      [roleId: string]: {
        create: boolean;
        read: boolean;
        edit: boolean;
        delete: boolean;
      };
    };
    manage_operday?: {
      [itemId: string]: boolean;
    };
    users?: {
      [itemId: string]: boolean;
    };
    contracts?: {
      [itemId: string]: boolean;
    };
  };
  onPermissionChange?: (
    category: string,
    itemId: string,
    checked: boolean
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setPermissionsData: React.Dispatch<React.SetStateAction<any>>;
}

const PermissionsSection: React.FC<PermissionsSectionProps> = ({
  roles ,
  permissions = {
    roles: {},
    users: {},
    contracts: {},
    manage_operday: {},
  },
  onPermissionChange,
  setFormData,
  setPermissionsData,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    "roles"
  );
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  const initializedRef = useRef(false);

  // Initialize permissions object with the restructured format
  const [permissionsState, setPermissionsState] = useState<{
    roles: {
      [roleId: string]: {
        create: boolean;
        read: boolean;
        edit: boolean;
        delete: boolean;
      };
    };
    manage_operday: {
      [itemId: string]: boolean;
    };
    users: {
      [itemId: string]: boolean;
    };
    contracts: {
      [itemId: string]: boolean;
    };
  }>({
    roles: {},
    users: {
      add_user: false,
    },
    contracts: {
      view_documents: false,
      upload_documents: false,
      delete_documents: false,
      view_status: false,
      change_status: false,
    },
    manage_operday: {},
  });

  // Calculate selected sub items based on permissions state
  const calculateSelectedSubItems = () => {
    const selectedSubItems: string[] = [];

    // Add role permissions
    Object.entries(permissionsState.roles).forEach(([roleId, permissions]) => {
      Object.entries(permissions).forEach(([permType, isEnabled]) => {
        if (isEnabled) {
          selectedSubItems.push(`${roleId}-${permType}`);
        }
      });
    });

    // Add other category permissions
    Object.entries(permissionsState).forEach(([category, items]) => {
      if (category !== "roles") {
        Object.entries(items as Record<string, boolean>).forEach(
          ([itemId, isEnabled]) => {
            if (isEnabled) {
              selectedSubItems.push(itemId);
            }
          }
        );
      }
    });

    return selectedSubItems;
  };

  // Derived state - calculate selected sub items whenever permissions change
  const selectedSubItems = calculateSelectedSubItems();

  // Initialize permissions on component mount or when roles change
  useEffect(() => {
    // Initialize role permissions with default values for each role
    const initialRolePermissions = {} as {
      [roleId: string]: {
        create: boolean;
        read: boolean;
        edit: boolean;
        delete: boolean;
      };
    };

    roles.forEach((role) => {
      initialRolePermissions[role._id] = {
        create: false,
        read: false,
        edit: false,
        delete: false,
      };
    });

    // Merge with existing permissions if any
    setPermissionsState((prev) => {
      const newState = {
        ...prev,
        roles: { ...initialRolePermissions, ...(permissions?.roles || {}) },
        manage_operday: {
          ...prev.manage_operday,
          ...(permissions?.manage_operday || {}),
        },
      };

      // Mark that initialization has completed
      initializedRef.current = true;

      return newState;
    });
  }, [roles, permissions]);

  // Handle permission change for a specific role and permission type
  const handleRolePermissionChange = (
    roleId: string,
    permissionType: "create" | "read" | "edit" | "delete",
    checked: boolean
  ) => {
    setPermissionsState((prev) => {
      // Ensure the role exists in the state
      const rolePermissions = prev.roles[roleId] || {
        create: false,
        read: false,
        edit: false,
        delete: false,
      };

      const newState = {
        ...prev,
        roles: {
          ...prev.roles,
          [roleId]: {
            ...rolePermissions,
            [permissionType]: checked,
          },
        },
      };

      // Update the parent form data immediately
      updateParentFormData(newState);

      return newState;
    });

    // Update the parent callback if exists
    if (onPermissionChange) {
      onPermissionChange("roles", `${roleId}-${permissionType}`, checked);
    }
  };

  // Handle permission change for non-role categories
  const handleCategoryPermissionChange = (
    category: string,
    itemId: string,
    checked: boolean
  ) => {
    if (!category) return;

    setPermissionsState((prev) => {
      const categoryPermissions = prev[category as keyof typeof prev] as Record<
        string,
        boolean
      >;

      const newState = {
        ...prev,
        [category]: {
          ...categoryPermissions,
          [itemId]: checked,
        },
      };

      // Update the parent form data immediately
      updateParentFormData(newState);

      return newState;
    });

    // Update the parent callback if exists
    if (onPermissionChange) {
      onPermissionChange(category, itemId, checked);
    }
  };

  // Function to update parent form data
  const updateParentFormData = (newPermissionsState: any) => {
    if (initializedRef.current) {
      setPermissionsData((prevFormData: any) => ({
        ...prevFormData,
        ...newPermissionsState,
      }));
      console.log(newPermissionsState);

      console.log(
        "Permissions updated in parent form",
        newPermissionsState.roles
      );
    }
  };

  // Function to handle category click
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedItem(null);
    setSelectedSubItem(null);
  };

  // Function to handle item click
  const handleItemClick = (itemId: string) => {
    setSelectedItem(itemId);
    setSelectedSubItem(null);
  };

  // Function to determine if a subitem is a role permission
  const isRolePermission = (subItemId: string): boolean => {
    return subItemId.includes("-") && selectedCategory === "roles";
  };

  // Function to handle subitem selection
  const handleSubItemSelection = (subItemId: string) => {
    setSelectedSubItem(subItemId);

    // Check if this subitem is already selected/enabled
    const isSelected = selectedSubItems.includes(subItemId);

    if (isRolePermission(subItemId)) {
      // Handle role permissions
      const [roleId, permType] = subItemId.split("-");
      if (["create", "read", "edit", "delete"].includes(permType)) {
        handleRolePermissionChange(
          roleId,
          permType as "create" | "read" | "edit" | "delete",
          !isSelected // Toggle the permission
        );
      }
    } else if (selectedCategory) {
      // Handle other category permissions
      handleCategoryPermissionChange(
        selectedCategory,
        subItemId,
        !isSelected // Toggle the permission
      );
    }
  };
  const clearAllPermissions = () => {
    setPermissionsState((prev) => {
      const resetRoles = Object.fromEntries(
        Object.entries(prev.roles).map(([roleId]) => [
          roleId,
          {
            create: false,
            read: false,
            edit: false,
            delete: false,
          },
        ])
      );

      const newState = {
        ...prev,
        roles: resetRoles,
        manage_operday: {},
        users: {},
        contracts:{},
      };

      updateParentFormData(newState);

      return newState;
    });
  };
  const menuItems: MenuItem[] = [
    {
      id: "roles",
      name: "İstifadəçilər",
      items: roles.map((role) => ({
        id: role._id,
        name: role.name,
        subItems: [
          { id: `${role._id}-create`, name: "Yarat" },
          { id: `${role._id}-read`, name: "Oxu" },
          { id: `${role._id}-edit`, name: "Redaktə et" },
          { id: `${role._id}-delete`, name: "Sil" },
        ],
      })),
    },
    // {
    //   id: "users",
    //   name: "İstifadəçilər",
    //   items: [
    //     {
    //       id: "manage_users",
    //       name: "İstifadəçiləri İdarə Et",
    //       subItems: [
    //         { id: "view_users", name: "Bax" },
    //         { id: "add_user", name: "Əlavə Et" },
    //         { id: "edit_user", name: "Redaktə Et" },
    //         { id: "delete_user", name: "Sil" },
    //       ],
    //     },
    //     {
    //       id: "manage_roles",
    //       name: "Rolları İdarə Et",
    //       subItems: [
    //         { id: "view_roles", name: "Rollara Bax" },
    //         { id: "edit_roles", name: "Rol Redaktə Et" },
    //       ],
    //     },
    //   ],
    // },
    {
      id: "contracts",
      name: "Müqavilələr",
      items: [
        {
          id: "contract_documents",
          name: "Sənədlər",
          subItems: [
            { id: "view_documents", name: "Bax" },
            { id: "upload_documents", name: "Yüklə" },
            { id: "delete_documents", name: "Sil" },
          ],
        },
        {
          id: "contract_status",
          name: "Müqavilə Statusu",
          subItems: [
            { id: "view_status", name: "Statusa Bax" },
            { id: "change_status", name: "Statusu Dəyiş" },
          ],
        },
      ],
    },
    // {
    //   id: "services",
    //   name: "Xidmətlər",
    //   items: [
    //     {
    //       id: "technical_service",
    //       name: "Texniki Xidmət",
    //       subItems: [
    //         { id: "view_schedule", name: "Cədvələ Bax" },
    //         { id: "edit_schedule", name: "Cədvəli Redaktə Et" },
    //         { id: "add_report", name: "Hesabat Əlavə Et" },
    //       ],
    //     },
    //     {
    //       id: "installation",
    //       name: "Quraşdırma",
    //       subItems: [
    //         { id: "view_installations", name: "Tapşırıqlara Bax" },
    //         { id: "add_installation", name: "Əlavə Et" },
    //       ],
    //     },
    //     {
    //       id: "warranty_service",
    //       name: "Zəmanət Xidməti",
    //       subItems: [
    //         { id: "view_warranty", name: "Statusa Bax" },
    //         { id: "activate_warranty", name: "Aktiv Et" },
    //         { id: "deactivate_warranty", name: "Bitir" },
    //       ],
    //     },
    //   ],
    // },
  ];

  const activeCategory = menuItems.find((item) => item.id === selectedCategory);

  const activeItems = activeCategory?.items || [];

  const activeSubItems = (() => {
    const activeItem = activeItems.find((item) => item.id === selectedItem);
    return activeItem?.subItems || [];
  })();

  return (
    <div className="w-full flex flex-col relative border border-gray-200 dark:border-gray-700">
      <div className="flex flex-1">
        {/* First Column - Categories */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedCategory === item.id
                  ? "bg-gray-100 dark:bg-gray-800"
                  : ""
              }`}
              onClick={() => handleCategoryClick(item.id)}
            >
              <div className="flex items-center justify-between">
                <span>{item.name}</span>
                {item.items.length > 0 && <ChevronRight className="h-4 w-4" />}
              </div>
            </div>
          ))}
        </div>

        {/* Second Column - Items */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
          {activeItems.length > 0 ? (
            activeItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 cursor-pointer border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  selectedItem === item.id ? "bg-gray-100 dark:bg-gray-800" : ""
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <div className="flex items-center justify-between">
                  <span>{item.name}</span>
                  {item.subItems && item.subItems.length > 0 && (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-gray-500">
              Bu kateqoriya üçün element yoxdur
            </div>
          )}
        </div>

        {/* Third Column - SubItems */}
        <div className="w-1/3 p-4">
          {activeSubItems.length > 0 ? (
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white mb-4">
                {activeItems.find((item) => item.id === selectedItem)?.name}
              </h3>
              <div className="space-y-2">
                {activeSubItems.map((subItem) => {
                  // Check if this is a role permission subitem
                  let isChecked = selectedSubItems.includes(subItem.id);
                  return (
                    <div
                      key={subItem.id}
                      className={`p-2 cursor-pointer rounded flex justify-between items-center ${
                        isChecked
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleSubItemSelection(subItem.id)}
                    >
                      <span>{subItem.name}</span>
                      {isChecked ? (
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <div className="h-4 w-4 border border-gray-300 dark:border-gray-600 rounded"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              {selectedItem
                ? "Əlavə məlumat yoxdur"
                : "Təfsilatı görmək üçün element seçin"}
            </div>
          )}
        </div>
      </div>

      {/* Selected Items Panel */}
      {selectedSubItems.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800 dark:text-white">
              Seçilmiş İcazələr ({selectedSubItems.length})
            </h3>
            <button
              className="text-red-500 hover:text-red-700 flex items-center text-sm"
              onClick={clearAllPermissions}
            >
              <X className="h-4 w-4 mr-1" />
              Hamısını Sil
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
            {selectedSubItems.map((subItemId) => {
              // Find which category and item this subitem belongs to
              let categoryName = "";
              let itemName = "";
              let subItemName = "";

              // Search through all categories and items to find matching subitem
              menuItems.forEach((category) => {
                category.items.forEach((item) => {
                  const foundSubItem = item.subItems.find(
                    (si) => si.id === subItemId
                  );
                  if (foundSubItem) {
                    categoryName = category.name;
                    itemName = item.name;
                    subItemName = foundSubItem.name;
                  }
                });
              });

              // If this is a role permission, handle it specially
              if (isRolePermission(subItemId)) {
                const [roleId, permType] = subItemId.split("-");
                const role = roles.find((r) => r._id === roleId);
                if (role) {
                  categoryName = "Roles";
                  itemName = role.name;
                  subItemName =
                    permType.charAt(0).toUpperCase() + permType.slice(1);
                }
              }

              return (
                <div
                  key={subItemId}
                  className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div className="text-sm truncate flex-1">
                    <span className="font-medium">{subItemName}</span>
                    <div className="text-xs text-gray-500 truncate">
                      {categoryName} &gt; {itemName}
                    </div>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 ml-2"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isRolePermission(subItemId)) {
                        // For role permissions
                        const [roleId, permType] = subItemId.split("-");
                        if (
                          ["create", "read", "edit", "delete"].includes(
                            permType
                          )
                        ) {
                          handleRolePermissionChange(
                            roleId,
                            permType as "create" | "read" | "edit" | "delete",
                            false
                          );
                        }
                      } else if (selectedCategory) {
                        // For other permissions
                        const category =
                          menuItems.find((item) =>
                            item.items.some((i) =>
                              i.subItems.some((si) => si.id === subItemId)
                            )
                          )?.id || selectedCategory;

                        handleCategoryPermissionChange(
                          category,
                          subItemId,
                          false
                        );
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        <div className="text-sm text-gray-600 dark:text-gray-400 italic">
          Siz dəyişikliklər etdikcə icazələr avtomatik olaraq yadda saxlanılır
        </div>
      </div>
    </div>
  );
};

export default PermissionsSection;
