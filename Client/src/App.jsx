// eslint-disable-next-line no-unused-vars
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SelectRole from './page/login/SelectRole';

import { AppLay } from './page/Feature/AppLay/AppLay';
import CreateEventForm from './page/Feature/EventsStaff/events';
import { AppLayDash } from './page/Feature/allTest/dashs';
import Waress from './page/Feature/allTest/Waress';
import LoginNew from './page/login/UserLogin';



function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<div className="centered"><SelectRole /></div>} />
       <Route path="/Login" element={<div className="centered"><LoginNew/></div>} />
      <Route path="/AppLay" element={<div className="centered"><AppLay/></div>} />  
      <Route path="/CreateEventForm" element={<div className="centered"><CreateEventForm/></div>} /> 
      <Route path="/SelectRole" element={<div className="centered"><SelectRole/></div>} />
      
      <Route path="/AppLayDash" element={<div className="centered"><AppLayDash/></div>} />
      <Route path="/Waress" element={<div className="centered"><Waress/></div>} />
    
      </Routes>
    </Router>
  );
}
export default App;