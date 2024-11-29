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
            Welcome to the Crarts Decor Support Portal! Designed to streamline
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
          <div
            data-aos="fade-up"
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 h-72"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Video 1
            </h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex et,
              consequatur reiciendis, nemo fugiat, labore repellat quaerat
              maxime quae cum quis quasi enim eaque.
            </p>
          </div>
          <div
            data-aos="fade-up"
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 h-72"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Video 2
            </h3>
            <p className="text-gray-700">
              Corporis accusamus suscipit esse velit laborum corrupti cumque
              facilis explicabo dolor dolorum nostrum, aperiam id quis ullam
              amet quaerat voluptas.
            </p>
          </div>

          <div
            data-aos="fade-up"
            className="p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300 h-72"
          >
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Video 3
            </h3>
            <p className="text-gray-700">
              Deserunt illum repellat, soluta assumenda alias eligendi accusamus
              repudiandae porro eaque possimus. Nam sed autem labore numquam
              similique neque.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
