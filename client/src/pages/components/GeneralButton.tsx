/**
 * A reusable general-purpose button component.
 *
 * @param label The text to display on the button.
 * @param onClick Optional callback function to handle button clicks.
 * @example
 * <GeneralButton label="Submit" onClick={handleSubmit} />
 */
import styles from "./GeneralButton.module.scss";

type GeneralButtonProps = {
  label: string;
  disabled?: boolean;
  count: number;
  onClick?: () => void;    
};
export function GeneralButton({label, disabled, count, onClick}: GeneralButtonProps) {

    return (
    <button className={styles.generalButton} onClick={onClick} disabled={disabled}>
      {label} {count}
    </button>
  );
}
