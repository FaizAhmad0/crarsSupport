import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Skeleton,
  Table,
  Tag,
  Button,
  message,
  Tooltip,
  Select,
  Input,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";

import ManagerLayout from "../Layouts/ManagerLayout";

const { Option } = Select;
const { Search } = Input;

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerComplaint = () => {
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
        `${backendUrl}/manager/getallcomplaints`,
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
    const createdAt = new Date(appointment.createdAt);

    if (isNaN(createdAt.getTime())) return false; // Ensure valid date

    // Convert to local date (ignoring time)
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const createdAtDate = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate()
    );

    switch (dateFilter) {
      case "today":
        return createdAtDate.getTime() === nowDate.getTime();

      case "yesterday":
        const yesterday = new Date(nowDate);
        yesterday.setDate(nowDate.getDate() - 1);
        return createdAtDate.getTime() === yesterday.getTime();

      case "thisWeek":
        const startOfWeek = new Date(nowDate);
        startOfWeek.setDate(nowDate.getDate() - nowDate.getDay()); // Start of the week (Sunday)
        return createdAtDate >= startOfWeek;

      case "thisMonth":
        return (
          createdAt.getFullYear() === now.getFullYear() &&
          createdAt.getMonth() === now.getMonth()
        );

      case "thisYear":
        return createdAt.getFullYear() === now.getFullYear();

      default:
        return true;
    }
  };

  const filteredAppointments = appointments
    .filter((appointment) => {
      const searchLower = searchText.toLowerCase(); // Convert search text to lowercase for case-insensitive search

      // Ensure caseId is a valid string before modifying
      const modifiedCaseId = `SSR@15@2002@${
        appointment.caseId ? appointment.caseId.toString() : ""
      }`.toLowerCase();

      // console.log("Checking:", {
      //   enrollment: appointment.enrollment,
      //   caseId: appointment.caseId,
      //   modifiedCaseId,
      //   searchText,
      // });

      return (
        appointment.enrollment?.toLowerCase().includes(searchLower) ||
        modifiedCaseId.includes(searchLower)
      );
    })
    .filter(filterByDate); // Assuming this function is correct

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
      title: "CASE ID",
      dataIndex: "caseId",
      key: "caseId",
      ellipsis: true,
      render: (text) => {
        const caseId = `SSR@15@2002@${text}`;

        const handleCopy = () => {
          navigator.clipboard.writeText(caseId);
          message.success("Copied to clipboard!");
        };

        return (
          <span>
            {caseId}{" "}
            <Tooltip title="Copy">
              <CopyOutlined
                style={{ cursor: "pointer", marginLeft: 8, color: "#1890ff" }}
                onClick={handleCopy}
              />
            </Tooltip>
          </span>
        );
      },
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
    // {
    //   title: "Review",
    //   key: "action",
    //   render: (_, record) => {
    //     // Check if the appointment has a userReview
    //     const hasReview =
    //       record.userReview &&
    //       record.userReview.rating !== 0 &&
    //       record.userReview.comment.trim() !== "";

    //     return hasReview ? (
    //       // If review exists, display the existing rating and message with a checkmark icon
    //       <div className="flex pl-8 items-center font-semibold space-x-2">
    //         {record.userReview.comment}
    //       </div>
    //     ) : (
    //       // If no review, show the "Add Review" button
    //       <div className="flex items-center">N/A</div>
    //     );
    //   },
    // },
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
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => {
    //     const isCompleted = record.status.toLowerCase() === "completed";

    //     return isCompleted ? null : (
    //       <Button
    //         type="primary"
    //         className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold shadow-lg hover:shadow-xl"
    //         onClick={() => handleMarkAsComplete(record.appointmentId)}
    //       >
    //         Mark Complete
    //       </Button>
    //     );
    //   },
    // },
  ];

  return (
    <ManagerLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-full mb-8 pb-3 px-4 bg-gradient-to-r from-blue-800 to-blue-300 shadow-lg rounded-lg">
          <h1 className="text-2xl pt-4 font-bold text-white">All Complaints</h1>
          <div className="mt-4 flex items-center space-x-4">
            <Search
              placeholder="Search by Enrollment ID or Case ID"
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
          <p className="text-center text-gray-500">No complaint found.</p>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerComplaint;
