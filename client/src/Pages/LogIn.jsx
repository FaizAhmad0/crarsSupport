import { React, useEffect } from "react";
import { Button, Input, Form, message } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LogIn = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
    });
    AOS.refresh();
  }, []);
  const onFinish = async (values) => {
    console.log(values);
    try {
      // Send data to backend using axios
      const response = await axios.post(`${backendUrl}/login`, values, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("uid", response.data.uid);
        localStorage.setItem(
          "enrollmentIdAmazon",
          response.data.enrollmentIdAmazon
        );
        localStorage.setItem(
          "enrollmentIdWebsite",
          response.data.enrollmentIdWebsite
        );
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);
        if (response.data.role === "user") {
          navigate("/userdash");
        } else if (response.data.role === "admin") {
          navigate("/admindash");
        } else if (response.data.role === "manager") {
          navigate("/managerdash");
        } else if (response.data.role === "supervisor") {
          navigate("/supervisordash");
        }
      } else {
        message.error(response.data.message || "Login failed!");
      }
    } catch (error) {
      // Handle axios error
      console.error("Error:", error);
      if (error.response && error.response.data) {
        message.error(
          error.response.data.message ||
            "Something went wrong. Please try again."
        );
      } else {
        message.error("Something went wrong. Please try again.");
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        data-aos="fade-up"
        className="bg-white shadow-lg rounded-lg p-6 max-w-xs sm:max-w-sm w-full"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-14 mx-auto mb-1" />
          <h2
            className="text-3xl font-bold mb-1"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </h2>{" "}
          <p className="text-black-600 text-sm">Please log in to continue.</p>
        </div>

        {/* Form */}
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="space-y-4"
        >
          {/* UID Field */}
          <Form.Item
            name="uid"
            rules={[{ required: true, message: "Please enter your UID!" }]}
          >
            <Input placeholder="UID" size="large" className="rounded-lg" />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              size="large"
              className="rounded-lg"
            />
          </Form.Item>

          {/* Login Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 font-bold rounded-lg shadow-lg hover:shadow-xl"
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-black-600">
            Forgot your password?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Reset here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
