import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  ChevronDownIcon,
  DocsIcon,
  DollarLineIcon,
  GroupIcon,
  PencilIcon,
  PieChartIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { ListIcon, LocationEditIcon } from "lucide-react";
interface permissionsDataInterface {
  roles: Array<{
    role: string; // ya ObjectId string kimi
    permissions: {
      create: boolean;
      read: boolean;
      edit: boolean;
      delete: boolean;
    };
  }>;
  contracts: {
    change_status: boolean;
    delete_documents: boolean;
    upload_documents: boolean;
    view_documents: boolean;
    view_status: boolean;
  };
  finance: {
    addBalance: boolean;
    makePayment: boolean;
    viewPayments: boolean;
  };
  users: {
    add_user: boolean;
  };
}

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [permissions, setPermissions] =
    useState<permissionsDataInterface | null>(null);
  const [localExpandedInitialized, setLocalExpandedInitialized] =
    useState(false);
  useEffect(() => {
    const storedExpanded = localStorage.getItem("sidebarExpanded");
    if (storedExpanded !== null && storedExpanded !== String(isExpanded)) {
      toggleSidebar();
    }
    setLocalExpandedInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // let permissions = [];
  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      try {
        const parsedPermissions = JSON.parse(storedPermissions);
        if (Array.isArray(parsedPermissions.roles)) {
          setPermissions(parsedPermissions);
        }
      } catch (err) {
        console.error("Could not parse permissions from localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("role");
      setRole(updatedRole);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // İcazələr ya admindirsə həmişə true, ya da normal icazə

  const isAdmin = role === "admin";

  const hasFinanceViewPayments = isAdmin || permissions?.finance?.viewPayments;
  const hasFinanceMakePayment = isAdmin || permissions?.finance?.makePayment;
  const hasFinanceAddBalance = isAdmin || permissions?.finance?.addBalance;

  const financeSubItems = [
    ...(hasFinanceViewPayments
      ? [{ name: "Ödənişlər", path: "/sales", pro: false }]
      : []),
    ...(hasFinanceMakePayment
      ? [{ name: "Ödəniş əlavə et", path: "/create-sale", pro: false }]
      : []),
    ...(hasFinanceAddBalance
      ? [{ name: "Balans əlavə et", path: "/add-balance", pro: false }]
      : []),
  ];

  const showFinanceSection = financeSubItems.length > 0;

  const contractsSubItems = [
    ...(permissions?.contracts.view_documents || isAdmin
      ? [{ name: "Müqavilə siyahısı", path: "/contracts", pro: false }]
      : []),
    ...(permissions?.contracts.upload_documents || isAdmin
      ? [{ name: "Müqavilə əlavə et", path: "/create-contract", pro: false }]
      : []),
  ];

  // Müqavilələr bölməsi yalnız admindirsə və ya hər hansı bir subItem varsa əlavə olunur
  const showContractsSection = contractsSubItems.length > 0;
  const hasReadPermission =
    isAdmin || permissions?.roles?.some((r) => r.permissions.read);
  const hasCreatePermission =
    isAdmin || permissions?.roles?.some((r) => r.permissions.create);

  const userSubItems = [];

  if (hasReadPermission) {
    userSubItems.push({
      name: "Istifadəçi siyahısı",
      path: "/list",
      pro: false,
    });
  }

  if (hasCreatePermission) {
    userSubItems.push({
      name: "İstifadəçi əlavə et",
      path: "/list/create",
      pro: false,
    });
  }
  const showUsersSection = userSubItems.length;
  // const usersNavItem = {
  //   icon: <GroupIcon />,
  //   name: "İstifadəçilər",
  //   subItems: userSubItems,
  // };
  const navItems: NavItem[] = [
    {
      icon: <PieChartIcon />,
      name: "İdarə paneli",
      path: "/dashboard",
    },
    ...(isAdmin
      ? [
          {
            icon: <PencilIcon />,
            name: "Rollar",
            subItems: [
              { name: "Rol siyahısı", path: "/roles", pro: false },
              { name: "Rol əlavə et", path: "/create-role", pro: false },
            ],
          },
        ]
      : []),

    ...(showUsersSection
      ? [
          {
            icon: <GroupIcon />,
            name: "İstifadəçilər",
            subItems: userSubItems,
          },
        ]
      : []),
    ...(showContractsSection
      ? [
          {
            icon: <LocationEditIcon />,
            name: "Cihazlar",
            subItems: contractsSubItems,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            icon: <ListIcon />,
            name: "Xidmət paketləri",
            subItems: [
              { name: "Paketlər siyahısı", path: "/packages", pro: false },
              {
                name: "Xidmət paketi əlavə et",
                path: "/create-package",
                pro: false,
              },
            ],
          },
        ]
      : []),
    ...(showFinanceSection
      ? [
          {
            icon: <DollarLineIcon />,
            name: "Ödəniş xidmətləri",
            subItems: financeSubItems,
          },
        ]
      : []),

    ...(isAdmin
      ? [
          {
            icon: (
              <svg
                className="nav_item_support navButton__icon--RMuqr navButton__icon_start--OYwhM"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <g id="Apps_0">
                  <path
                    id="Vector_1"
                    d="M12 2C10.6868 2 9.38642 2.25866 8.17317 2.7612C6.95991 3.26375 5.85752 4.00035 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H6C6.79565 20 7.55871 19.6839 8.12132 19.1213C8.68393 18.5587 9 17.7956 9 17V15C9 14.2044 8.68393 13.4413 8.12132 12.8787C7.55871 12.3161 6.79565 12 6 12H4C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12H18C17.2044 12 16.4413 12.3161 15.8787 12.8787C15.3161 13.4413 15 14.2044 15 15V17C15 17.7956 15.3161 18.5587 15.8787 19.1213C16.4413 19.6839 17.2044 20 18 20H21C21.2652 20 21.5196 19.8946 21.7071 19.7071C21.8946 19.5196 22 19.2652 22 19V12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM6 14C6.26522 14 6.51957 14.1054 6.70711 14.2929C6.89464 14.4804 7 14.7348 7 15V17C7 17.2652 6.89464 17.5196 6.70711 17.7071C6.51957 17.8946 6.26522 18 6 18H4V14H6ZM20 18H18C17.7348 18 17.4804 17.8946 17.2929 17.7071C17.1054 17.5196 17 17.2652 17 17V15C17 14.7348 17.1054 14.4804 17.2929 14.2929C17.4804 14.1054 17.7348 14 18 14H20V18Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            ),
            name: "Çağırış xidmətləri",
            subItems: [
              { name: "Çağırışlar", path: "/calls", pro: false },
              { name: "Çağırış əlavə et", path: "/call", pro: false },
            ],
          },
        ]
      : []),
    {
      icon: <PencilIcon />,
      name: "Quraşdırma tarixçələri",
      subItems: [
        { name: "Quraşdırmalar", path: "/repairs", pro: false },
        // { name: "Təmir əlavə et", path: "/create-repair", pro: false },
      ],
    },
  ];
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleSidebar } =
    useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => {
      if (!path) return false;

      // Əgər tam bərabərdirsə true
      if (location.pathname === path) return true;

      // PATH dinamikdirsə və sadəcə "/edit-role/..." kimi spesifik bir route-a aiddirsə
      if (path === "/roles" && location.pathname.startsWith("/edit-role")) {
        return true;
      }

      if (
        path === "/create-contract" &&
        location.pathname.startsWith("/edit-contract") 
      ) {
        return true;
      }
      if (
        path === "/create-contract" &&
        location.pathname.startsWith("/create-contract") 
      ) {
        return true;
      }
      if (
        path === "/contracts" &&
        location.pathname.startsWith("/contract/") 
      ) {
        return true;
      }

      if (
        path === "/add-balance" &&
        location.pathname.startsWith("/add-balance")
      ) {
        return true;
      }
      if (
        path === "/create-sale" &&
        location.pathname.startsWith("/payments/new")
      ) { 
        return true;
      }

      if (
        path === "/create-sale" &&
        location.pathname.startsWith("/sale-table")
      ) {
        return true;
      }
      if (
        path === "/call" &&
        location.pathname.startsWith("/call/")
      ) {
        return true;
      }

      return false;
    },
    [location.pathname]
  );

  useEffect(() => {
    if (!localExpandedInitialized) return;

    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, localExpandedInitialized]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };
  useEffect(() => {
    const storedExpanded = localStorage.getItem("sidebarExpanded");
    if (storedExpanded !== null && storedExpanded !== String(isExpanded)) {
      // Əgər localStorage-dəki fərqlidirsə toggle et
      toggleSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", String(isExpanded));
  }, [isExpanded]);

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li
          key={nav.name}
          className="relative"
          onMouseEnter={() => setHoveredItemIndex(index)}
          onMouseLeave={() => setHoveredItemIndex(null)}
        >
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name} className="">
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            Yeni
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            X
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nav.subItems &&
            !isExpanded &&
            !isMobileOpen &&
            hoveredItemIndex === index && (
              <div className="absolute top-0 left-full w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <ul className="py-2">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name} className="">
                      <Link
                        to={subItem.path}
                        className={`block px-4 py-2 text-sm whitespace-nowrap text-gray-500 dark:text-white ${
                          isActive(subItem.path)
                            ? "bg-gray-100 dark:bg-gray-700 font-medium"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {subItem.name}  
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      // onMouseEnter={() => !isExpanded && setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex logo-link-wrapper ${
          !isExpanded ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="logo-link">
          {isExpanded || isMobileOpen ? "GPSBAKU.AZ" : "GPS"}
        </Link>
      </div>
      <div className="flex flex-col duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>{renderMenuItems(navItems, "main")}</div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
