import React, { useState, useEffect } from "react";
import { Layout, Typography, Card, message, Divider, Tag, Space } from "antd";
import {
  UserOutlined,
  MailOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Skeleton, Row, Col } from "antd";
import { AmazonOutlined, GlobalOutlined } from "@ant-design/icons";

import UserLayout from "../Layouts/UserLayout";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const { Title, Text } = Typography;
const { Content } = Layout;

const UserDash = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const uid = localStorage.getItem("uid");

    if (!uid) {
      setError("User ID not found in localStorage.");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/user/${uid}`);
        if (response.data && response.data.user && response.data.user.length) {
          setUser(response.data.user[0]);
        } else {
          setError("Unexpected data format received.");
        }
      } catch (err) {
        setError("Error fetching user details. Please try again.");
        message.error("Error loading user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    AOS.init({
      duration: 1200,
      once: false,
    });
    AOS.refresh();
  }, []);

  const calculateDaysRemaining = (registrationDate) => {
    const registration = new Date(registrationDate);
    const endDate = new Date(registration);
    endDate.setDate(endDate.getDate() + 45);
    const today = new Date();
    const remainingTime = endDate - today;
    const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    return daysRemaining > 0 ? daysRemaining : 0;
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="p-4 space-y-6">
          {/* Skeleton for User Details */}
          <div className="flex items-center space-x-4">
            <Skeleton.Avatar active size="large" />
            <Skeleton.Input active style={{ width: 200 }} />
          </div>
          <Skeleton paragraph={{ rows: 4 }} active />

          {/* Skeleton for Cards */}
          <Row gutter={[16, 16]} className="mt-6">
            <Col xs={24} sm={12} lg={12}>
              <Skeleton.Button active block style={{ height: 150 }} />
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Skeleton.Button active block style={{ height: 150 }} />
            </Col>
          </Row>
        </div>
      </UserLayout>
    );
  }

  if (error) {
    return (
      <UserLayout>
        <Content className="text-center mt-10">
          <Text type="danger">{error}</Text>
        </Content>
      </UserLayout>
    );
  }

  if (!user) {
    return (
      <UserLayout>
        <Content className="text-center mt-10">
          <Text>No user details available.</Text>
        </Content>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Content className="max-w-screen-lg mx-auto">
        <Card
          className="shadow-lg rounded-lg"
          title={
            <div className="flex items-center space-x-4">
              <UserOutlined className="text-blue-500 text-2xl" />
              <h3
                className="text-3xl font-extrabold  text-center"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Welcome, {localStorage.getItem("name")}
              </h3>
            </div>
          }
          bordered={false}
        >
          <div
            data-aos="fade-up"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Personal Information */}
            <Card
              hoverable
              className="border-0 bg-white shadow-md transition-transform transform hover:-translate-y-2"
            >
              <Title
                level={4}
                className="text-gray-700 mb-2 flex items-center space-x-2"
              >
                <UserOutlined />
                <span>{user.name}</span>
              </Title>
              <Text type="secondary" className="flex items-center space-x-2">
                <MailOutlined />
                <span>Email: {user.email}</span>
              </Text>
              <Divider />
              <Text strong>UID:</Text>
              <Text>{user.uid}</Text>
            </Card>

            {/* Amazon Information */}
            <Card
              hoverable
              className="border-0 shadow-md transition-transform transform hover:-translate-y-2"
            >
              <div
                data-aos="fade-up"
                className="p-4 rounded-lg bg-gradient-to-r from-blue-800 to-blue-300"
              >
                <Title
                  level={4}
                  className="text-white flex items-center space-x-2 mb-0"
                >
                  <AmazonOutlined className="text-xl text-white" />
                  <span className="text-white">Amazon Details</span>
                </Title>
              </div>
              <div data-aos="fade-up" className="p-4">
                <Space direction="vertical" size="small">
                  <Text strong>Enrollment ID:</Text>
                  <Text>{user.enrollmentIdAmazon}</Text>
                  <Divider className="my-1" />{" "}
                  {/* Reduced margin around the Divider */}
                  <Text strong>Registration Date:</Text>
                  <Text>{new Date(user.dateAmazon).toLocaleDateString()}</Text>
                  <Tag color="blue" className="mt-2">
                    <ClockCircleOutlined />{" "}
                    {calculateDaysRemaining(user.dateAmazon)} days remaining
                  </Tag>
                </Space>
              </div>
            </Card>

            {/* Website Information */}
            <Card
              hoverable
              className="border-0 shadow-md transition-transform transform hover:-translate-y-2"
            >
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-800 to-green-400">
                <Title
                  level={4}
                  className="text-white flex items-center space-x-2 mb-0"
                >
                  <GlobalOutlined className="text-xl text-white" />
                  <span className="text-white">Website Details</span>
                </Title>
              </div>
              <div className="p-4">
                <Space direction="vertical" size="small">
                  <Text strong>Enrollment ID:</Text>
                  <Text>{user.enrollmentIdWebsite}</Text>
                  <Divider className="my-1" />{" "}
                  <Text strong>Registration Date:</Text>
                  <Text>{new Date(user.dateWebsite).toLocaleDateString()}</Text>
                  <Tag color="green" className="mt-2">
                    <ClockCircleOutlined />{" "}
                    {calculateDaysRemaining(user.dateWebsite)} days remaining
                  </Tag>
                </Space>
              </div>
            </Card>

            {/* Account Details */}
            <Card
              hoverable
              className="border-0 bg-white shadow-md transition-transform transform hover:-translate-y-2"
            >
              <Space direction="vertical" size="small">
                <Text strong>Account Created:</Text>
                <Text>{new Date(user.createdAt).toLocaleDateString()}</Text>
                <Text strong>Last Updated:</Text>
                <Text>{new Date(user.updatedAt).toLocaleDateString()}</Text>
              </Space>
            </Card>

            {/* Managers */}
            <Card
              hoverable
              className="border-0 bg-white shadow-md transition-transform transform hover:-translate-y-2"
            >
              <Title level={4} className="text-gray-700">
                Managers
              </Title>
              <Text>
                {user.managers.length > 0
                  ? user.managers.map((manager) => (
                      <Tag color="blue" key={manager}>
                        <TeamOutlined /> {manager}
                      </Tag>
                    ))
                  : "No managers assigned"}
              </Text>
            </Card>
            <Card
              onClick={() => {
                navigate("/complaints");
              }}
              hoverable
              className="border-0 bg-white shadow-md transition-transform transform hover:-translate-y-2"
            >
              <Title level={4} className="text-gray-700">
                Complaints
              </Title>
              <Text className="font-semibold text-blue-600">
                Total Complaint : {appointments.length}
              </Text>
            </Card>
          </div>
        </Card>
      </Content>
    </UserLayout>
  );
};

export default UserDash;
