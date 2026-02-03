import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, message, Skeleton } from "antd";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const QuerySummaryCards = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [querySummary, setQuerySummary] = useState({
    total: 0,
    solved: 0,
    feedback: 0,
    pending: 0,
  });

  const fetchQuerySummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const name = localStorage.getItem("name");

      const res = await axios.get(`${backendUrl}/manager/query-summary`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { name, role },
      });

      setQuerySummary(
        res.data?.data || { total: 0, solved: 0, feedback: 0, pending: 0 },
      );
    } catch (err) {
      console.error("QuerySummaryCards error:", err);
      message.error("Failed to load query summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuerySummary();
  }, []);

  const role = localStorage.getItem("role");

  const queryDashRoute = role === "manager" ? "/query-dash" : "/sp-query-dash";


  if (loading) {
    return (
      <Row gutter={[16, 16]} className="mt-6" wrap>
        <Col xs={24} sm={12} lg={12}>
          <Skeleton.Button active block style={{ height: 120 }} />
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Skeleton.Button active block style={{ height: 120 }} />
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Skeleton.Button active block style={{ height: 120 }} />
        </Col>
        <Col xs={24} sm={12} lg={12}>
          <Skeleton.Button active block style={{ height: 120 }} />
        </Col>
      </Row>
    );
  }

  return (
    <>
      <hr />
      <h1 className="inline-block text-3xl font-extrabold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
        Queries Dashboard
      </h1>

      <Row gutter={[16, 16]} className="mt-6" wrap>
        {/* Total Queries */}
        <Col xs={24} sm={12} lg={12}>
          <Card
            onClick={() => navigate(`${queryDashRoute}`)}
            className="bg-gradient-to-r from-purple-800 to-purple-400 text-white shadow-lg rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
            bordered={false}
          >
            <div className="flex items-center space-x-4">
              <ConfirmationNumberOutlinedIcon
                style={{ fontSize: "40px", color: "white" }}
              />
              <div>
                <Text className="text-lg font-bold block text-white">
                  Total Queries: {querySummary.total}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Pending Queries */}
        <Col xs={24} sm={12} lg={12}>
          <Card
            onClick={() => navigate(`${queryDashRoute}`)}
            className="bg-gradient-to-r from-yellow-800 to-yellow-400 text-white shadow-lg rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
            bordered={false}
          >
            <div className="flex items-center space-x-4">
              <AssignmentLateOutlinedIcon
                style={{ fontSize: "40px", color: "white" }}
              />
              <div>
                <Text className="text-lg font-bold block text-white">
                  Pending Queries: {querySummary.pending}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Solved Queries */}
        <Col xs={24} sm={12} lg={12}>
          <Card
            onClick={() => navigate(`${queryDashRoute}`)}
            className="bg-gradient-to-r from-green-800 to-green-400 text-white shadow-lg rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
            bordered={false}
          >
            <div className="flex items-center space-x-4">
              <CalendarTodayOutlinedIcon
                style={{ fontSize: "40px", color: "white" }}
              />
              <div>
                <Text className="text-lg font-bold block text-white">
                  Solved Queries: {querySummary.solved}
                </Text>
              </div>
            </div>
          </Card>
        </Col>

        {/* Feedback Queries */}
        <Col xs={24} sm={12} lg={12}>
          <Card
            onClick={() => navigate(`${queryDashRoute}`)}
            className="bg-gradient-to-r from-blue-800 to-blue-400 text-white shadow-lg rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110"
            bordered={false}
          >
            <div className="flex items-center space-x-4">
              <ErrorOutlineOutlinedIcon
                style={{ fontSize: "40px", color: "white" }}
              />
              <div>
                <Text className="text-lg font-bold block text-white">
                  Feedback Queries: {querySummary.feedback}
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default QuerySummaryCards;
