import styles from "../styles/Form.module.css";

const InputField = ({ label, name }: { label: string; name: string }) => {
  return (
    <div>
      <label style={{ marginRight: "10px" }}>{label}</label>
      <input type="text" name={name} className={styles.inputField} />
    </div>
  );
};

export default InputField;
