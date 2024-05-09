import { useState } from "react";
import styles from "./events.module.css";
import Styles from "./AppLayCreate.module.css";
import NavBar from "../../Component/Navbar";
import { Link } from "react-router-dom";


function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notificationsValue, setNotificationsValue] = useState("");
  const [notificationsUnit, setNotificationsUnit] = useState("minus");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
          notifications_value: notificationsValue,
          notifications_unit: notificationsUnit,
        }),
      });
      if (response.ok) {
        alert("Event created successfully");
        window.location.href = '/AppLay';
      } else {
        alert("Failed to create event");
        window.location.href = '/AppLay';
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create event");
    }
  };

  return (
    <div className={Styles.AppLayOut}>
      <NavBar />
      <div className={Styles.UnNavss}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>FORM CREATE EVENTS</h2>

          <div className={Styles.oUTForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Title</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  className={styles.formInput}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className={styles.unForm}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Start Date</label>
                  <input
                    className={styles.formInput}
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Start Time</label>
                  <input
                    className={styles.formInput}
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>End Date</label>
                  <input
                    className={styles.formInput}
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>End Time</label>
                  <input
                    className={styles.formInput}
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.formLabel}>Notifications</label>
                <div className={styles.timE}>
                  <input
                    className={styles.formInput}
                    type="number"
                    value={notificationsValue}
                    onChange={(e) => setNotificationsValue(e.target.value)}
                  />
                  <select
                    className={styles.formInput}
                    value={notificationsUnit}
                    onChange={(e) => setNotificationsUnit(e.target.value)}
                  >
                    <option value="minus">Minus</option>
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </div>
              <div className={styles.Formbut}>
              <Link to='/AppLay'><button className={styles.formButtons} type="cancel">
                CANCEL
              </button></Link>
                <button className={styles.formButton} type="submit">
                  + ADD
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateEventForm;
