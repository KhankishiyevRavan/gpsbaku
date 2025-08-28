import React, { useState, useMemo, useEffect } from "react";
import { ContractInterface } from "../services/contractService";
import { jsPDF } from "jspdf";
import { useNavigate } from "react-router";
import { getAllServicePackages } from "../services/servicePackageService";

interface ContractSectionProps {
  contracts: ContractInterface[]; // contract-ların siyahısı
  setContracts: React.Dispatch<React.SetStateAction<ContractInterface[]>>; // onları dəyişən funksiya
  id: string | null;
}

const ContractSection: React.FC<ContractSectionProps> = ({
  contracts,
  setContracts,
  id,
}) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");

  const userId = localStorage.getItem("id");
  const navigate = useNavigate();
  //   const [contracts, setContracts] = useState<Contract[]>(sampleContracts);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [packages, setPackages] = useState<string[]>([]);
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        let data = await getAllServicePackages();
        if (data) {
          const newOptions = data.map((d) => d.name);
          setPackages(newOptions);
        }
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPackages();
  }, []);
  const filteredContracts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return contracts.filter((contract) => {
      const matchesSearch =
        searchQuery === "" ||
        (contract.contractNumber?.toLowerCase().includes(searchLower) ?? false);

      const matchesStatus =
        statusFilter === "all" || contract.status === statusFilter;
      const matchesService =
        serviceFilter === "all" ||
        contract.servicePackageName === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [contracts, searchQuery, statusFilter, serviceFilter]);
  const generatePDF = (contract: ContractInterface) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Contract Details", 14, 22);

    doc.setFontSize(12);
    doc.text(`Contract Number: ${contract.contractNumber || ""}`, 14, 40);
    doc.text(`Subscriber ID: ${contract.subscriberId}`, 14, 50);
    doc.text(`Contract Value: ${contract.contractValue} AZN`, 14, 60);
    doc.text(`Initial Payment: ${contract.initialPayment || "0"} AZN`, 14, 70);
    doc.text(`Start Date: ${contract.startDate?.slice(0, 10)}`, 14, 80);
    doc.text(`End Date: ${contract.endDate?.slice(0, 10)}`, 14, 90);
    doc.text(`Status: ${contract.status || ""}`, 14, 100);
    doc.text(`Service Package: ${contract.servicePackage || ""}`, 14, 110);
    doc.text(`Model: ${contract.combiModel || ""}`, 14, 120);

    // if (contract.terms) {
    //   doc.text("Terms:", 14, 130);
    //   // Terms çox yazıdırsa, onu səhifəyə uyğun bölmək lazım ola bilər.
    //   doc.text(contract.terms, 14, 140);
    // }

    doc.save(`Contract_${contract.contractNumber || contract._id}.pdf`);
  };
  const newContract = () => {
    navigate(`/create-contract/${id}`);
  };
  const editContract = (contract: ContractInterface) => {
    navigate(`/edit-contract/${contract._id}`);
  };
  const viewContractDetails = (contract: ContractInterface) => {
    navigate(`/contract/${contract._id}`);
  };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-5 mb-5">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-white/[0.05] mb-4">
        {id != userId && (
          <button
            onClick={newContract}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Müqavilə əlavə et
          </button>
        )}
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500 dark:text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx={11} cy={11} r={8} />
              <line x1={21} y1={21} x2={16.65} y2={16.65} />
            </svg>
          </div>
          <input
            type="text"
            className="w-full py-2 pl-10 pr-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Müqavilələri axtarın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Bütün statuslar</option>
          <option value="Gözləmədə">Gözləmədə</option>
          <option value="Aktiv">Aktiv</option>
          <option value="expired">Müddəti bitdi</option>
        </select>
        <select
          className="py-2 px-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
        >
          <option value="all">Bütün xidmət növləri</option>
          {packages.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Contract List */}
      <div className="space-y-4">
        {filteredContracts.length > 0 ? (
          filteredContracts.map((contract) => (
            <div
              key={contract._id}
              className="border border-gray-200 dark:border-white/[0.1] rounded-md overflow-hidden bg-white dark:bg-gray-800"
            >
              {/* Contract Header */}
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-white/[0.05]">
                <div className="font-medium text-gray-800 dark:text-gray-100">
                  Kontrakt #{contract.contractNumber}
                </div>
                <div className="flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${
                      contract.status === "cozlenmis"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        : contract.status === "active"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400"
                    }`}
                  >
                    {contract?.status}
                  </span>
                  {contract?.servicePackageName && (
                    <span className="bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-medium uppercase">
                      {contract?.servicePackageName}
                    </span>
                  )}
                </div>
              </div>

              {/* Contract Body */}
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Kontraktın dəyəri
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {contract?.contractValue} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Kontraktın ödənişi
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {contract?.initialPayment} AZN
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Başlama Tarixi
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {contract?.startDate?.slice(0, 10)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Bitmə Tarixi
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {contract?.endDate?.slice(0, 10)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Model
                    </div>
                    <div className="font-medium text-gray-800 dark:text-gray-100">
                      {contract?.combiModel}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewContractDetails(contract);
                    }}
                    className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                  >
                    Ətraflı Bax
                  </button>
                  {contract.subscriberId != userId && (
                    <button
                      onClick={() => editContract(contract)}
                      className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                    >
                      Redaktə Et
                    </button>
                  )}
                  <button
                    onClick={() => generatePDF(contract)}
                    className="px-3 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded text-sm font-medium transition-colors"
                  >
                    PDF Yarat
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Kriteriyalarınıza uyğun heç bir müqavilə tapılmadı.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractSection;
