import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton, Table, Tag, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layouts/AdminLayout";

const { Search } = Input;
const { Option } = Select;

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // State for date filter
  const navigate = useNavigate();

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

  const handleDateFilterChange = (value) => {
    setDateFilter(value);
  };

  const filterByDate = (ticket) => {
    if (dateFilter === "all") return true;

    const now = new Date();
    const ticketDate = new Date(ticket.createdAt);

    switch (dateFilter) {
      case "today":
        return ticketDate.toDateString() === new Date().toDateString();
      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        return ticketDate.toDateString() === yesterday.toDateString();
      case "thisWeek":
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        return ticketDate >= startOfWeek;
      case "thisMonth":
        return (
          ticketDate.getMonth() === now.getMonth() &&
          ticketDate.getFullYear() === now.getFullYear()
        );
      case "thisYear":
        return ticketDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

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
        {
          text: "Waiting for customer reply",
          value: "Waiting for customer reply",
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color =
          status === "Open" ? "green" : status === "Closed" ? "red" : "orange";
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
    navigate(`/admin/${ticketId}`);
  };

  const filteredTickets = tickets
    .filter(
      (ticket) =>
        ticket.enrollmentId?.toLowerCase().includes(searchText.toLowerCase()) ||
        ticket.ticketId
          ?.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase())
    )
    .filter(filterByDate);

  return (
    <AdminLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-full mb-8 pb-3 px-4 bg-gradient-to-r from-blue-800 to-blue-300 shadow-lg rounded-lg">
          <h1 className="text-2xl pt-4 font-bold text-white">All Tickets</h1>
          <div className="flex items-center mt-4 space-x-4">
            <Search
              placeholder="Search by Enrollment ID or Ticket ID"
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
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
        ) : filteredTickets.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <Table
                className="w-full cursor-pointer"
                columns={columns}
                dataSource={filteredTickets}
                rowKey="ticketId"
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: true }}
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
    </AdminLayout>
  );
};

export default AllTickets;
