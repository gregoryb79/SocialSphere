
import styles from "./App.module.scss";
import { Outlet, useNavigate} from "react-router";
import { ArrowLeft, Bell, Home, LogOut, Plus, Search, Settings, User } from "lucide-react";
import { NavButton } from "./pages/components/NavButton";

export function App() {  

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

  return (
    <nav className={styles.nav}>
      <NavButton title="Back" ariaLabel="Navigate Back" icon={<ArrowLeft className={styles.lucideIconTop} color="var(--white)"/>} onClick={() => navigate(-1)}/>      
      <h2>SocialSphere</h2>
      <NavButton title="Settings" ariaLabel="Settings"  icon={<Settings className={styles.lucideIconTop} color="var(--white)"/>} onClick={() => navigate("/")}/> {/* stub for navigation to settings page */}
    </nav>
  );
}

function Footer() {
  console.log("Footer component rendered");
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>
        <NavButton title="Home" ariaLabel="Navigate to HomePage" icon={<Home className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/")}/>      
        <NavButton title="Search" ariaLabel="Open Search Page" icon={<Search className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/")}/> {/* stub for navigation to search page */     }
        <NavButton title="Create Post" ariaLabel="Create new post" icon={<Plus className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/")}/> {/* stub for navigation to new post page */ }
        <NavButton title="Notifications" ariaLabel="Check your notifications" icon={<Bell className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/")}/> {/* stub for navigation to notofications page */       }
        <NavButton title="Profile" ariaLabel="Configure your profile" icon={<User className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/")}/> {/* stub for navigation to profile page */}
        <NavButton title="LogOut" ariaLabel="LogOut" icon={<LogOut className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/")}/> {/* stub for logging out and navigation to login page */}             
      </nav>
      <p>-- Website Credintials --</p>
      
    </footer>
  );
}
