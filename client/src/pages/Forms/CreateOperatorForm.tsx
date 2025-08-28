import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import DatePicker from "../../components/form/date-picker";
import Select from "../../components/form/Select";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import ComponentCard from "../../components/common/ComponentCard";
import PhoneInput from "../../components/form/group-input/PhoneInput";
import Button from "../../components/ui/button/Button";
import Radio from "../../components/form/input/Radio";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { createOperator } from "../../services/operatorService";

export default function CreateOperatorForm() {
  const [showPassword, setShowPassword] = useState(false);

  const handleRadioChange = (value: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      status: value,
    }));
    console.log("Selected:", value ? "Aktiv" : "Passiv");
  };
  const options = [
    { value: "male", label: "Male" },
    { value: "femaile", label: "Female" },
    { value: "others", label: "Others" },
  ];

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value,
    });
    console.log("Selected value:", value);
  };
  const handleBirthDayChange = (dates: Date[], currentDateString: string) => {
    console.log({ dates, currentDateString });
    setFormData({ ...formData, bDate: currentDateString });
  };
  const countries = [
    { code: "AZ", label: "+994" },
    { code: "TR", label: "+90" },
    { code: "RU", label: "+7" },
    { code: "GE", label: "+995" },
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
    setFormData({ ...formData, phoneNumber: phoneNumber });
  };
  const [errors, setErrors] = useState<{
    fname?: string;
    lname?: string;
    gender?: string;
    username?: string;
    bDate?: string;
    email?: string;
    phoneNumber?: string;
    position?: string;
    password?: string;
    confirmPassword?: string;
    emptyFields?: string;
    authError?: string;
  }>({});
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    gender: "",
    username: "",
    bDate: "",
    email: "",
    phoneNumber: "",
    position: "",
    password: "",
    confirmPassword: "",
    status: true,
    identityNumber: "AZ12345678",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.match(/[^A-Za-z0-9]/)
    ) {
      return "Strong";
    }
    return "Medium";
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    const emptyErrors: typeof errors = {};

    const {
      fname,
      lname,
      gender,
      username,
      bDate,
      email,
      phoneNumber,
      position,
      password,
      confirmPassword,
    } = formData;

    const isFNameEmpty = !fname?.trim();
    const isLNameEmpty = !lname?.trim();
    const isGenderEmpty = !gender?.trim();
    const isUsernameEmpty = !username?.trim();
    const isBDateEmpty = !bDate?.trim();
    const isEmailEmpty = !email?.trim();
    const isPhoneNumberInvalid = !phoneNumber?.trim();
    const isPositionEmpty = !position?.trim();
    const isPasswordEmpty = !password?.trim();
    const isConfirmPasswordEmpty = !confirmPassword?.trim();
    const isPasswordsMismatch = password !== confirmPassword;
    if (isEmailEmpty) emptyErrors.email = "E-poçt is required";
    if (isFNameEmpty) emptyErrors.fname = "First Name is required";
    if (isLNameEmpty) emptyErrors.lname = "Last Name is required";
    if (isGenderEmpty) emptyErrors.gender = "Gender is required";
    if (isUsernameEmpty) emptyErrors.username = "Username is required";
    if (isBDateEmpty) emptyErrors.bDate = "Date of Birth is required";
    if (isPhoneNumberInvalid)
      emptyErrors.phoneNumber = "Phone Number is invalid";
    if (isPositionEmpty) emptyErrors.position = "Position is required";
    if (isPasswordEmpty) emptyErrors.password = "Password is required";
    if (isConfirmPasswordEmpty)
      emptyErrors.confirmPassword = "Confirm Password is required";
    if (!isPasswordEmpty && !isConfirmPasswordEmpty && isPasswordsMismatch) {
      emptyErrors.confirmPassword = "Passwords do not match";
      emptyErrors.password = "Passwords do not match";
    }

    console.log(emptyErrors);

    setErrors(emptyErrors);

    if (Object.keys(emptyErrors).length !== 0) return;

    const generateIdentityNumber = () => {
      const randomNum = Math.floor(10000000 + Math.random() * 90000000); // 8 rəqəmli random number
      return `OP${randomNum}`;
    };

    try {
      const { confirmPassword, ...payload } = formData;
      console.log(payload);
      payload.identityNumber = generateIdentityNumber();
      let data = await createOperator(payload);
      console.log(data);

      console.log("Operator yaradıldı:", data);
      // if (data) {
    } catch (err: any) {
      console.log(err);
      const errors = err.response?.data?.errors;
      console.log(errors);

      setErrors(errors || {});
      console.log(errors);
      if (errors.message) alert(errors.message);
    }
  };
  return (
    <ComponentCard title="Operator Form">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fname" className="input-label">
              {errors.fname && (
                <div className="error-message">{errors.fname}</div>
              )}
              First Name
            </Label>
            <Input
              type="text"
              id="fname"
              name="fname"
              onChange={handleChange}
              value={formData.fname}
              className={
                errors.fname
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <Label htmlFor="lname" className="input-label">
              {errors.lname && (
                <div className="error-message">{errors.lname}</div>
              )}
              Last Name
            </Label>
            <Input
              type="text"
              name="lname"
              onChange={handleChange}
              value={formData.lname}
              id="lname"
              className={
                errors.lname
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your last name"
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.gender && (
                <div className="error-message">{errors.gender}</div>
              )}
              Gender
            </Label>
            <Select
              options={options}
              placeholder="Select an option"
              onChange={handleSelectChange}
              className={
                errors.gender
                  ? "border-2 border-red-500 dark:border-red-500"
                  : "dark:bg-dark-900"
              }
            />
          </div>
          <div>
            <Label htmlFor="username" className="input-label">
              {errors.username && (
                <div className="error-message">{errors.username}</div>
              )}
              Username
            </Label>
            <Input
              type="text"
              name="username"
              onChange={handleChange}
              value={formData.username}
              className={
                errors.username
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              id="username"
              placeholder="Enter your operator username"
            />
          </div>
          <div>
            <DatePicker
              className={
                errors.bDate
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              id="date-picker"
              label="Date of Birth"
              placeholder="Select a date"
              error={errors.bDate}
              onChange={(dates, currentDateString) =>
                handleBirthDayChange(dates, currentDateString)
              }
            />
          </div>
          <div>
            <Label htmlFor="email" className="input-label">
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
              E-poçt
            </Label>
            <Input
              type="text"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className={
                errors.email
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator email"
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.phoneNumber && (
                <div className="error-message">{errors.phoneNumber}</div>
              )}
              Phone number
            </Label>
            <PhoneInput
              selectPosition="end"
              countries={countries}
              placeholder="+994 (55) 000-00-00"
              onChange={handlePhoneNumberChange}
              className={
                errors.phoneNumber
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
            />
          </div>
          <div>
            <Label htmlFor="position" className="input-label">
              {errors.position && (
                <div className="error-message">{errors.position}</div>
              )}
              Position
            </Label>
            <Input
              type="text"
              id="position"
              name="position"
              onChange={handleChange}
              value={formData.position}
              className={
                errors.position
                  ? "border-2 border-red-500 dark:border-red-500"
                  : ""
              }
              placeholder="Enter your operator position"
            />
          </div>
          <div>
            <Label className="input-label">
              {errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              Password <span className="text-error-500">*</span>{" "}
            </Label>
            <div className="relative">
              <Input
                className={
                  errors.password
                    ? "border-2 border-red-500 dark:border-red-500"
                    : ""
                }
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrənizi daxil edin"
                onChange={handleChange}
                value={formData.password}
              />
              {formData.password && (
                <div
                  className={clsx(
                    twMerge(
                      "mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-400 mt-2 absolute"
                    )
                  )}
                >
                  Password Strength:
                  <span
                    className={
                      checkPasswordStrength(formData.password) === "Strong"
                        ? "text-green-500"
                        : checkPasswordStrength(formData.password) === "Medium"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }
                  >
                    {checkPasswordStrength(formData.password)}
                  </span>
                </div>
              )}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </span>
            </div>
          </div>
          <div>
            <Label className="input-label">
              {errors.confirmPassword && (
                <div className="error-message">{errors.confirmPassword}</div>
              )}
              Confirm Şifrə<span className="text-error-500">*</span>
            </Label>
            <div className="relative">
              <Input
                className={
                  errors.confirmPassword
                    ? "border-2 border-red-500 dark:border-red-500"
                    : ""
                }
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                name="confirmPassword"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 col-span-full">
            <Label className="m-0">Status:</Label>
            <div className="flex flex-wrap items-center gap-4">
              <Radio
                id="Aktiv"
                name="status"
                value="true"
                label="Aktiv"
                checked={formData.status === true}
                onChange={() => handleRadioChange(true)}
              />
              <Radio
                id="Passiv"
                name="status"
                value="false"
                label="Passiv"
                checked={formData.status === false}
                onChange={() => handleRadioChange(false)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" type="submit">
              Save Changes
            </Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </ComponentCard>
  );
}
