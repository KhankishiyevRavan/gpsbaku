"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { getAllRoles, roleDataInterface } from "../../services/roleService";
import { useNavigate } from "react-router";

export default function SalesTable() {
  const navigate = useNavigate();

  const [operators, setOperators] = useState<roleDataInterface[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const data = await getAllRoles();
        console.log(data);

        setOperators(data);
      } catch (err: any) {
        console.error("Error fetching operators:", err);
        setError(err.response?.data?.message || "Naməlum xəta");
      }
    };

    fetchOperators();
  }, []);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Rol
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Təsviri
              </TableCell>

              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Fəaliyyətlər
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {operators?.map((operator) => (
              <TableRow key={operator?._id}>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator._id}
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {operator.name}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {operator.description}
                </TableCell>

                <TableCell>
                  <div className="flex py-3 px-5 gap-1">
                    <button
                      onClick={() => {
                        navigate(`/edit-role/${operator._id}`);
                      }}
                    >
                      <svg
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20px"
                        height="20px"
                      >
                        <path
                          fill={"#6B7280"}
                          d="m18.988 2.012l3 3L19.701 7.3l-3-3zM8 16h3l7.287-7.287l-3-3L8 13z"
                        />
                        <path
                          fill={"#6B7280"}
                          d="M19 19H8.158c-.026 0-.053.01-.079.01c-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .896-2 2v14c0 1.104.897 2 2 2h14a2 2 0 0 0 2-2v-8.668l-2 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
