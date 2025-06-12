
import styles from "./App.module.scss";
import { Outlet} from "react-router";

export function App() {  

  return (
     <>      
      <Nav/>      
      <Outlet/>
    </>
  );
}

function Nav() { 

  console.log("Nav component rendered");

  return (
    <nav className={styles.nav}>      
      <p>Navigation Bar</p>
    </nav>
  );
}
