import React, { useEffect, useState } from "react";
import { createRepair, Repair } from "../../services/repairService";
import { getTechnicianUsers } from "../../services/userService"; // mövcud userləri çəkmək üçün
import { useNavigate, useParams } from "react-router";
import Input from "../../components/form/input/InputField";
import DatePicker from "../../components/form/date-picker";
import Label from "../../components/form/Label";
import { TimeIcon } from "../../icons";
import Select from "../../components/form/Select";
import Radio from "../../components/form/input/Radio";
import Checkbox from "../../components/form/input/Checkbox";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";
import { getCallById } from "../../services/callService";


const RepairForm = () => {
  const navigate = useNavigate();

  const { callId } = useParams<{ callId: string }>();

  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [call, setCall] = useState<any>(null);

  const [isCheckedDisabled, setIsCheckedDisabled] = useState(false);

  const [formData, setFormData] = useState<Repair>({
    repairDate: "",
    repairPrice:"",
    repairTime: "",
    technician: "",
    status: "ugurlu",
    partsAdded: false,
    notes: "",
    callId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement;
    const { name, value } = target;

    // Checkbox üçün ayrıca yoxlama
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData({ ...formData, [name]: target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let newRepairData = {
      ...formData,
      callId: String(callId),
      partsAdded: isCheckedDisabled,
      technician: call.assignedTechnician._id,
    };
    console.log(newRepairData);
    // if (!newRepairData) return;
    await createRepair(newRepairData);
    alert("Təmir qeydi əlavə olundu");
    navigate(`/`);
  };
  const handleSelectChange = (value: string) => {
    console.log(value);
    setFormData({ ...formData, contractId: value });
  };
  const handleRadioChange = (value: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value ? "ugurlu" : "ugursuz",
    }));
  };
  useEffect(() => {
    console.log(isCheckedDisabled);
  }, [isCheckedDisabled]);
  const fetchCall = async () => {
    try {
      const data = await getCallById(callId!);
      setCall(data);
      // setOptions()
      const newOptions = data?.contracts.map((n: any) => {
        return { label: n.contractNumber, value: n.contractId };
      });
      setOptions([...newOptions]);
      console.log(newOptions, newOptions.length);

      console.log(data);
    } catch (err: any) {
      console.error("Call fetch error:", err);
      // setError("Çağırış tapılmadı və ya server xətası.");
    }
  };
  useEffect(() => {
    fetchCall();
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className=" max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-6 mt-10 text-gray-800 dark:text-gray-100 leading-relaxed border border-gray-200 dark:border-gray-800"
    >
      <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <div>
          <Label htmlFor="tm">İstifadəçi</Label>
          <Input
            type="text"
            id="position"
            name="position"
            value={call?.fullName}
            disabled={true}
          />
        </div>
        <div>
          <Label>Texnik</Label>
          <Input
            type="text"
            id="technician"
            name="technician"
            value={call?.assignedTechnicianName}
            disabled={true}
          />
        </div>
        <div>
          <Label>Təmir xərci</Label>
          <Input
            type="text"
            id="repairPrice"
            name="repairPrice"
            value={call?.repairPrice}
            onChange={handleChange}
          />
        </div>
        {call?.contracts.length>0 && (
          <div>
            <Label>Müqaviləni seç:</Label>
            <Select
              name="technician"
              options={options}
              placeholder="Select an option"
              onChange={handleSelectChange}
              className="dark:bg-dark-900"
              value={formData.technician}
            />
          </div>
        )}
        <div>
          <DatePicker
            id="date-picker"
            label="Baxış tarixi"
            placeholder="Select a date"
            value={formData.repairDate || ""}
            onChange={(dates, currentDateString) => {
              setFormData({
                ...formData,
                repairDate: currentDateString,
              });
            }}
          />
        </div>
        <div>
          <Label htmlFor="tm">Baxış saatı</Label>
          <div className="relative">
            <Input
              type="time"
              name="repairTime"
              value={formData.repairTime}
              id="repairTime"
              onChange={handleChange}
              // onChange={(e) => console.log(e.target.value)}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <TimeIcon className="size-6" />
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="status" className="input-label">
            Status
          </Label>
          <div className="flex flex-wrap items-center gap-4">
            <Radio
              id="Uğurlu"
              name="status"
              value="true"
              label="Uğurlu"
              checked={formData.status === "ugurlu"}
              onChange={() => handleRadioChange(true)}
            />
            <Radio
              id="Uğursuz"
              name="status"
              value="false"
              label="Uğursuz"
              checked={formData.status === "ugursuz"}
              onChange={() => handleRadioChange(false)}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isCheckedDisabled}
            onChange={setIsCheckedDisabled}
            // disabled
            name="partsAdded"
            label="Əlavə hissələr olub"
          />
        </div>
        <div className="lg:col-span-2">
          <Label htmlFor="status" className="input-label">
            Əlavə qeydlər
          </Label>
          <TextArea
            placeholder="Burada əlavələrinizi qeyd edə bilərsiniz"
            value={formData.notes}
            onChange={(value) => setFormData({ ...formData, notes: value })}
            rows={6}
          />
        </div>
      </div>

      <div className="block gap-3 mt-3">
        <Button size="sm" type="submit">
          Təmir tarixçəsi əlavə et
        </Button>
      </div>
    </form>
  );
};

export default RepairForm;
