
import styles from "./App.module.scss";
import { Outlet} from "react-router";

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

  return (
    <nav className={styles.nav}>      
      <p>Navigation Bar</p>
    </nav>
  );
}

function Footer() {
  console.log("Footer component rendered");

  return (
    <footer className={styles.footer}>
      <p>Footer</p>
    </footer>
  );
}
