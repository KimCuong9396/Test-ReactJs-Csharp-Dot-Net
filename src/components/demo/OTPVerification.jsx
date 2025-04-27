import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isInteracted, setIsInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleInputChange = (e) => {
    setOtp(e.target.value);
    setIsInteracted(true);
  };

  const isButtonActive = isInteracted && otp.trim() !== "";

  const handleSubmit = async () => {
    if (!isButtonActive) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8085/api/verify-otp",
        {
          email,
          otp: otp.trim(),
        }
      );
      if (response.status === 200) {
        toast.success("Login successful!");
        navigate("/Dashboard");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8084/api/request-otp",
        {
          email,
        }
      );
      if (response.status === 200) {
        toast.success("New OTP sent to your email!");
        setOtp("");
        setIsInteracted(false);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-[324px] h-[216px] flex flex-col items-center">
        {/* Heading */}
        <h2 className="font-inter font-semibold text-[20px] leading-[28px] tracking-[0%] text-center text-[#1c1c1c] w-[324px] h-[28px] mb-[12px]">
          Enter OTP
        </h2>

        {/* Subheading */}
        <p className="font-inter font-normal text-[14px] leading-[20px] tracking-[0%] text-center text-[#708090] w-[324px] h-[20px] mb-[32px]">
          An OTP has been sent to {email}.
        </p>

        {/* OTP section */}
        <div className="w-full flex items-center justify-between">
          {/* Label */}
          <label
            htmlFor="otp"
            className="block font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-[#1c1c1c] w-[150px] h-[20px] mb-[4px]"
          >
            One time password
          </label>

          {/* Resend OTP Link */}
          <button
            onClick={handleResendOTP}
            className="font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-[#327bf5] w-[100px] h-[20px] mb-[4px] text-right hover:underline disabled:text-gray-400"
            disabled={isLoading}
          >
            Resend OTP
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={handleInputChange}
          placeholder="------"
          className="w-[324px] h-[44px] px-3 py-3 rounded-lg border border-[#e3e3e3] bg-white text-[rgba(112,128,144,0.5)] text-sm font-normal leading-5 font-inter mb-[16px] text-center"
        />

        {/* Button */}
        <button
          onClick={handleSubmit}
          className={`w-[324px] h-[40px] rounded-lg py-3 px-4 flex items-center justify-center transition duration-200 ${
            isButtonActive && !isLoading
              ? "bg-[#327bf5] hover:bg-blue-600"
              : "bg-[#c6c6c6] cursor-not-allowed"
          }`}
          disabled={!isButtonActive || isLoading}
        >
          <span className="text-white font-medium text-sm leading-4 font-inter">
            {isLoading ? "Submitting..." : "Submit"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
