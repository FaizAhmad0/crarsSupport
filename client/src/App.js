import "./App.css";
import React from "react";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./Pages/LogIn";
import UserDash from "./Pages/UserDash";
import RaiseTicketForm from "./Pages/RaiseTicketForm";
import UserTickets from "./Pages/UserTickets";
import TicketDetails from "./Pages/TicketDetails";
import BookAppointmentForm from "./Pages/BookAppointmentForm";
import UserAppointment from "./Pages/UserAppointment";
import ManagerDash from "./Pages/ManagerDash";
import ManagerTickets from "./Pages/ManagerTickets";
import ManagerTicketDetails from "./Pages/ManagerTicketDetails";
import ManagerAppointment from "./Pages/ManagerAppointment";
import AdminDash from "./Pages/AdminDash";
import AllTickets from "./Pages/AllTickets";
import AllAppointment from "./Pages/AllAppointment";
import AdminTckDetails from "./Pages/AdminTckDetails";
import SupervisorDash from "./Pages/SupervisorDash";
import SuppTickets from "./Pages/SuppTickets";
import SuppAppointments from "./Pages/SuppAppointments";
import UserPrivateRoute from "./Components/UserPrivateRoute";
import ManagerPrivateRoute from "./Components/ManagerPrivateRoute";
import AdminPrivateRoute from "./Components/AdminPrivateRoute";
import SupPrivateRoute from "./Components/SupPrivateRoute";
import ManagerRaisedTicket from "./Pages/ManagerRaisedTicket";
import Holiday from "./Pages/Holiday";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/raise-ticket" exact element={<RaiseTicketForm />} />

          {/* User Routes with Weekday Validation */}
          <Route element={<UserPrivateRoute />}>
            <Route path="/userdash" exact element={<UserDash />} />
            <Route path="/user-tickets" exact element={<UserTickets />} />
            <Route path="/ticket/:ticketId" element={<TicketDetails />} />
            <Route path="/book-appointment" element={<BookAppointmentForm />} />
            {/* <Route path="/book-appointment" element={<Holiday />} /> */}
            <Route path="/appointments" element={<UserAppointment />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<ManagerPrivateRoute />}>
            <Route path="/managerdash" element={<ManagerDash />} />
            <Route path="/manager-tickets" element={<ManagerTickets />} />
            <Route
              path="/manager-raisedtickets"
              element={<ManagerRaisedTicket />}
            />
            <Route
              path="/managerticket/:ticketId"
              element={<ManagerTicketDetails />}
            />
            <Route
              path="/manager-appointments"
              element={<ManagerAppointment />}
            />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admindash" element={<AdminDash />} />
            <Route path="/admin-tickets" element={<AllTickets />} />
            <Route path="/admin-appointment" element={<AllAppointment />} />
            <Route path="/admin/:ticketId" element={<AdminTckDetails />} />
          </Route>

          {/* Supervisor Routes */}
          <Route element={<SupPrivateRoute />}>
            <Route path="/supervisordash" element={<SupervisorDash />} />
            <Route path="/sup-tickets" element={<SuppTickets />} />
            <Route path="/sup-appointment" element={<SuppAppointments />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
