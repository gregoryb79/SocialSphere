
import styles from "./App.module.scss";
import { Outlet, useLocation, useNavigate} from "react-router";
import { ArrowLeft, Bell, Home, LogOut, Plus, Search, Settings, User } from "lucide-react";
import { IconButton } from "./pages/components/IconButton";
import { useEffect, useState } from "react";
import { Spinner } from "./pages/components/Spinner";
import { doLogOut } from "./models/users";

export function App() {  

  console.log("App component rendered");

  return (
     <>      
      <TopNav/>      
      <Outlet/>
      <Footer/>
    </>
  );
}

function TopNav() { 

  console.log("Nav component rendered");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(false); // Hide spinner on any route change
  }, [location]);
  
  return (
    <nav className={styles.nav}>
      {loading && <Spinner/>}
      <IconButton title="Back" ariaLabel="Navigate Back" icon={<ArrowLeft className={styles.lucideIconTop} color="var(--white)"/>} onClick={() => {
          navigate(-1);
          setLoading(true);
        }}/>      
      <h2>SocialSphere</h2>
      <IconButton title="Settings" ariaLabel="Settings"  icon={<Settings className={styles.lucideIconTop} color="var(--white)"/>} onClick={() => {
          navigate("/settings");
          setLoading(true);
        }}/>
    </nav>
  );
}

function Footer() {
  console.log("Footer component rendered");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(false); // Hide spinner on any route change
  }, [location]);

  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>
        {loading && <Spinner/>}
        <IconButton title="Home" ariaLabel="Navigate to HomePage" icon={<Home className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            navigate("/");
            setLoading(true);
          }}/>      
        <IconButton title="Search" ariaLabel="Open Search Page" icon={<Search className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/search")}/>
        <IconButton title="Create Post" ariaLabel="Create new post" icon={<Plus className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            navigate("/new-post");
            setLoading(true);
          }}/>
        <IconButton title="Notifications" ariaLabel="Check your notifications" icon={<Bell className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
              navigate("/notifications");
              setLoading(true);
            }}/>
        <IconButton title="Profile" ariaLabel="Configure your profile" icon={<User className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            navigate("/profile");
            setLoading(true);
          }}/>
        <IconButton title="LogOut" ariaLabel="LogOut" icon={<LogOut className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            doLogOut();
            navigate("/login");
          }}/> {/* stub for logging out and navigation to login page */}             
      </nav>
      <p>-- Website Credintials --</p>
      
    </footer>
  );
}
