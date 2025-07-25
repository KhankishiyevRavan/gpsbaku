import { useState } from "react";
import { userDataInterface } from "../../services/userService";
import Button from "../ui/button/Button";
import { useNavigate } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Badge from "../ui/badge/Badge";

interface UsersModalProps {
  closeModal: () => void;
  handleSave: () => void;
  users: userDataInterface[];
}

const UsersModal: React.FC<UsersModalProps> = ({
  handleSave,
  closeModal,
  users,
}) => {
  console.log(users);

  const navigate = useNavigate();
  const [usersCurrentPage, setUsersCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2); // default 5

  const [searchTerm, setSearchTerm] = useState("");
  const [usersStatusFilter, setUsersStatusFilter] = useState("all"); // all | active | passiv
  const filteredUsers = users
    .filter((user) =>
      `${user.fname} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (usersStatusFilter === "all") return true;
      if (usersStatusFilter === "active") return user?.status === true;
      if (usersStatusFilter === "passiv") return user?.status === false;
      return true;
    });
  const indexOfLastItem = usersCurrentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  console.log(currentUsers);

  const usersTotalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] pt-15">
      <div className="max-w-full overflow-x-auto">
        <div className="p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <span className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2">
              <svg
                className="fill-gray-500 dark:fill-gray-400"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                  fill=""
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search user by name, email or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
            />
          </div>
          <div className="relative z-20 bg-transparent">
            <select
              value={usersStatusFilter}
              onChange={(e) => setUsersStatusFilter(e.target.value)}
              className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option
                value="all"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                All Statuses
              </option>
              <option
                value="active"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                Active
              </option>
              <option
                value="passiv"
                className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
              >
                Passiv
              </option>
            </select>
            <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 dark:text-gray-400"> Show </span>
            <div className="relative z-20 bg-transparent">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setUsersCurrentPage(1); // yeni limit seçildikdə səhifəni sıfırla
                }}
                className="w-full py-2 pl-3 pr-8 text-sm text-gray-800 bg-transparent border border-gray-300 rounded-lg appearance-none dark:bg-dark-900 h-9 bg-none shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              >
                <option
                  value="2"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  2
                </option>
                <option
                  value="8"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  8
                </option>
                <option
                  value="10"
                  className="text-gray-500 dark:bg-gray-900 dark:text-gray-400"
                >
                  10
                </option>
              </select>
              <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-2 top-1/2 dark:text-gray-400">
                <svg
                  className="stroke-current"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                    stroke=""
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-400"> entries </span>
          </div>
        </div>

        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90 "
              >
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                E-poçt
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-black-800 text-start text-theme-xs dark:text-white/90"
              >
                Rol
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Status
              </TableCell>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-800 text-start text-theme-xs dark:text-white/90"
              >
                Actions
              </TableCell> */}
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {currentUsers.map((user, index) => (
              <TableRow
                key={index}
                onClick={() => navigate(`/create-contract/${user._id}`)}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {user._id}
                  </span>
                </TableCell>
                <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {user.fname}
                  </span>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.email}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.role}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      user.status === true
                        ? "success"
                        : user.status === false
                        ? "warning"
                        : "error"
                    }
                  >
                    {user.status ? "Active" : "Passiv"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="relative flex justify-center items-center gap-2 p-4">
          {usersCurrentPage !== 1 && (
            <button
              onClick={() => setUsersCurrentPage((prev) => prev - 1)}
              className="absolute left-4 inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
            >
              <ArrowLeft />
              Əvvəlki
            </button>
          )}

          <div className="flex gap-3">
            {Array.from({ length: usersTotalPages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setUsersCurrentPage(i + 1)}
                size="sm"
                className={`px-3 py-1 rounded text-sm ${
                  usersCurrentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {i + 1}
              </Button>
            ))}
          </div>

          {usersCurrentPage !== usersTotalPages && (
            <button
              onClick={() => setUsersCurrentPage((prev) => prev + 1)}
              className="absolute right-4 inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
            >
              Növbəti
              <ArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersModal;
