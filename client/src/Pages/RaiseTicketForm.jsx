import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material"; // Material Icon
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const { Option } = Select;

const RaiseTicketForm = () => {
  const role = localStorage.getItem("role");
  const [form] = Form.useForm();
  const navigate = useNavigate(); // React Router's useNavigate for navigation
  const [managers, setManagers] = useState([]); // Initialize as an empty array

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
    });
    AOS.refresh();
  }, []);

  // Fetch all managers from the backend
  useEffect(() => {
    const fetchManagers = async () => {
      const role = localStorage.getItem("role");
      const token = localStorage.getItem("token"); // Authorization token
      try {
        const response = await axios.get(`${backendUrl}/user/getallmanager`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setManagers(response.data.managers || []); // Safely update state
        } else {
          message.error("Failed to fetch managers.");
        }
      } catch (error) {
        console.error(
          "Error fetching managers:",
          error.response?.data?.message || error.message
        );
        message.error("Unable to fetch managers. Please try again later.");
      }
    };

    fetchManagers();
  }, []);

  const handleBackClick = () => {
    if (role === "user") {
      navigate("/userdash");
    } else {
      navigate("/managerdash");
    }
  };

  // Handle Service Selection
  const handleServiceChange = (value) => {
    if (value === "amazon") {
      form.setFieldValue(
        "enrollmentId",
        localStorage.getItem("enrollmentIdAmazon")
      );
    } else if (value === "website") {
      form.setFieldValue(
        "enrollmentId",
        localStorage.getItem("enrollmentIdWebsite")
      );
    } else {
      form.setFieldValue("enrollmentId", ""); // Clear enrollmentId for dispatch or accounts
    }
  };

  // Handle Form Submission
  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      uid: localStorage.getItem("uid"),
      name: localStorage.getItem("name"),
      status: "Open",
      priority: "Normal",
      assignee: values.manager,
    };

    try {
      // Make POST request to the backend
      const response = await axios.post(
        `${backendUrl}/user/newticket`,
        formattedValues
      );

      if (response.status === 201 || response.status === 200) {
        message.success("Ticket created successfully!");
        form.resetFields();
        // navigate("/user-tickets");
        if (role === "manager") {
          navigate("/manager-raisedtickets");
        } else {
          navigate("/user-tickets");
        }
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      message.error("Failed to create the ticket. Please try again later.");
    }
  };

  return (
    <div
      data-aos="fade-up"
      className="w-full mt-4 max-w-lg mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md"
    >
      {/* Back Button */}
      <div
        className="flex items-center mb-4 cursor-pointer"
        onClick={handleBackClick}
      >
        <ArrowBack fontSize="medium" className="text-blue-600 mr-2" />
        <span className="text-blue-600 font-medium">Back</span>
      </div>

      <h3
        className="text-3xl font-extrabold mb-6 text-center"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Raise a New Ticket
      </h3>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Service Field */}
        <Form.Item
          name="service"
          label="Service"
          rules={[{ required: true, message: "Please select a service!" }]}
        >
          <Select
            placeholder="Choose your service"
            onChange={handleServiceChange}
            className="w-full"
          >
            <Option value="amazon">Amazon</Option>
            <Option value="website">Website</Option>
            <Option value="dispatch">Dispatch</Option>
            <Option value="accounts">Accounts</Option>
          </Select>
        </Form.Item>

        {/* Enrollment Field */}
        <Form.Item
          name="enrollmentId"
          label="Enrollment ID"
          rules={[{ required: true, message: "Enrollment ID is required!" }]}
        >
          <Input
            placeholder="Enrollment ID will auto-fill for Amazon or Website"
            className="w-full"
          />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea
            placeholder="Enter the issue description"
            rows={4}
            className="w-full resize-none"
          />
        </Form.Item>

        {/* Manager Field */}
        <Form.Item
          name="manager"
          label="Managers"
          rules={[{ required: true, message: "Please select a manager!" }]}
        >
          <Select placeholder="Choose your manager" className="w-full">
            {managers.length > 0 ? (
              managers.map((manager) => (
                <Option key={manager.id} value={manager.name}>
                  {manager.name}
                </Option>
              ))
            ) : (
              <Option disabled>Loading managers...</Option>
            )}
          </Select>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-600 hover:to-blue-300 font-bold text-white rounded-lg"
          >
            Submit Ticket
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RaiseTicketForm;
