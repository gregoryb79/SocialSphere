import styles from './Confirm.module.scss';
import { GeneralButton } from './GeneralButton';
type ConfirmProps = {
  question: string;
  onYes?: () => void;    
  onNo?: () => void;    
};
export function Confirm({question, onYes, onNo}: ConfirmProps) {

    return (
        <div className={styles.confirmContainer}> 
            <p>{question}</p>
            <div className={styles.confirmButtons}>
                <GeneralButton label="Yes" onClick={onYes} />
                <GeneralButton label="No" onClick={onNo} />
            </div>
        </div>
    );

}