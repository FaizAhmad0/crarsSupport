import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";
import "./LoginForm.css";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [uid, setUid] = useState("");

  useEffect(() => {
    AOS.init();
  }, []);

  const onFinish = async (values) => {
    try {
      const res = await axios.post(`${backendUrl}/login`, values);
      if (res.data.requiresOtp) {
        setRequiresOtp(true);
        setUid(values.uid);
        messageApi.info("OTP sent to your registered email.");
      } else {
        handleLoginSuccess(res.data);
      }
    } catch (error) {
      messageApi.error(error.response?.data?.error || "Login failed");
    }
  };

  const onOtpSubmit = async (values) => {
    try {
      const res = await axios.post(`${backendUrl}/login/verify-otp`, {
        uid,
        otp: values.otp,
      });
      handleLoginSuccess(res.data);
    } catch (error) {
      messageApi.error(
        error.response?.data?.error || "OTP verification failed"
      );
    }
  };

  const handleLoginSuccess = (data) => {
    messageApi.success(data.message);

    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("id", data.id);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("uid", data.uid);
    localStorage.setItem("phone", data.phone);
    localStorage.setItem("enrollmentIdAmazon", data.enrollmentIdAmazon);
    localStorage.setItem("enrollmentIdWebsite", data.enrollmentIdWebsite);
    localStorage.removeItem("theme");

    if (data.role === "user") {
      navigate("/userdash");
    } else if (data.role === "admin") {
      navigate("/admindash");
    } else if (data.role === "manager") {
      navigate("/managerdash");
    } else if (data.role === "supervisor") {
      navigate("/supervisordash");
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          'url("https://img.freepik.com/free-vector/paper-style-white-monochrome-background_52683-66443.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-container" data-aos="fade-up">
        {contextHolder}
        <Form
          form={form}
          name="login_form"
          className="login-form"
          onFinish={requiresOtp ? onOtpSubmit : onFinish}
        >
          <div className="login-logo">
            <img
              src="https://support.saumiccraft.com/wp-content/uploads/2023/05/logo-saumic-new.png"
              alt="Logo"
            />
          </div>
          {!requiresOtp ? (
            <>
              <Form.Item
                name="uid"
                rules={[{ required: true, message: "Please input your UID!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="UID" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Password"
                />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Please input the OTP!" }]}
            >
              <Input prefix={<LockOutlined />} placeholder="Enter OTP" />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              style={{ backgroundColor: "rgb(71,178,228)" }}
              htmlType="submit"
              className="login-form-button"
            >
              {requiresOtp ? "Verify OTP" : "Log in"}
            </Button>
          </Form.Item>
        </Form>
        <div className="login-footer">
          <p>
            By logging in you agree to our <a href="/">privacy policy</a> &{" "}
            <a href="/">terms of service</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
