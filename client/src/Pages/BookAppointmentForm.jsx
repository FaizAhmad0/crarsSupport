import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import dayjs from "dayjs";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const { Option } = Select;

const TOTAL_SLOTS = 30;

const BookAppointmentForm = () => {
  const [appointments, setAppointments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const today = dayjs().format("YYYY-MM-DD");

  // fetch all appointments
  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${backendUrl}/admin/getallappointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1200, once: false });
    AOS.refresh();

    form.setFieldsValue({
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
      uid: localStorage.getItem("uid") || "",
      number: localStorage.getItem("phone") || "",
    });

    const fetchManagers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${backendUrl}/user/getallmanager`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setManagers(response.data.managers || []);
        } else {
          message.error("Failed to fetch managers.");
        }
      } catch (error) {
        console.error("Error fetching managers:", error.message);
        message.error("Unable to fetch managers. Please try again later.");
      }
    };

    fetchManagers();
    fetchAppointments();
  }, [form]);

  // autofill enrollment ID based on platform
  const handlePlatformChange = (value) => {
    if (value === "amazon") {
      form.setFieldValue(
        "enrollment",
        localStorage.getItem("enrollmentIdAmazon")
      );
    } else if (value === "website") {
      form.setFieldValue(
        "enrollment",
        localStorage.getItem("enrollmentIdWebsite")
      );
    } else {
      form.setFieldValue("enrollment", "");
    }
  };

  const handleManagerChange = (manager) => {
    setSelectedManager(manager);
    form.setFieldValue("slot", null);
  };

  // submit appointment
  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      uid: localStorage.getItem("uid"),
      date: today, // force today's date
    };

    try {
      const response = await axios.post(
        `${backendUrl}/user/bookappointment`,
        formattedValues
      );

      if (response.status === 201 || response.status === 200) {
        message.success(
          response?.data?.message ||
            "Your appointment has been successfully booked. Our manager will contact you within 24 to 48 hours."
        );
        form.resetFields();
        navigate("/appointments");
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(
        "Error booking appointment:",
        error.response?.data?.message || error.message
      );
      message.error(error.response?.data?.message || "Slot is already booked");
    }
  };

  // get already taken slots for today (check createdAt)
  const getDisabledSlots = () => {
    if (!selectedManager) return [];
    return appointments
      .filter(
        (appointment) =>
          dayjs(appointment.createdAt).format("YYYY-MM-DD") === today &&
          appointment.manager === selectedManager
      )
      .map((appointment) => appointment.slot);
  };

  const disabledSlots = getDisabledSlots();

  return (
    <div
      data-aos="fade-up"
      className="w-full mt-4 max-w-lg mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md"
    >
      <div
        className="flex items-center mb-4 cursor-pointer"
        onClick={() => navigate("/userdash")}
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
        Book an Appointment
      </h3>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Name is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="platform"
          label="Platform"
          rules={[{ required: true, message: "Please select a platform!" }]}
        >
          <Select
            placeholder="Choose a platform"
            onChange={handlePlatformChange}
          >
            <Option value="amazon">Amazon</Option>
            <Option value="website">Website</Option>
            <Option value="dispatch">Dispatch</Option>
            <Option value="accounts">Accounts</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="enrollment"
          label="Enrollment ID"
          rules={[{ required: true, message: "Enrollment ID is required!" }]}
        >
          <Input placeholder="Auto-filled or enter manually" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Phone Number"
          rules={[{ required: true, message: "Phone number is required!" }]}
        >
          <Input placeholder="Phone number is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Email is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="uid"
          label="UID"
          rules={[{ required: true, message: "UID is required!" }]}
        >
          <Input placeholder="UID is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="manager"
          label="Manager"
          rules={[{ required: true, message: "Please select a manager!" }]}
        >
          <Select
            placeholder="Choose your manager"
            onChange={handleManagerChange}
          >
            {managers.length > 0 ? (
              managers.map((manager) => (
                <Option key={manager._id} value={manager.name}>
                  {manager.name}
                </Option>
              ))
            ) : (
              <Option disabled>Loading managers...</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="slot"
          label="Slot"
          rules={[{ required: true, message: "Please select a slot!" }]}
        >
          <Select placeholder="Choose a slot" disabled={!selectedManager}>
            {Array.from({ length: TOTAL_SLOTS }, (_, i) => {
              const slotName = `Slot-${i + 1}`;
              return (
                <Option
                  key={slotName}
                  value={slotName}
                  disabled={disabledSlots.includes(slotName)}
                >
                  {slotName}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please enter a subject!" }]}
        >
          <Input placeholder="Enter the subject" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea
            placeholder="Describe the issue or purpose of the appointment"
            rows={4}
            className="resize-none"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-600 hover:to-blue-300 font-bold text-white rounded-lg"
          >
            Book Appointment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default BookAppointmentForm;
