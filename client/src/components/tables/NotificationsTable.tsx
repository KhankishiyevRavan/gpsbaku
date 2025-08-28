"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router";
import {
  getAllNotifications,
  NotificationType,
} from "../../services/notificationsService";
import ComponentCard from "../common/ComponentCard";
import Button from "../ui/button/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import DatePicker from "../form/date-picker";
// import { setDate } from "date-fns";

export default function NotificationsTable() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [showInspection, setShowInspection] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationPerPage, setNotificationPerPage] = useState(() => {
    const saved = localStorage.getItem("notificationPerPage");
    return saved ? Number(saved) : 10;
  });

  const getDefaultStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split("T")[0];
  };

  const getDefaultEndDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 2);
    return date.toISOString().split("T")[0];
  };

  const [startDate, setStartDate] = useState(getDefaultStartDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());

  const fetchNotifications = async (start: string, end: string) => {
    try {
      let query = `startDate=${start}&endDate=${end}`;
      const data = await getAllNotifications(query);
      console.log("aa");
      console.log(data);
      console.log(start, end);

      setNotifications(data);
    } catch (err: any) {
      alert("Naməlum xəta");
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications(startDate, endDate);
  }, []);

  const handleToggle = (type: "inspection" | "payment") => {
    if (type === "inspection") {
      if (showInspection && !showPayment) return;
      setShowInspection((prev) => !prev);
    } else {
      if (!showInspection && showPayment) return;
      setShowPayment((prev) => !prev);
    }
    setCurrentPage(1);
  };

  const filteredNotifications = notifications.filter((note) => {
    if (showInspection && note.type === "Texniki baxış") return true;
    if (showPayment && note.type === "Ödəniş günü") return true;
    return false;
  });

  const indexOfLastItem = currentPage * notificationPerPage;
  const indexOfFirstItem = indexOfLastItem - notificationPerPage;
  const currentItems = filteredNotifications.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    filteredNotifications.length / notificationPerPage
  );
  const handleBirthDayChange = (dates: Date[], currentDateString: string) => {
    console.log({ dates, currentDateString });
    // setFormData({ ...formData, bDate: currentDateString });
  };
  return (
    <>
      <ComponentCard title={``}>
        {/* Filter section */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div
            onClick={() => handleToggle("inspection")}
            className={`cursor-pointer px-4 py-2 rounded-xl border ${
              showInspection
                ? "border-blue-500 bg-blue-100 text-blue-700"
                : "border-gray-300 bg-gray-100 text-gray-500"
            }`}
          >
            Texniki baxış
          </div>
          <div
            onClick={() => handleToggle("payment")}
            className={`cursor-pointer px-4 py-2 rounded-xl border ${
              showPayment
                ? "border-green-500 bg-green-100 text-green-700"
                : "border-gray-300 bg-gray-100 text-gray-500"
            }`}
          >
            Ödəniş günü
          </div>
        </div>
        {/* Date range inputs */}
        <div className="flex items-center gap-2">
          <DatePicker
            value={startDate}
            id="date-picker-start"
            // label="Doğum günü"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              setStartDate(currentDateString);
            }}
            className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            maxDate={endDate} // ⬅️ burada maxDate ötürülür
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            tarixdən
          </span>
          <DatePicker
            value={endDate}
            id="date-picker-end"
            // label="Doğum günü"
            placeholder="Select a date"
            onChange={(dates, currentDateString) => {
              setEndDate(currentDateString);
            }}
            className="px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            minDate={startDate} // ⬅️ burada minDate ötürülür
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            -ə qədər
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              fetchNotifications(startDate, endDate);
              setCurrentPage(1);
            }}
          >
            Göstər
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const defaultStart = getDefaultStartDate();
              const defaultEnd = getDefaultEndDate();
              setStartDate(defaultStart);
              setEndDate(defaultEnd);
              fetchNotifications(defaultStart, defaultEnd);
              setCurrentPage(1);
            }}
          >
            Sıfırla
          </Button>
        </div>
        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Tarix
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    İstifadəçi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Müqavilə Nömrəsi
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Notifikasiya Tipi
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((note) => (
                  <TableRow key={note?._id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note?._id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {String(note.notificationDate).slice(0, 10)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.subscriberName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.contractId}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {note.type}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="relative flex justify-center items-center gap-2 p-4">
              {currentPage !== 1 && (
                <button
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="absolute left-4 inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                >
                  <ArrowLeft />
                  Əvvəlki
                </button>
              )}

              <div className="flex gap-3">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    size="sm"
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              {currentPage !== totalPages && (
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="absolute right-4 inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                >
                  Növbəti
                  <ArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
