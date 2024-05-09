import NavBar from "../../Component/Navbar";
import ShowData from "../EventsStaff/ShowEvent";
import Styles from "./AppLay.module.css";

export function AppLay() {
  return (
    <div className={Styles.AppLayOut}>
      <NavBar />
      <div className={Styles.UnNavss}>
        <ShowData />
      </div>
    </div>
  );
}
