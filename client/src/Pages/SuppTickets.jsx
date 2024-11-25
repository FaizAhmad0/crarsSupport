import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton, Table, Tag } from "antd";
import SupervisorLayout from "../Layouts/SupervisorLayout";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SuppTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    const manager = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (!manager || !token) {
      console.error("Missing user ID or token in localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/admin/getalltickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { manager },
      });

      // Sort tickets in descending order by createdAt
      const sortedTickets = response.data.tickets.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTickets(sortedTickets || []);
    } catch (error) {
      console.error(
        "Error fetching tickets:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
      ellipsis: true,
      render: (text) => <span>TCK{text}</span>,
    },
    {
      title: "Enrollment",
      dataIndex: "enrollmentId",
      key: "enrollmentId",
      ellipsis: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
      ellipsis: true,
      filters: [
        { text: "Amazon", value: "amazon" },
        { text: "Website", value: "website" },
        { text: "Dispatch", value: "dispatch" },
        { text: "Accounts", value: "accounts" },
      ],
      onFilter: (value, record) => record.service === value,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Open", value: "Open" },
        { text: "Close", value: "Close" },
        {
          text: "Waiting for manager reply",
          value: "Waiting for manager reply",
        },
        { text: "Waiting for user reply", value: "Waiting for user reply" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color =
          status === "Open" ? "green" : status === "Close" ? "red" : "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Assigned To",
      dataIndex: "assignee",
      key: "assignee",
      ellipsis: true,
      render: (assignee) => assignee || "Not Assigned",
    },
  ];

  const handleRowClick = (ticketId) => {
    console.log("supervisor clicked");
  };

  return (
    <SupervisorLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-full mb-8 pb-3 px-4 bg-gradient-to-r from-blue-800 to-blue-300 shadow-lg rounded-lg">
          <h1 className="text-2xl pt-4 font-bold text-white">All Tickets</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex flex-wrap bg-white rounded-lg shadow-md p-4 space-x-4 lg:space-x-0"
              >
                <Skeleton.Input
                  active
                  className="w-full lg:w-1/6 mb-2 lg:mb-0"
                  style={{ height: "36px" }}
                />
                <Skeleton.Input
                  active
                  className="w-full lg:w-1/6 mb-2 lg:mb-0"
                  style={{ height: "36px" }}
                />
                <Skeleton.Input
                  active
                  className="w-full lg:w-1/6 mb-2 lg:mb-0"
                  style={{ height: "36px" }}
                />
                <Skeleton.Input
                  active
                  className="w-full lg:w-1/6 mb-2 lg:mb-0"
                  style={{ height: "36px" }}
                />
                <Skeleton.Input
                  active
                  className="w-full lg:w-1/6 mb-2 lg:mb-0"
                  style={{ height: "36px" }}
                />
                <Skeleton.Input
                  active
                  className="w-full lg:w-1/6 mb-2 lg:mb-0"
                  style={{ height: "36px" }}
                />
              </div>
            ))}
          </div>
        ) : tickets.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <Table
                className="w-full cursor-pointer"
                columns={columns}
                dataSource={tickets}
                rowKey="ticketId"
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: true }} // Enables table scrolling for small screens
                onRow={(record) => ({
                  onClick: () => handleRowClick(record.ticketId),
                })}
              />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No tickets found.</p>
        )}
      </div>
    </SupervisorLayout>
  );
};

export default SuppTickets;
