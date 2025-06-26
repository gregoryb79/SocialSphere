
import styles from "./App.module.scss";
import { Outlet, useLocation, useNavigate} from "react-router";
import { ArrowLeft, Bell, Home, LogIn, LogOut, Plus, Search, Settings, User } from "lucide-react";
import { IconButton } from "./pages/components/IconButton";
import { useEffect, useState } from "react";
import { Spinner } from "./pages/components/Spinner";
import { doLogOut, getLoggedInUserName } from "./models/users";

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
  const username = getLoggedInUserName();
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
      <IconButton title="Settings" ariaLabel="Settings"  icon={<Settings className={styles.lucideIconTop} color={(username != "Guest") ? "var(--white)" : "var(--light-text)"}/>} onClick={() => {
          navigate("/settings");
          setLoading(true);
        }}disabled={username == "Guest"}/>
    </nav>
  );
}

function Footer() {
  console.log("Footer component rendered");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const username = getLoggedInUserName();
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
        <IconButton title="Create Post" ariaLabel="Create new post" icon={<Plus className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(--light-text)"}/>} onClick={() => {
            navigate("/new-post");
            setLoading(true);
          }} disabled={username == "Guest"}/>
        <IconButton title="Notifications" ariaLabel="Check your notifications" icon={<Bell className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(--light-text)"}/>} onClick={() => {
              navigate("/notifications");
              setLoading(true);
            }} disabled={username == "Guest"}/>
        <IconButton title="Profile" ariaLabel="Configure your profile" icon={<User className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(--light-text)"}/>} onClick={() => {
            navigate("/profile");
            setLoading(true);
          }} disabled={username == "Guest"}/>
        {(username == "Guest") && <IconButton title="Log In" icon={<LogIn className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Log In Button" onClick={() => navigate("/login")}/>}
        {(username != "Guest") && <IconButton title="LogOut" ariaLabel="LogOut" icon={<LogOut className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            doLogOut();
            navigate("/login");
          }}/>}
      </nav>
      <p>-- Website Credintials --</p>
      
    </footer>
  );
}
