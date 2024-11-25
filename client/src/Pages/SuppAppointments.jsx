import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton, Table, Tag, Button, message } from "antd";
import SupervisorLayout from "../Layouts/SupervisorLayout";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SuppAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (!name || !token) {
      console.error("Missing user ID or token in localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/admin/getallappointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { name },
        }
      );

      // Sort appointments in descending order by date
      const sortedAppointments = response.data.appointments.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setAppointments(sortedAppointments || []);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleMarkAsComplete = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Missing authentication token.");
      }

      // Send request to mark the appointment as completed
      await axios.post(
        `${backendUrl}/manager/markappointmentcompleted`,
        { appointmentId, status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Appointment marked as completed!");
      fetchAppointments(); // Refresh the list of appointments
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to mark appointment as completed."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
      ellipsis: true,
      render: (text) => <span>AP{text}</span>,
    },
    {
      title: "Enrollment",
      dataIndex: "enrollment",
      key: "enrollment",
      ellipsis: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (text) => {
        const options = {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        };
        return new Intl.DateTimeFormat("en-US", options).format(new Date(text));
      },
    },
    {
      title: "Manager",
      dataIndex: "manager",
      key: "manager",
      ellipsis: true,
      render: (text) => text || "Not Assigned",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Confirmed", value: "confirmed" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color =
          status === "confirmed"
            ? "blue"
            : status === "Completed"
            ? "green"
            : status === "cancelled"
            ? "red"
            : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <SupervisorLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-full mb-8 pb-3 px-4 bg-gradient-to-r from-blue-800 to-blue-300 shadow-lg rounded-lg">
          <h1 className="text-2xl pt-4 font-bold text-white">
            All Appointments
          </h1>
        </div>

        {loading ? (
          <Skeleton active />
        ) : appointments.length > 0 ? (
          <Table
            className="w-full cursor-pointer"
            columns={columns}
            dataSource={appointments}
            rowKey="appointmentId"
            pagination={{ pageSize: 10 }}
            bordered
            scroll={{ x: true }} // Enables table scrolling for small screens
          />
        ) : (
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </div>
    </SupervisorLayout>
  );
};

export default SuppAppointments;
