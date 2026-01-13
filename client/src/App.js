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
import UserComplaint from "./Pages/UserComplaint";
import UserComplaints from "./Pages/UserComplaints";
import ManagerComplaint from "./Pages/ManagerComplaint";
import SupComplaints from "./Pages/SupComplaints";
import AdminComplaints from "./Pages/AdminComplaints";
import LoginForm from "./Pages/LoginForm";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Holiday />} />
          <Route path="/*" exact element={<Holiday />} />

          {/* <Route path="/login" exact element={<LoginForm />} />
          <Route path="/raise-ticket" exact element={<RaiseTicketForm />} /> */}

          {/* <Route element={<UserPrivateRoute />}>
            <Route path="/userdash" exact element={<UserDash />} />
            <Route path="/user-tickets" exact element={<UserTickets />} />
            <Route path="/ticket/:ticketId" element={<TicketDetails />} />
            <Route path="/book-appointment" element={<BookAppointmentForm />} />
            <Route path="/appointments" element={<UserAppointment />} />
            <Route path="/file-complaint" element={<UserComplaint />} />
            <Route path="/complaints" element={<UserComplaints />} />
          </Route> */}

          {/* <Route element={<ManagerPrivateRoute />}>
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
            <Route path="/manager-complaints" element={<ManagerComplaint />} />
          </Route> */}

          {/* <Route element={<AdminPrivateRoute />}>
            <Route path="/admindash" element={<AdminDash />} />
            <Route path="/admin-tickets" element={<AllTickets />} />
            <Route path="/admin-appointment" element={<AllAppointment />} />
            <Route path="/admin-complaints" element={<AdminComplaints />} />
            <Route path="/admin/:ticketId" element={<AdminTckDetails />} />
          </Route> */}

          {/* <Route element={<SupPrivateRoute />}>
            <Route path="/supervisordash" element={<SupervisorDash />} />
            <Route path="/sup-tickets" element={<SuppTickets />} />
            <Route path="/sup-appointment" element={<SuppAppointments />} />
            <Route path="/sup-complaints" element={<SupComplaints />} />
          </Route> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
