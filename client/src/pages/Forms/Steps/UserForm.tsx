import Input from "../../../components/form/input/InputField";
import Radio from "../../../components/form/input/Radio";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import { EyeCloseIcon, EyeIcon } from "../../../icons";

interface UserFormProps {
  formData: {
    fname: string;
    lname: string;
    fathername: string;
    email: string;
    position: string;
    password: string;
    identityNumber: string;
    status: boolean;
  };
  errors: {
    fname?: string;
    lname?: string;
    fathername?: string;
    email?: string;
    position?: string;
    password?: string;
    identityNumber?: string;
    [key: string]: string | undefined;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  handleRadioChange: (value: boolean) => void;
  options?: string;
  handleSelectChange: (value: boolean) => void;
}

export default function UserForm({
  formData,
  errors,
  handleChange,
  showPassword,
  setShowPassword,
  handleRadioChange,
  options,
  handleSelectChange,
}: UserFormProps) {
  return (
    <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <Label className="input-label">Rollar</Label>
        <Select
          options={options}
          placeholder="Select Option"
          onChange={handleSelectChange}
          className="dark:bg-dark-900"
        />
      </div>
      {/* First Name */}
      <div>
        <Label htmlFor="fname" className="input-label">
          {errors.fname && <div className="error-message">{errors.fname}</div>}
          First Name
        </Label>
        <Input
          type="text"
          id="fname"
          name="fname"
          onChange={handleChange}
          value={formData.fname}
          className={
            errors.fname ? "border-2 border-red-500 dark:border-red-500" : ""
          }
          placeholder="Enter your first name"
        />
      </div>

      {/* Last Name */}
      <div>
        <Label htmlFor="lname" className="input-label">
          {errors.lname && <div className="error-message">{errors.lname}</div>}
          Last Name
        </Label>
        <Input
          type="text"
          name="lname"
          onChange={handleChange}
          value={formData.lname}
          id="lname"
          className={
            errors.lname ? "border-2 border-red-500 dark:border-red-500" : ""
          }
          placeholder="Enter your last name"
        />
      </div>

      {/* Father Name */}
      <div>
        <Label htmlFor="fathername" className="input-label">
          {errors.fathername && (
            <div className="error-message">{errors.fathername}</div>
          )}
          Father Name
        </Label>
        <Input
          type="text"
          name="fathername"
          onChange={handleChange}
          value={formData.fathername}
          id="fathername"
          className={
            errors.fathername
              ? "border-2 border-red-500 dark:border-red-500"
              : ""
          }
          placeholder="Enter your father name"
        />
      </div>

      {/* E-poçt */}
      <div>
        <Label htmlFor="email" className="input-label">
          {errors.email && <div className="error-message">{errors.email}</div>}
          E-poçt
        </Label>
        <Input
          type="text"
          id="email"
          name="email"
          onChange={handleChange}
          value={formData.email}
          className={
            errors.email ? "border-2 border-red-500 dark:border-red-500" : ""
          }
          placeholder="Enter your operator email"
        />
      </div>

      {/* Position */}
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
            errors.position ? "border-2 border-red-500 dark:border-red-500" : ""
          }
          placeholder="Enter your operator position"
        />
      </div>
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
      {/* Password */}
      <div>
        <Label className="input-label">
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
          Şifrə<span className="text-error-500">*</span>
        </Label>
        <div className="relative">
          <Input
            placeholder="Şifrənizi daxil edin"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
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
    </div>
  );
}
