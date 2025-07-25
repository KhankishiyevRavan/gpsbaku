import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { acceptCall, getCallById } from "../../../services/callService";

export default function AcceptCall() {
  const { callId, techId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [call, setCall] = useState<any>(null);
  const [currentTechnicianAccepted, setCurrentTechnicianAccepted] = useState(false);

  const fetchCall = async () => {
    try {
      const data = await getCallById(callId!);
      setCall(data);

      if (data.assignedTechnician) {
        if (data.assignedTechnician._id.toString() === techId) {
          // Hal-hazırda texnik bu çağırışı artıq qəbul edib
          setAccepted(true);
          setCurrentTechnicianAccepted(true);
          setMessage("Siz artıq bu çağırışı qəbul etmisiniz.");
        } else {
          // Başqa usta qəbul edib
          setAccepted(true);
          setCurrentTechnicianAccepted(false);
          setMessage("Bu çağırış artıq başqa bir usta tərəfindən qəbul edilib.");
        }
      }
    } catch (err: any) {
      console.error("Call fetch error:", err);
      setError("Çağırış tapılmadı və ya server xətası.");
    }
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      let data = await acceptCall(callId!, techId!);
      console.log(data);
      setMessage(data);
      setAccepted(true);
      setCurrentTechnicianAccepted(true);
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message || "Çağırışı qəbul etmək mümkün olmadı."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCall();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {!accepted ? (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">
            Çağırışı qəbul etmək istəyirsiniz?
          </h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Göndərilir..." : "Qəbul et"}
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow-md text-center">
          <h2 className="text-xl font-bold text-green-600">
            {message}
          </h2>

          {currentTechnicianAccepted ? (
            <button
              onClick={() => navigate(`/repair/${callId}`)}
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Bitir
            </button>
          ) : null}

        </div>
      )}
    </div>
  );
}
