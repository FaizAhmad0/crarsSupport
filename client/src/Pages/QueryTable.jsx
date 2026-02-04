import React, { useEffect, useState } from "react";
import {
  Table,
  DatePicker,
  message,
  Button,
  Modal,
  Form,
  Select,
  Input,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const QueryTable = ({ status, reloadTrigger }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // solved modal
  const [openSolved, setOpenSolved] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [solvedForm] = Form.useForm();
  const [feedbackForm] = Form.useForm();

  const role = localStorage.getItem("role")?.toLowerCase();
  const name = localStorage.getItem("name")?.trim();

  const fetchQueries = async (page = 1, pageSize = 10, dateRange = dates) => {
    setLoading(true);

    const params = { status, page, limit: pageSize, role };

    if (!["admin", "supervisor"].includes(role)) {
      params.name = name;
    }

    if (dateRange?.length === 2) {
      params.startDate = dayjs(dateRange[0]).startOf("day").toISOString();
      params.endDate = dayjs(dateRange[1]).endOf("day").toISOString();
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/manager/get-queries`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setData(res.data.data);
      setPagination({ current: page, pageSize, total: res.data.total });
    } catch {
      message.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [status, reloadTrigger]);

  // MARK SOLVED
  const submitSolved = async () => {
    try {
      const values = await solvedForm.validateFields();
      const token = localStorage.getItem("token");

      await axios.put(
        `${backendUrl}/manager/mark-solved`,
        {
          record_id: selectedRecord._id,
          solvedVia: values.solvedVia,
          solvedBy: values.solvedBy,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      message.success("Marked as solved");
      setOpenSolved(false);
      solvedForm.resetFields();
      fetchQueries(pagination.current, pagination.pageSize);
    } catch {
      message.error("Failed to mark solved");
    }
  };

  // ADD FEEDBACK
  const submitFeedback = async () => {
    try {
      const values = await feedbackForm.validateFields();
      const token = localStorage.getItem("token");

      await axios.put(
        `${backendUrl}/manager/add-feedback`,
        {
          record_id: selectedRecord._id,
          feedback: values.feedback,
          csManager: values.csManager,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      message.success("Feedback added");
      setOpenFeedback(false);
      feedbackForm.resetFields();
      fetchQueries(pagination.current, pagination.pageSize);
    } catch {
      message.error("Failed to add feedback");
    }
  };

  const columns = [
    {
      title: "Problem Initiate",
      dataIndex: "createdAt",
      render: (d) => dayjs(d).format("DD/MM/YYYY"),
    },
    { title: "Enrollment", dataIndex: "enrollment", fixed: "left" },
    { title: "Concern", dataIndex: "concern" },
    { title: "Department", dataIndex: "department" },
    { title: "Source", dataIndex: "source" },
    {
      title: "Status",
      dataIndex: "status",
      render: (statusValue) =>
        status === "Feedback" ? "Completed" : statusValue,
    },
    { title: "RaisedBy", dataIndex: "raisedBy" },
    { title: "RaisedTo", dataIndex: "raisedTo" },
    ...(status == "Solved"
      ? [
          {
            title: "Solved Via",
            dataIndex: "solvedVia",
          },
        ]
      : []),
    {
      title: "Deadline",
      dataIndex: "deadline",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },

    ...(status !== "Feedback"
      ? [
          {
            title: "Action",
            render: (_, record) => {
              const canShow =
                (role === "manager" && record.raisedTo?.trim() === name) ||
                role === "admin" ||
                role === "supervisor";

              if (!canShow) return null;

              if (status === "Solved") {
                return (
                  <Button
                    onClick={() => {
                      setSelectedRecord(record);
                      setOpenFeedback(true);
                    }}
                  >
                    Add Feedback
                  </Button>
                );
              }

              return (
                <Button
                  type="primary"
                  onClick={() => {
                    setSelectedRecord(record);
                    setOpenSolved(true);
                  }}
                >
                  Mark Solved
                </Button>
              );
            },
          },
        ]
      : []),

    ...(status == "Feedback"
      ? [
          {
            title: "Feedback",
            dataIndex: "feedback",
          },
        ]
      : []),
  ];

  return (
    <>
      <RangePicker
        style={{ marginBottom: 16 }}
        onChange={(v) => {
          setDates(v);
          fetchQueries(1, pagination.pageSize, v);
        }}
      />

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: "max-content" }}
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (p, s) => fetchQueries(p, s),
        }}
      />

      {/* SOLVED MODAL */}
      <Modal
        title="Mark as Solved"
        open={openSolved}
        onCancel={() => setOpenSolved(false)}
        onOk={submitSolved}
      >
        <Form layout="vertical" form={solvedForm}>
          <Form.Item
            name="solvedVia"
            label="Solved Via"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="DoubleTick">DoubleTick</Option>
              <Option value="Superfone">Superfone</Option>
              <Option value="Whatsapp">Whatsapp</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="solvedBy"
            label="Solved By"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* FEEDBACK MODAL */}
      <Modal
        title="Add Feedback"
        open={openFeedback}
        onCancel={() => setOpenFeedback(false)}
        onOk={submitFeedback}
      >
        <Form layout="vertical" form={feedbackForm}>
          <Form.Item
            name="feedback"
            label="Feedback"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="csManager"
            label="CS Manager"
            rules={[{ required: true }]}
          >
            <Input placeholder="CS1 / CS2" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default QueryTable;
