
import styles from "./App.module.scss";
import { Outlet, useLocation, useNavigate} from "react-router";
import { ArrowLeft, Bell, Home, LogIn, LogOut, MessageCircle, Plus, Search, Settings, User } from "lucide-react";
import { IconButton } from "./pages/components/IconButton";
import { useEffect, useState } from "react";
import { Spinner } from "./pages/components/Spinner";
import { doLogOut, getLoggedInUserId, getLoggedInUserName } from "./models/users";

export function App() {  

  console.log("App component rendered");

  return (
    <div className={styles.mainContainer}>      
      <TopNav/>
      <div className={styles.content}>
        <Outlet/>
        <Footer/>
      </div>      
    </div>
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

  const [width, setWidth] = useState(window.innerWidth);
  const [isDescktop, setIsDescktop] = useState(width >= 500); 
  
  return (
    <nav className={styles.nav}>
      {loading && <Spinner/>}
      <IconButton title="Back" ariaLabel="Navigate Back" icon={<ArrowLeft className={styles.lucideIconTop} color="var(--white)"/>} onClick={() => {
          navigate(-1);
          setLoading(true);
        }}/>      
      <h2>SocialSphere</h2>
      <section className={styles.topNavButtons}>
        {isDescktop && <IconButton title="Notifications" ariaLabel="Check your notifications" icon={<Bell className={styles.lucideIconTop} color={(username != "Guest") ? "var(--white)" : "var(--primary-blue)"} />} onClick={() => {
                navigate("/notifications");
                setLoading(true);
              }} disabled={username == "Guest"}/>}
        <IconButton title="Settings" ariaLabel="Settings"  icon={<Settings className={styles.lucideIconTop} color={(username != "Guest") ? "var(--white)" : "var(--primary-blue)"}/>} onClick={() => {
            navigate("/settings");
            setLoading(true);
          }}disabled={username == "Guest"}/>
      </section>
    </nav>
  );
}

function Footer() {
  console.log("Footer component rendered");
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const username = getLoggedInUserName() || "Guest";
  const userId = getLoggedInUserId();
  console.log(`Footer rendered for user: ${username} with ID: ${userId}`);
  useEffect(() => {
    setLoading(false); // Hide spinner on any route change
  }, [location]);

  const [width, setWidth] = useState(window.innerWidth);
  const [isDescktop, setIsDescktop] = useState(width >= 500);  

  console.log(`$$$ Current window width: ${width}, is desktop: ${isDescktop}`);

  return (
    <footer className={styles.footer}>
      <nav className={styles.footerNav}>
        {loading && <Spinner/>}
        <IconButton title="Home" ariaLabel="Navigate to HomePage" 
          label={isDescktop ? "Home" : ""}
          icon={<Home className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            navigate("/");
            setLoading(true);
          }}/>      
        <IconButton title="Search" ariaLabel="Open Search Page" 
          label={isDescktop ? "Search" : ""}
          icon={<Search className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => navigate("/search")}/>
        <IconButton title="Create Post" ariaLabel="Create new post" 
          label={isDescktop ? "Add Post" : ""}
          icon={<Plus className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(---light-gray-bg)"}/>} onClick={() => {
            navigate("/new-post");
            setLoading(true);
          }} disabled={username == "Guest"}/>
        {!isDescktop && <IconButton title="Notifications" ariaLabel="Check your notifications" icon={<Bell className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(--light-gray-bg)"}/>} onClick={() => {
              navigate("/notifications");
              setLoading(true);
            }} disabled={username == "Guest"}/>}
        <IconButton title="Chat" ariaLabel="Open Chat Page" 
          label={isDescktop ? "Chat" : ""}
          icon={<MessageCircle className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(--light-gray-bg)"} />} 
          onClick={() => {
            navigate("/chat");
            setLoading(true);
          }} disabled={username == "Guest"} />
        <IconButton title="Profile" ariaLabel="Configure your profile" 
          label={isDescktop ? username : ""}
          icon={<User className={styles.lucideIconFooter} color={(username != "Guest") ? "var(--primary-blue)" : "var(--light-gray-bg)"}/>} onClick={() => {
            navigate(`/profile/${userId}`);
            setLoading(true);
          }} disabled={username == "Guest"}/>
        {(username == "Guest") && <IconButton title="Log In" 
          label={isDescktop ? "Log In" : ""}
          icon={<LogIn className={styles.lucideIcon} color="var(--primary-blue)" />} ariaLabel="Log In Button" onClick={() => navigate("/login")} />}
        {(username != "Guest") && <IconButton title="LogOut" ariaLabel="LogOut" 
          label={isDescktop ? "Log Out" : ""}
          icon={<LogOut className={styles.lucideIconFooter} color="var(--primary-blue)"/>} onClick={() => {
            doLogOut();
            navigate("/login");
          }}/>}
      </nav>
      {/* <p>-- Social Sphere --</p> */}
      
    </footer>
  );
}
