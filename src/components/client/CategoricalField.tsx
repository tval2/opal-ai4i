import React from "react";
import styles from "../../styles/Form.module.css";

interface CategoricalFieldProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (name: string, value: string) => void;
}

const CategoricalField: React.FC<CategoricalFieldProps> = ({
  label,
  name,
  options,
  value,
  onChange,
}) => {
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, event.target.value);
  };

  return (
    <div className={styles.categoricalField}>
      <label>{label}</label>
      <div>
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={handleOptionChange}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default CategoricalField;
