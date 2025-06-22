/**
 * Displays an error message with an optional confirmation button.
 *
 * @param message The error message to display.
 * @param onOk Optional callback when the "Ok" button is clicked.
 * @example
 * <ErrorMsg message="Something went wrong!" onOk={() => setShowError(false)} />
 */
import styles from './ErrorMsg.module.scss';
import { GeneralButton } from './GeneralButton';

type ConfirmProps = {  
  message: string;  
  onOk?: () => void;     
};

export function ErrorMsg({message, onOk}: ConfirmProps) {

    return (
        <div className={styles.errorContainer}> 
            <p>{message}</p>
            <GeneralButton label="Ok" onClick={onOk} />              
        </div>
    );

}