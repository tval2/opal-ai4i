import styles from "../../styles/Form.module.css";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

const InputField = ({ label, name, value, onChange }: InputFieldProps) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(name, event.target.value);
    // Automatically adjust height to fit content
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
  };

  return (
    <div>
      <label style={{ marginRight: "10px" }}>{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={handleInputChange}
        className={styles.inputField}
        style={{
          width: '100%', // Set width to 100% to fill container
          height: 'auto', // Initial height set automatically
          overflowY: 'hidden' // Hide vertical scrollbar
        }}
        rows={1} // Start with one line
      />
    </div>
  );
};

export default InputField;
