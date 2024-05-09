import { useState } from "react";
import PropTypes from 'prop-types';
import styles from './editEvent.module.css';

function EditEvent({ event, onSave, onCancel }) {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [startDate, setStartDate] = useState(event.start_date);
  const [startTime, setStartTime] = useState(event.start_time);
  const [endDate, setEndDate] = useState(event.end_date);
  const [endTime, setEndTime] = useState(event.end_time);
  const [notificationsValue, setNotificationsValue] = useState(event.notifications_value);
  const [notificationsUnit, setNotificationsUnit] = useState(event.notifications_unit);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
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
        alert("Event updated successfully");
        onSave(); // อัพเดทข้อมูลที่อยู่ในรายการหรือแสดงข้อมูลที่ถูกอัพเดท
        window.location.reload();
      } else {
        alert("Failed to update event");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update event");
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  EditEvent.propTypes = {
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      start_time: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      notifications_value: PropTypes.number.isRequired,
      notifications_unit: PropTypes.string.isRequired,
    }),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  return (
    <div className={styles.editEventContainer}>
      <h2 className={styles.editEventTitle}>UPDATE DATA</h2>
      <form className={styles.editEventForm}>
        <label htmlFor="title" className={styles.editEventLabel}>
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.editEventInput}
        />
        <label htmlFor="description" className={styles.editEventLabel}>
          Description:
        </ label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.editEventInput} style={{paddingRight:'1rem',paddingTop:'1rem',paddingLeft:'1.2rem'}}
        />

        <div>
          <label htmlFor="startDate" className={styles.editEventLabel}>
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={styles.editEventInput} 
          />
          <label htmlFor="startTime" className={styles.editEventLabel}>
            Start Time:
          </label>
          <input
            type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={styles.editEventInput}
          />
        </div>
        <div>
          <label htmlFor="endDate" className={styles.editEventLabel}>
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={styles.editEventInput}
          />

          <label htmlFor="endTime" className={styles.editEventLabel}>
            End Time:
          </label>
          <input
            type="time"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={styles.editEventInput}
          />
        </div>
        <div>
          <label htmlFor="notificationsValue" className={styles.editEventLabel}>
            Notifications:
          </label>
          <input
            type="number"
            id="notificationsValue"
            value={notificationsValue}
            onChange={(e) => setNotificationsValue(e.target.value)}
            className={styles.editEventInput}
          />
          <label htmlFor="notificationsUnit" className={styles.editEventLabel}>
            Unit:
          </label>
          <select
            id="notificationsUnit"
            value={notificationsUnit}
            onChange={(e) => setNotificationsUnit(e.target.value)}
            className={styles.editEventInput}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
          <div className={styles.BusKX}>
            <button type="button" onClick={handleCancel} className={styles.editEventCancelButton}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate} className={styles.editEventSaveButton}>
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditEvent;
