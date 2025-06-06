import React, { useEffect, useState } from "react";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  Skeleton,
  Table,
  Tag,
  Modal,
  Tooltip,
  Rate,
  Input,
  Button,
  message,
} from "antd";
import UserLayout from "../Layouts/UserLayout";
import { CheckCircle } from "@mui/icons-material";

const { TextArea } = Input;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UserComplaints = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewData, setReviewData] = useState({
    appointmentId: null,
    rating: 0,
    message: "",
  });

  const fetchAppointments = async () => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (!uid || !token) {
      console.error("Missing user ID or token in localStorage.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/user/getallcomplaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { uid },
      });

      // Sort appointments in descending order by date
      const sortedAppointments = response.data.complaints.sort(
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

  const handleOpenReviewModal = (caseId) => {
    console.log(caseId);
    setReviewData({ caseId, rating: 0, message: "" });
    setIsModalVisible(true);
  };

  const handleSubmitReview = async () => {
    const { caseId, rating, message: reviewMessage } = reviewData;
    console.log(caseId);

    if (!rating || !reviewMessage.trim()) {
      message.error("Please provide a rating and message.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Missing authentication token.");
      }

      await axios.post(
        `${backendUrl}/user/submitcompreview`,
        { caseId, rating, message: reviewMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      message.success("Review submitted successfully!");
      setIsModalVisible(false);
      fetchAppointments();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to submit review."
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Completed", value: "Completed" },
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
          <Button
            type="primary"
            onClick={() => handleOpenReviewModal(record.caseId)}
            className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold shadow-lg hover:shadow-xl"
          >
            Add Review
          </Button>
        );
      },
    },
  ];

  return (
    <UserLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="w-full mb-8 pb-3 px-4 bg-gradient-to-r from-blue-800 to-blue-300 shadow-lg rounded-lg">
          <h1 className="text-2xl pt-4 font-bold text-white">All Complaints</h1>
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
        ) : appointments.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md">
            <Table
              className="w-full cursor-pointer"
              columns={columns}
              dataSource={appointments}
              rowKey="appointmentId"
              pagination={{ pageSize: 10 }}
              bordered
              scroll={{ x: true }} // Enables table scrolling for small screens
            />
          </div>
        ) : (
          <p className="text-center text-gray-500">No complaint found.</p>
        )}

        {/* Review Modal */}
        <Modal
          title="Submit Review"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmitReview}
              disabled={!reviewData.rating || !reviewData.message.trim()}
            >
              Submit
            </Button>,
          ]}
        >
          <div className="space-y-4">
            <div>
              <label className="block font-semibold">Rating</label>
              <Rate
                value={reviewData.rating}
                onChange={(value) =>
                  setReviewData((prev) => ({ ...prev, rating: value }))
                }
              />
            </div>
            <div>
              <label className="block font-semibold">Message</label>
              <TextArea
                rows={4}
                value={reviewData.message}
                onChange={(e) =>
                  setReviewData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </Modal>
      </div>
    </UserLayout>
  );
};

export default UserComplaints;
