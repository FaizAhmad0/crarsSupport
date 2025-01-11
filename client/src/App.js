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

const WeekdayRouteWrapper = ({ children }) => {
  const today = new Date().getDay(); // 0 is Sunday, 6 is Saturday
  if (today === 0 || today === 6) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="bg-white bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-black shadow-xl rounded-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Dear Valued User,
          </h2>
          <p className="text-lg mb-4">
            We regret to inform you that the support portal is currently closed
            because{" "}
            <span className="font-bold">
              {today === 0 ? "Sunday" : "Saturday"}
            </span>
            .
          </p>
          <p className="text-lg mb-4">
            Please note that the portal will reopen on the next business day.
          </p>
          <p className="text-lg mb-6">Thank you for your cooperation.</p>
          <div className="text-center border-t pt-4">
            <p className="font-semibold">Sincerely,</p>
            <p className="font-bold">Saumic Craft Support Team</p>
          </div>
        </div>
      </div>
    );
  }
  return children;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<LogIn />} />
          <Route path="/raise-ticket" exact element={<RaiseTicketForm />} />

          {/* User Routes with Weekday Validation */}
          <Route
            element={
              <WeekdayRouteWrapper>
                <UserPrivateRoute />
              </WeekdayRouteWrapper>
            }
          >
            <Route path="/userdash" exact element={<UserDash />} />
            <Route path="/user-tickets" exact element={<UserTickets />} />
            <Route path="/ticket/:ticketId" element={<TicketDetails />} />
            <Route path="/book-appointment" element={<BookAppointmentForm />} />
            <Route path="/appointments" element={<UserAppointment />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<ManagerPrivateRoute />}>
            <Route path="/managerdash" element={<ManagerDash />} />
            <Route path="/manager-tickets" element={<ManagerTickets />} />
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
