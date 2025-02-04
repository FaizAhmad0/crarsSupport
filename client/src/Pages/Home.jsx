import { React, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { Button } from "antd";
import Footer from "../Components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleAppointmentClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/book-appointment");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,
    });
    AOS.refresh();
    if (role === "user") {
      navigate("/userdash");
    } else if (role === "manager") {
      navigate("/managerdash");
    } else if (role === "admin") {
      navigate("/admindash");
    } else if (role === "supervisor") {
      navigate("/supervisordash");
    }
  }, []);

  return (
    <div className="mt-8">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-between p-4">
        <div data-aos="zoom-in" className="w-full lg:w-1/2 mt-20">
          <img
            src="/banner.png"
            alt="Logo"
            className="w-full h-auto object-cover hidden lg:block animate-bounceUpDown"
          />
          <img
            src="/banner2.png"
            alt="Logo"
            className="w-full h-auto object-cover block lg:hidden animate-bounceUpDown"
          />
        </div>
        <div className="w-full lg:w-1/2 mt-4 lg:mt-0 text-center lg:text-left">
          <h1
            className="text-3xl font-bold mb-4"
            style={{
              background:
                "linear-gradient(to right, rgba(0, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to Our Premium Help & Support
          </h1>
          <Button
            onClick={handleAppointmentClick}
            type="primary"
            className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 font-bold shadow-lg hover:shadow-xl my-4"
          >
            Book Appointment
          </Button>
          <p className="text-base text-black-900 mb-6">
            Welcome to the Saumic Craft Support Portal! Designed to streamline
            your experience, our portal empowers users to raise tickets for any
            concerns or queries and book appointments with their designated
            managers effortlessly. Whether you need assistance with Amazon
            product listings or e-commerce website development, our dedicated
            team is here to provide you with personalized support and ensure
            your projects stay on track.
          </p>
        </div>
      </div>
      <div className=" mt-32 w-full h-20 flex items-center justify-center bg-gradient-to-r from-blue-800 to-blue-400 text-white">
        <h1 className="text-4xl font-bold">How to use this portal</h1>
      </div>
      <div className="mt-10 p-4 bg-gray-50 shadow-lg rounded-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <iframe
            sandbox="allow-same-origin allow-scripts"
            src="https://drive.google.com/file/d/1vGs4zzudQQqVtwInFR_rvA1jBPRjd4ZA/preview"
            width="100%"
            height="220"
            allow="autoplay"
            className="rounded-lg"
          ></iframe>
          <iframe
            sandbox="allow-same-origin allow-scripts"
            src="https://drive.google.com/file/d/1gN4kGZQOTaL4NDkN6hjzwDzbIqiHn4gF/preview"
            width="100%"
            height="220"
            allow="autoplay"
            className="rounded-lg"
          ></iframe>
          <iframe
            sandbox="allow-same-origin allow-scripts"
            src="https://drive.google.com/file/d/10mT5cnmy2E-7IAYjjc5zBqYkn0uuvzcD/preview"
            width="100%"
            height="220"
            allow="autoplay"
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
