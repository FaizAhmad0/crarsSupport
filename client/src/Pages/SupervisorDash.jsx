import React, { useState, useEffect } from "react";
import SupervisorLayout from "../Layouts/SupervisorLayout";
import { Typography, Card, message, Skeleton, Row, Col } from "antd";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import axios from "axios";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const SupervisorDash = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) {
      setError("User ID not found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch Manager Details
        const userResponse = await axios.get(`${backendUrl}/user/${uid}`);
        setUser(userResponse.data.user?.[0]);

        // Fetch Appointments
        const name = localStorage.getItem("name");
        const token = localStorage.getItem("token");
        const appointmentsResponse = await axios.get(
          `${backendUrl}/admin/getallappointments`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { name },
          }
        );
        setAppointments(appointmentsResponse.data.appointments);

        // Fetch Tickets
        const ticketsResponse = await axios.get(
          `${backendUrl}/admin/getalltickets`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { manager: name },
          }
        );
        setTickets(ticketsResponse.data.tickets);
      } catch (err) {
        setError("Error loading data. Please try again.");
        message.error("Error loading dashboard details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendUrl]);

  if (loading) {
    return (
      <SupervisorLayout>
        <div className="p-4 space-y-6">
          {/* Skeleton for User Details */}
          <div className="flex items-center space-x-4">
            <Skeleton.Avatar active size="large" />
            <Skeleton.Input active style={{ width: 200 }} />
          </div>
          <Skeleton paragraph={{ rows: 4 }} active />

          {/* Skeleton for Cards */}
          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24} sm={12} lg={12}>
              <Skeleton.Button active block style={{ height: 150 }} />
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Skeleton.Button active block style={{ height: 150 }} />
            </Col>
          </Row>
        </div>
      </SupervisorLayout>
    );
  }

  if (error) {
    return (
      <SupervisorLayout>
        <div className="text-center p-6">
          <Text type="danger">{error}</Text>
        </div>
      </SupervisorLayout>
    );
  }

  return (
    <SupervisorLayout>
      <div className="p-4 space-y-6">
        {/* User Details */}
        {user && (
          <>
            <div className="flex items-center space-x-4">
              <UserOutlined className="text-blue-500 text-2xl" />
              <h3
                className="text-3xl font-extrabold text-center"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome, {localStorage.getItem("name")}
              </h3>
            </div>
            <Card className="shadow-md rounded-lg" bordered={false}>
              <div className="space-y-2">
                <Text strong>Name:</Text> {user.name}
                <br />
                <Text strong>Email:</Text> {user.email}
                <br />
                <Text strong>UID:</Text> {user.uid || "N/A"}
                <br />
                <Text strong>
                  Joining Date:{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </div>
            </Card>
          </>
        )}

        <Row gutter={[16, 16]} className="mt-6">
          {/* Appointments Count */}
          <Col xs={24} sm={12} lg={12}>
            <Card
              onClick={() => {
                navigate("/sup-appointment");
              }}
              className="bg-gradient-to-r from-blue-800 to-blue-400 text-white shadow-lg rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
              bordered={false}
            >
              <div className="flex items-center space-x-4">
                <CalendarTodayOutlinedIcon
                  style={{ fontSize: "40px", color: "white" }}
                />
                <div>
                  <Text className="text-lg font-bold block text-white">
                    Total Appointments: {appointments.length}
                  </Text>
                  <Text className="text-sm block text-white">
                    Completed:{" "}
                    {
                      appointments.filter(
                        (appointment) => appointment.status === "Completed"
                      ).length
                    }
                  </Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* Tickets Count */}
          <Col xs={24} sm={12} lg={12}>
            <Card
              onClick={() => {
                navigate("/sup-tickets");
              }}
              className="bg-gradient-to-r from-green-800 to-green-400 text-white shadow-lg rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
              bordered={false}
            >
              <div className="flex items-center space-x-4">
                <ConfirmationNumberOutlinedIcon
                  style={{ fontSize: "40px", color: "white" }}
                />
                <div>
                  <Text className="text-lg font-bold block text-white">
                    Tickets: {tickets.length}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </SupervisorLayout>
  );
};

export default SupervisorDash;
