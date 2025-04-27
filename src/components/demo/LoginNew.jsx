import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const LoginNew = () => {
  const [email, setEmail] = useState("john@ot.run");
  const [isInteracted, setIsInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    setIsInteracted(true);
  };

  const isButtonActive = isInteracted && email.trim() !== "";

  const handleSignIn = async () => {
    if (!isButtonActive) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8085/api/request-otp",
        {
          email: email.trim(),
        }
      );
      if (response.status === 200) {
        toast.success("OTP sent to your email!");
        navigate("/otp-verification", { state: { email: email.trim() } });
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to send OTP. Please try again.";
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
          Log in to your account
        </h2>

        {/* Subheading */}
        <p className="font-inter font-normal text-[14px] leading-[20px] tracking-[0%] text-center text-[#708090] w-[324px] h-[20px] mb-[32px]">
          Available for users with an email from ot.run
        </p>

        {/* Email section */}
        <div className="w-full">
          {/* Label */}
          <label
            htmlFor="email"
            className="block font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-[#1c1c1c] w-[324px] h-[20px] mb-[4px]"
          >
            Email
          </label>

          {/* Input */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            className="w-[324px] h-[44px] px-3 py-3 rounded-lg border border-[#e3e3e3] bg-white text-[rgba(112,128,144,0.5)] text-sm font-normal leading-5 font-inter mb-[16px]"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSignIn}
          className={`w-[324px] h-[40px] rounded-lg py-3 px-4 flex items-center justify-center transition duration-200 ${
            isButtonActive && !isLoading
              ? "bg-[#327bf5] hover:bg-blue-600"
              : "bg-[#c6c6c6] cursor-not-allowed"
          }`}
          disabled={!isButtonActive || isLoading}
        >
          <span className="text-white font-medium text-sm leading-4 font-inter">
            {isLoading ? "Sending..." : "Sign in"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default LoginNew;
