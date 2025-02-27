// eslint-disable-next-line no-unused-vars
import React from 'react';
import styles from './Select.module.css';
import { Link } from 'react-router-dom';

const SelectRole = () => {
    return (
        <div className={styles.Conk}>
        <div className={styles.TxtCOn}>
            <h1>MEDLAB WAREHOUSE</h1>
            <h2>ระบบจัดการคลังยา</h2>
        </div>
        <div className={styles.container}>
            <div className={styles.card}>
                <span></span>
                <div className={styles.content}>
                    <img src="https://raw.githubusercontent.com/Phattarapong26/image/2dc85cfdc4c702d93fd9a394db8d58a523af74de/undraw_programmer_re_owql.svg"
                        width="150px" className={styles.image} alt="Medicine" />
                    <hr className={styles.hr} />
                    <Link to="/Login"><button className={styles.button1}>MEDICINE</button></Link>
                </div>
            </div>

            <div className={styles.cards}>
                <span></span>
                <div className={styles.content}>
                    <img src="https://raw.githubusercontent.com/Phattarapong26/image/3a8251ae8ac3a21060ac1594429a1dda389d1407/undraw_conversation_re_c26v.svg"
                        width="150px" className={styles.image} alt="Admin" />
                    <hr className={styles.hr} />
                    <Link to="/AppLay"><button className={styles.button2}>ADMIN MD</button></Link>
                </div>
            </div>
        </div>
        <div className={styles.Rport}>
            <h3>แจ้งปัญหาการใช้งาน</h3>
        </div>
        </div>
    );
};

export default SelectRole;
