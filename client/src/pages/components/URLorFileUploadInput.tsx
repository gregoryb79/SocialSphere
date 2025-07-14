/**
 * A reusable input that lets users provide an image either by URL or by uploading a file.
 *
 * @param setImageHostURL Callback to set the uploaded image's URL.
 * @param setIsImageUploaded Callback to boolean to indicate if an image was successfully uploaded.
 * @param id The unique id for the input element.
 * @param name The name attribute for the input.
 * @param label The label text to display above the input.
 * @param props Additional input attributes (type, value, onChange, etc.).
 * @example
 * <URLorFileUploadInput
 *   id="avatar"
 *   name="avatar"
 *   label="Profile Picture"
 *   setImageHostURL={setImageHostURL}
 *   setIsImageUploaded={setIsImageUploaded}
 * />
 */

import { Input, type TextInputProps } from "./Input";
import { IconButton } from "./IconButton";
import { Upload } from "lucide-react";
import styles from "./URLorFileUpload.module.scss";
import { useRef, useState } from "react";
import { uploadToImgbb } from "../../models/images";

export type URLorFileUploadInputProps = TextInputProps & {     
    setImageHostURL: (value: string) => void;
    setIsImageUploaded: (value: boolean) => void;
};
export function URLorFileUploadInput( {setImageHostURL, setIsImageUploaded, ...props }: URLorFileUploadInputProps) {
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [avatarPath, setAvatarPath] = useState<string>("");

        function handleAvatarUpload() {        
                console.log("Avatar upload button clicked");        
                fileInputRef.current?.click();
            }
        
            async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
                const file = e.target.files?.[0];
                if (file) {            
                    console.log("Selected file:", file);
                    setAvatarPath(file.name);
                    try{
                        const result = await uploadToImgbb(file);
                        console.log("File uploaded successfully:", result);
                        setImageHostURL(result);
                        setIsImageUploaded(true);
                    }catch (error) {
                        console.error("Error uploading file:", error);
                        // setShowError(true);
                    }
                }
            }
        
    return (
        <section className={styles.avatarSection}>
                    <Input value={avatarPath} onInput={(e) => setAvatarPath(e.currentTarget.value)} {...props}  />
                    <IconButton
                        title='Upload'
                        icon={<Upload className={styles.lucideIconFooter} color="var(--primary-blue)" />}
                        onClick={handleAvatarUpload}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
        </section>  
    )
}