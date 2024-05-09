// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import styles from './card.module.css'; // Import CSS styles for card

function Card({ event }) {
  return (
    <div className={styles.card}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <p>Start Date: {event.startDate}</p>
      <p>Start Time: {event.startTime}</p>
      <p>End Date: {event.endDate}</p>
      <p>End Time: {event.endTime}</p>
      <p>Notifications: {event.notificationsValue} {event.notificationsUnit}</p>
    </div>
  );
}

// Define PropTypes for Card component
Card.propTypes = {
  event: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    notificationsValue: PropTypes.number.isRequired,
    notificationsUnit: PropTypes.string.isRequired
  }).isRequired
};

export default Card;
