import React, { useState } from 'react';
import { useLoaderData, useNavigate, useRevalidator } from 'react-router';
import styles from './Settings.module.scss';
import { GeneralButton } from './components/GeneralButton';
import { Input } from './components/Input';
import { PasswordInput } from './components/PasswordInput';
import { ErrorMsg } from './components/ErrorMsg';
import { apiClient } from '../models/apiClient';
import { deleteUser, getLoggedInUserId, type User } from '../models/users';
import { Confirm } from './components/Confirm';
import { URLorFileUploadInput } from './components/URLorFileUploadInput';
import { Spinner } from './components/Spinner';

export function Settings()  {
  const user = useLoaderData() as User;
  console.log(`User:`, user);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio || '');
  const [avatarHostURL, setAvatarHostURL] = useState<string>("");
  const [isAvatarUploaded, setIsAvatarUploaded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [err, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);


  const { revalidate } = useRevalidator();
  
  
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
                
    try {
      const userId = getLoggedInUserId();
      const updatedProfile: UpdatedProfile = {
        username,
        email,
        bio,
        avatar: isAvatarUploaded ? avatarHostURL : user.avatar,
        password: newPassword,
      }; 


      setShowSpinner(true);
const response = await apiClient.put(`/users/${userId}`, {
    ...updatedProfile,
  
});
      setShowSpinner(false);
      console.log('Profile updated successfully!');
      revalidate();
      navigate(`/profile/${userId}`);
      return response.data as User;
    } catch (error) {
      console.error(error);
      setErrors({ profile: (error as Error).message });
    }
  
}

  async function handleSaveChanges(): Promise<void> {
    setShowSpinner(true);
    await handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
    setShowSpinner(false);
  }

  return (
   <main className={styles.settingsMain}>
    <h1>Account Settings:</h1>
    {showSpinner && <Spinner/>}
     <section className={styles.profileInformation}>
        <form onSubmit={handleSubmit} >
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            name="username"
            id="username"
            label="Username:"
            required
            />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            id="email"
            label="Email:"
            required
            />
          <label>Bio:</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            name={"bio"}
            id={"bio"} 
            rows={3}
            className={styles.bio}
              />
          <URLorFileUploadInput 
              setImageHostURL={setAvatarHostURL} 
              setIsImageUploaded={setIsAvatarUploaded}                                         
              type="text" 
              id="avatarURL" 
              label="Profile Picture" 
              name="avatarURL" 
              placeholder="put link or upload"
              />   
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            name="currentPassword"
            id="currentPassword"
            label="Current Password:"
            autoComplete='off'
            required
           />
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            name="newPassword"
            id="newPassword"
            label="New Password:"
            autoComplete='off'
            required
           />
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirmPassword"
            id="confirmPassword"
            label="Confirm Password:"
            autoComplete='off'
            required
           />
        </form>
          <div className={styles.passwordRulesSection}>
              <h3>Password Rules:</h3>
                  <PasswordRules password={newPassword} />  
          </div>        
          {showError && err && 
            <ErrorMsg message={err.profile}
                onOk={() => {setShowError(false)}} 
            />
          }
     </section>
     <section className={styles.accountActions}>
        <GeneralButton label="Save Changes" onClick={handleSaveChanges} />
        <div className={styles.deleteButton}>
        <GeneralButton label="Delete Account"
          onClick={() => setShowConfirm(true)}/>
          {showConfirm && (
            <Confirm
               question="Are you sure you want to delete your account?"
               onYes={deleteUser}
               onNo={() => setShowConfirm(false)}
             />
           )} 
           </div>
      </section>      
   </main>
  );
};

type PasswordRulesProps = { password: string };
function PasswordRules({ password }: PasswordRulesProps) {
    return (
        <ul className={styles.passwordRules}>
            <li className={password.length >= 8 ? styles.satisfied : undefined}>8 characters long</li>
            <li className={password.match(/[a-z]/) ? styles.satisfied : undefined}>1 lowercase letter</li>
            <li className={password.match(/[A-Z]/) ? styles.satisfied : undefined}>1 uppercase letter</li>
            <li className={password.match(/[0-9]/) ? styles.satisfied : undefined}>1 digit</li>
        </ul>
    );
}

interface UpdatedProfile {
  username: string;
  email: string;
  bio: string | undefined;
  avatar: string | undefined;
  password: string;
}
