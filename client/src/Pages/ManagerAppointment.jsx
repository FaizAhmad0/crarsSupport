import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton, Table, Tag, Button, message, Select, Input } from "antd";
import ManagerLayout from "../Layouts/ManagerLayout";

const { Option } = Select;
const { Search } = Input;

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // Search state
  const [dateFilter, setDateFilter] = useState("all"); // Date filter state

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
        `${backendUrl}/manager/getallappointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { name },
        }
      );

      const sortedAppointments = response.data.appointments.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setAppointments(sortedAppointments);
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

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
  };

  const filterByDate = (appointment) => {
    if (dateFilter === "all") return true;

    const now = new Date();
    const appointmentDate = new Date(appointment.date);

    switch (dateFilter) {
      case "today":
        return appointmentDate.toDateString() === new Date().toDateString();
      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return appointmentDate.toDateString() === yesterday.toDateString();
      case "thisWeek":
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        return appointmentDate >= startOfWeek;
      case "thisMonth":
        return (
          appointmentDate.getMonth() === now.getMonth() &&
          appointmentDate.getFullYear() === now.getFullYear()
        );
      case "thisYear":
        return appointmentDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        appointment.enrollment
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        appointment.appointmentId
          ?.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
    )
    .filter(filterByDate);

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
      width: 120,
      render: (text) => {
        if (!text) {
          return "N/A"; // Handle empty or null time values
        }

        // Ensure time string is valid and fallback if parsing fails
        try {
          const [hours, minutes] = text.split(":");
          if (!hours || !minutes) throw new Error("Invalid time format");

          // Format the time with Intl.DateTimeFormat
          const date = new Date();
          date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
          const options = {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          };
          return new Intl.DateTimeFormat("en-US", options).format(date);
        } catch (error) {
          console.error("Error parsing time:", text, error.message);
          return "Invalid Time";
        }
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
      title: "Review",
      key: "action",
      render: (_, record) => {
        // Check if the appointment has a userReview
        const hasReview =
          record.userReview &&
          record.userReview.rating !== 0 &&
          record.userReview.comment.trim() !== "";

        return hasReview ? (
          // If review exists, display the existing rating and message with a checkmark icon
          <div className="flex pl-8 items-center font-semibold space-x-2">
            {record.userReview.comment}
          </div>
        ) : (
          // If no review, show the "Add Review" button
          <div className="flex items-center">N/A</div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const isCompleted = record.status.toLowerCase() === "completed";

        return isCompleted ? null : (
          <Button
            type="primary"
            className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold shadow-lg hover:shadow-xl"
            onClick={() => handleMarkAsComplete(record.appointmentId)}
          >
            Mark Complete
          </Button>
        );
      },
    },
  ];

  return (
    <ManagerLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-full mb-8 pb-3 px-4 bg-gradient-to-r from-blue-800 to-blue-300 shadow-lg rounded-lg">
          <h1 className="text-2xl pt-4 font-bold text-white">
            All Appointments
          </h1>
          <div className="mt-4 flex items-center space-x-4">
            <Search
              placeholder="Search by Enrollment ID or Appointment ID"
              allowClear
              onChange={(e) => setSearchText(e.target.value)} // Update on input change
              style={{ maxWidth: "400px" }}
            />
            <Select
              defaultValue="all"
              style={{ width: 200 }}
              onChange={handleDateFilterChange}
            >
              <Option value="all">All Dates</Option>
              <Option value="today">Today</Option>
              <Option value="yesterday">Yesterday</Option>
              <Option value="thisWeek">This Week</Option>
              <Option value="thisMonth">This Month</Option>
              <Option value="thisYear">This Year</Option>
            </Select>
          </div>
        </div>

        {loading ? (
          <Skeleton active />
        ) : filteredAppointments.length > 0 ? (
          <Table
            className="w-full cursor-pointer"
            columns={columns}
            dataSource={filteredAppointments}
            rowKey="appointmentId"
            bordered
            scroll={{ x: true }} // Enables table scrolling for small screens
            pagination={{ pageSize: 20 }}
          />
        ) : (
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerAppointment;
