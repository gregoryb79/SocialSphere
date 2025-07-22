/**
 * A navigation button component with optional icon and label.
 *
 * @param disabled If true, the button is disabled.
 * @param title Optional tooltip text shown on hover.
 * @param label Optional text label to display on the button.
 * @param icon Optional icon (React node) to display.
 * @param ariaLabel Accessibility label for screen readers.
 * @param onClick Optional callback function for button click.
 * @example
 * <NavButton icon={<HomeIcon />} label="Home" ariaLabel="Go to home" onClick={handleHomeClick} />
 */
import React from 'react';
import styles from "./IconButton.module.scss";

type IconButtonProps = {
  disabled?: boolean;
  title?: string;
  label?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
  onClick?: () => void;    
};
export function IconButton({disabled, title, label, ariaLabel, icon, onClick}: IconButtonProps) {
    const hasLabel = label !== undefined && label !== "";

    return (
    <button className={`${styles.iconButton} ${hasLabel ? styles.hasLabel : ""}`} onClick={onClick} aria-label={ariaLabel} title={title} disabled={disabled} type="button" 
      style={{color: disabled ? "var(--light-gray-bg)" : "var(--primary-blue)"}}>
      {icon}
      {label}
    </button>
  );
}