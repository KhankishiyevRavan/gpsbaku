import React from "react";
import { useNavigate } from "react-router-dom";

const CallTypeSelector = () => {
  const navigate = useNavigate();

  return (
    // <div className="flex flex-col items-center max-h-screen bg-gray-100 p-4">
    <div className="flex flex-col items-center justify-center w-full h-[calc(100dvh-230px)] bg-gray-100 p-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-6">Çağırış növünü seçin:</h2>
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/call/non-subscriber")}
          className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition"
        >
          Qeyri-abunəçi çağırışı
        </button>
        <button
          onClick={() => navigate("/call/subscriber")}
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
        >
          Abunəçi çağırışı
        </button>
      </div>
    </div>
  );
};

export default CallTypeSelector;
