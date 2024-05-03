import styles from "../../styles/Form.module.css";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const InputField = ({ label, name, value, onChange }: InputFieldProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.value);
  };

  return (
    <div>
      <label style={{ marginRight: "10px" }}>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        className={styles.inputField}
      />
    </div>
  );
};

export default InputField;
