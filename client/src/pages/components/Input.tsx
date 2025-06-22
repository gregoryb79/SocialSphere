/**
 * A reusable labeled input field for forms.
 *
 * @param id The unique id for the input element.
 * @param name The name attribute for the input.
 * @param label The label text to display above the input.
 * @param props Additional input attributes (type, value, onChange, etc.).
 * @example
 * <Input id="username" name="username" label="Username" type="text" value={value} onChange={handleChange} />
 */
import { useId, type InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

export type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { id: string, name: string, label: string };

export function Input({ id, label, ...props }: TextInputProps) {
    const baseId = useId();
    const labelId = `${baseId}_label`;

    return (
        <div className={styles.formField}>
            <label id={labelId} htmlFor={id}>{label}</label>
            <input className={styles.inputField} id={id} aria-labelledby={labelId} {...props} />
        </div>
    );
}
