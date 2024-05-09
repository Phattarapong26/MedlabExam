import { useState } from "react";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <img src="https://phattarapong26.github.io/Medlab-Global/src/image/Mula%20GlobalWt.png"style={{ width: "160px"}} alt="Logo" />
      </div>
      
      <ul className={styles.menu}>
        <li>
          <a href="/AppLayDash">DASHBOARD</a>
        </li>

        <li className={styles.dropdown}>
          <a href="#" onClick={toggleDropdown}>
            IMPORT
          </a>
          {isOpen && (
            <ul className={styles.submenu}>
              <li>
                <a href="#">Import</a>
              </li>
              <li>
                <a href="#">Import Detail</a>
              </li>
              <li>
                <a href="#">Import State</a>
              </li>
            </ul>
          )}
        </li>

        <li className={styles.dropdown}>
          <a href="#" onClick={toggleDropdown}>
            EXPORT
          </a>
          {isOpen && (
            <ul className={styles.submenu}>
              <li>
                <a href="#">Import</a>
              </li>
              <li>
                <a href="#">Import Detail</a>
              </li>
              <li>
                <a href="#">Import State</a>
              </li>
            </ul>
          )}
        </li>

        <li className={styles.dropdown}>
          <a href="#" onClick={toggleDropdown}>
            STOCK
          </a>
          {isOpen && (
            <ul className={styles.submenu}>
              <li>
                <a href="#">DRUG</a>
              </li>
              <li>
                <a href="#">Import Detail</a>
              </li>
              <li>
                <a href="#">Import State</a>
              </li>
            </ul>
          )}
        </li>

        <li>
          <a href="#">HISTORY</a>
        </li>

        <li>
          <a href="/AppLay">EVENTS</a>
        </li>
        </ul>

        <div className="account">
        <li className={styles.account}>
          <a href="/" onClick={(e) => { e.preventDefault();
              if (confirm("Are you sure you want to logout?")) {
                // logout logic here
                console.log("Logged out");
                window.location.href = "/";
              }
            }}
          >
            <img src="https://scontent.fbkk29-4.fna.fbcdn.net/v/t39.30808-6/432472285_1617098045768293_6393617406718955417_n.jpg?stp=cp6_dst-jpg&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_ohc=VesN45RfOCkQ7kNvgF3yI6V&_nc_ht=scontent.fbkk29-4.fna&oh=00_AfDgwMgWm5_S_WisiYsD-eJApx5QeV3ePbOWe6LPtIMzdA&oe=663827B4" alt="User" />
            <span>Phat.MD</span>
          </a>
        </li>
        </div>
    </nav>
  );
};
export default NavBar;
