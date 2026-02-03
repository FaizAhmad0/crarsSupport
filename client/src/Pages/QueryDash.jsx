import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import ManagerLayout from "../Layouts/ManagerLayout";
import RecordQueries from "./RecordQueries";
import SolvedQueries from "./SolvedQueries";
import FeedbackQueries from "./FeedbackQueries";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const { TextArea } = Input;

const QueryDash = () => {
  const [activeTab, setActiveTab] = useState("record");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);
  const [form] = Form.useForm();

  // 🔹 Fetch Managers
  const fetchManagers = async () => {
    const token = localStorage.getItem("token");
    setLoadingManagers(true);

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
    } finally {
      setLoadingManagers(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const handleSubmit = async (values) => {
    const token = localStorage.getItem("token");

    const payload = {
      ...values,
      status: "New",
      raisedBy: localStorage.getItem("name"),
    };

    try {
      const response = await axios.post(
        `${backendUrl}/manager/add-query`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 201 || response.status === 200) {
        message.success("Query created successfully");
        setIsModalOpen(false);
        form.resetFields();
        setActiveTab("record");
      } else {
        message.error("Failed to create query. Please try again.");
      }
    } catch (error) {
      console.error("Create Query Error:", error);
      message.error(
        error?.response?.data?.message ||
          "Unable to create query. Please try again later.",
      );
    }
  };

  return (
    <ManagerLayout>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontWeight: 700,
            fontSize: '28px',
            background: "linear-gradient(90deg, red, blue)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Support Queries
        </h1>

        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          New Query
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          {
            key: "record",
            label: "Record",
            children: <RecordQueries status="New" reloadTrigger={activeTab} />,
          },
          {
            key: "solved",
            label: "Solved",
            children: (
              <SolvedQueries status="Solved" reloadTrigger={activeTab} />
            ),
          },
          {
            key: "feedback",
            label: "Feedback",
            children: (
              <FeedbackQueries status="Feedback" reloadTrigger={activeTab} />
            ),
          },
        ]}
      />

      {/* New Query Modal */}
      <Modal
        title="Create New Query"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText="Create Query"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Enrollment"
            name="enrollment"
            rules={[{ required: true, message: "Enter enrollment of user" }]}
          >
            <Input placeholder="Enter enrollment of user" />
          </Form.Item>

          <Form.Item
            label="Concern With"
            name="concern"
            rules={[{ required: true, message: "Enter short description" }]}
          >
            <TextArea rows={2} placeholder="Short description" />
          </Form.Item>

          <Form.Item
            label="Concern Raised To"
            name="raisedTo"
            rules={[{ required: true, message: "Select manager" }]}
          >
            <Select
              placeholder="Select manager"
              loading={loadingManagers}
              showSearch
              optionFilterProp="label"
            >
              {managers.map((manager) => (
                <Select.Option
                  key={manager._id}
                  value={manager.name}
                  label={manager.name}
                >
                  {manager.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Select department" }]}
          >
            <Select placeholder="Select department">
              <Select.Option value="Amazon">Amazon</Select.Option>
              <Select.Option value="Website">Website</Select.Option>
              <Select.Option value="Dispatch">Dispatch</Select.Option>
              <Select.Option value="Account">Account</Select.Option>
              <Select.Option value="Telesales">Telesales</Select.Option>
              <Select.Option value="Customer-support">
                Customer-support
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Source"
            name="source"
            rules={[
              {
                required: true,
                message: "Select source from where query found",
              },
            ]}
          >
            <Select placeholder="Please select where the query originated from.">
              <Select.Option value="DoubleTick">DoubleTick</Select.Option>
              <Select.Option value="Feedback">Feedback</Select.Option>
              <Select.Option value="Superfone">Superfone</Select.Option>
              <Select.Option value="AI Sensey">AI Sensey</Select.Option>
              <Select.Option value="Whatsapp">Whatsapp</Select.Option>
              <Select.Option value="Support-portal">
                Support Portal
              </Select.Option>
              <Select.Option value="Social-media">Social Media</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Deadline"
            name="deadline"
            rules={[{ required: true, message: "Select deadline" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(current) =>
                current && current < new Date().setHours(0, 0, 0, 0)
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </ManagerLayout>
  );
};

export default QueryDash;
