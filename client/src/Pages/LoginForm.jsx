import React, { useEffect, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "aos/dist/aos.css";
import AOS from "aos";
import "./LoginForm.css";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpToken, setOtpToken] = useState({});
  const [uid, setUid] = useState(""); // updated name

  useEffect(() => {
    AOS.init();
  }, []);

  const onFinish = (values) => {
    axios
      .post(`${backendUrl}/login`, values)
      .then((response) => {
        if (response.data.requiresOtp) {
          messageApi.info(response.data.message);
          setRequiresOtp(true);
          setOtpToken(response.data);
          setUid(values.uid); // save uid
        } else {
          handleLoginSuccess(response.data);
        }
      })
      .catch((error) => {
        messageApi.error(error.response?.data?.message || "Login failed");
        console.error("Login error:", error);
      });
  };

  const onOtpSubmit = (otpValues) => {
    const { otp } = otpValues;

    axios
      .post(`${backendUrl}/login/verifyOtp`, { uid, otp }) // use uid here
      .then(() => {
        handleLoginSuccess(otpToken); // Use stored token from initial response
      })
      .catch((error) => {
        messageApi.error(
          error.response?.data?.message || "OTP verification failed"
        );
        console.error("OTP verification error:", error);
      });
  };

  const handleLoginSuccess = (data) => {
    messageApi.success(data.message);

    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);
    localStorage.setItem("id", data.id);
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("uid", data.uid);
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
          initialValues={{ remember: true }}
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
                <Input
                  prefix={<UserOutlined />}
                  placeholder="UID (e.g., UID123)"
                />
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
