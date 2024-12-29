import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import User from "../components/User";
import styles from "./AppLayout.module.css";
import ProtectedRoute from "./ProtectedRoute";

function AppLayout() {
  return (
    <div className={styles.app}>
      <Sidebar />
      <Map></Map>
      <User></User>
    </div>
  );
}

export default AppLayout;
