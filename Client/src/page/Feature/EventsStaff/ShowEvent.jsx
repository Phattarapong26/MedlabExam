import { useState, useEffect } from 'react';
import styles from './events.module.css';
import EditEvent from './editEvents';
import { Link } from 'react-router-dom';

function ShowData() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 3;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:3000/events');
      if (response.ok) {
        const eventData = await response.json();
        setEvents(eventData);
      } else {
        console.error('Error fetching events:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/events/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updatedEvents = events.filter((event) => event.id !== id);
        setEvents(updatedEvents);
      } else {
        console.error('Error deleting event:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const editEvent = (id) => {
    const eventToEdit = events.find((event) => event.id === id);
    setEditingEvent(eventToEdit);
  };

  const saveEditedEvent = () => {
    const updatedEvents = events.map((event) => {
      if (event.id === editingEvent.id) {
        return editingEvent;
      } else {
        return event;
      }
    });
    setEvents(updatedEvents);
    setEditingEvent(null);
  };

  const cancelEditing = () => {
    setEditingEvent(null);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={styles.showDataContainer}>
      <hr style={{width:'1400px',marginTop:'0px',marginBottom:'2rem',color:'#dad8d859',position:'fixed',top: '270px' }}></hr>
      <div className={styles.HeadE}>
      <div className={styles.HeadETitle}>
      <h2 className={styles.showDataTitle}>Events Data</h2>
      </div>
      <div className={styles.HeadENon}>
      <Link to="/CreateEventForm"><button className={styles.CreE}>+Create</button></Link>
      </div>
      </div>
      <div className={styles.eventsList}>
        {currentEvents.map((event, index) => (
          <div key={index} className={styles.eventItem}>
            <div className={styles.eventCard}>
            <div className={styles.DaCard}>
                <h4>Topic:<h3>{event.title}</h3></h4>
                <p>Description:<p2>{event.description}</p2></p>
                <p>Start Date:<p2>{new Date(event.start_date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p2></p>
                <p>Start Time:<p2> {event.start_time}</p2></p>
                <p>End Date: <p2>{new Date(event.end_date).toLocaleDateString()}</p2></p>
                <p>End Time:<p2> {event.end_time}</p2></p>
                <p>Notifications:<p2> {event.notifications_value}</p2> {event.notifications_unit}</p>
              </div>
              <div className={styles.Buts}>
                <button onClick={() => deleteEvent(event.id)}>Delete</button>
                <button onClick={() => editEvent(event.id)}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.pagination}>
        <button onClick={() => paginate(1)}>First</button>
        <button onClick={() => paginate(currentPage - 1)}>Previous</button>
        {Array.from({ length: Math.ceil(events.length / eventsPerPage) }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)}>Next</button>
        <button onClick={() => paginate(Math.ceil(events.length / eventsPerPage))}>Last</button>
      </div>
      {editingEvent && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <EditEvent
              event={editingEvent}
              onSave={saveEditedEvent}
              onCancel={cancelEditing}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShowData;
