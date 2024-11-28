import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Skeleton, Tag, Input, Button, message, Card, List } from "antd";
import { Avatar } from "antd";
import ManagerLayout from "../Layouts/ManagerLayout";
import { UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerTicketDetails = () => {
  const { ticketId } = useParams(); // Get the ticketId from the URL params
  const [tickets, setTickets] = useState([]); // Treat ticket as an array
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(""); // To handle user input for ticket response

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${backendUrl}/user/getticketdetails`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { ticketId },
          }
        );
        setTickets(response.data.ticket || []); // Ensure it's an array
      } catch (error) {
        console.error("Error fetching ticket details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  const handleResponseSubmit = async () => {
    const name = localStorage.getItem("name");
    if (!response.trim()) {
      return message.warning("Response cannot be empty.");
    }

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      await axios.post(
        `${backendUrl}/user/commenttoticket`,
        { ticketId, response, name, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Response submitted successfully!");
      setResponse(""); // Clear the textarea
      window.location.reload(); // Reload to fetch new comments
    } catch (error) {
      console.error("Error submitting response:", error.message);
      message.error("Failed to submit the response. Please try again.");
    }
  };

  if (loading) return <Skeleton active />;

  if (!tickets.length)
    return <p className="text-center text-gray-500">No tickets found.</p>;

  return (
    <ManagerLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 bg-white rounded-lg shadow-md">
        {/* Left Column (Comments Section) */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Add Comment</h2>
            <TextArea
              rows={4}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response here..."
              className="mb-4"
            />
            <Button
              type="primary"
              onClick={handleResponseSubmit}
              className="w-32"
            >
              Submit
            </Button>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            {tickets[0]?.comments?.length > 0 ? (
              <List
                dataSource={tickets[0].comments.slice().reverse()} // Reverse the order
                renderItem={(comment) => (
                  <List.Item>
                    <div className="flex items-start w-full">
                      <Avatar icon={<UserOutlined />} className="mr-3 mt-1" />
                      <div className="flex-grow">
                        <p className="font-medium text-sm mb-1">
                          {comment.name}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {comment.comment}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 ml-auto mt-1">
                        {new Date(comment.date).toLocaleString()}
                      </p>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>

        {/* Right Column (Ticket Details) */}
        <div className="lg:col-span-1">
          {tickets.map((ticket) => (
            <Card
              key={ticket.ticketId}
              className="mb-4"
              title="Ticket Details"
              bordered
            >
              <p>
                <strong>Ticket ID:</strong>TCK{ticket.ticketId}
              </p>
              <p>
                <strong>Service:</strong> {ticket.service}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <Tag
                  color={
                    ticket.status === "Open"
                      ? "green"
                      : ticket.status === "Close"
                      ? "red"
                      : "orange"
                  }
                >
                  {ticket.status}
                </Tag>
              </p>
              <p>
                <strong>Priority:</strong>{" "}
                <Tag color="blue">{ticket.priority}</Tag>
              </p>
              <p>
                <strong>Description:</strong> {ticket.description}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(ticket.createdAt).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerTicketDetails;
