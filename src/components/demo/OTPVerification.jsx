import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isInteracted, setIsInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus vào ô input khi component được render
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Redirect nếu không có email
    if (!email) {
      toast.error("Email not provided. Please try again.");
      navigate("/");
      return;
    }

    return () => {
      // Clear timer khi component unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [email, navigate]);

  // Xử lý countdown cho nút Resend OTP
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [countdown]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Chỉ cho phép nhập số, tối đa 6 ký tự
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setIsInteracted(true);
      setErrorMessage("");
    }
  };

  const isButtonActive = isInteracted && otp.trim().length === 6;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isButtonActive) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!isButtonActive || isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8087/api/verify-otp",
        {
          email,
          otp: otp.trim(),
        }
      );
      if (response.status === 200) {
        toast.success("Login successful!");

        // Lưu token vào localStorage nếu API trả về
        if (response.data?.token) {
          localStorage.setItem("authToken", response.data.token);
        }

        navigate("/Dashboard");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to verify OTP. Please try again.";

      setErrorMessage(message);
      toast.error(message);

      // Focus vào input để người dùng có thể nhập lại ngay
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (isResending || countdown > 0) return;

    setIsResending(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8085/api/request-otp",
        {
          email,
        }
      );
      if (response.status === 200) {
        toast.success("New OTP sent to your email!");
        setOtp("");
        setIsInteracted(false);
        // Bắt đầu đếm ngược 30 giây trước khi người dùng có thể gửi lại OTP
        setCountdown(30);

        // Focus vào input để người dùng có thể nhập ngay
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to resend OTP. Please try again.";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="w-[324px] flex flex-col items-center">
        {/* Heading */}
        <h2 className="font-inter font-semibold text-[20px] leading-[28px] tracking-[0%] text-center text-[#1c1c1c] w-[324px] h-[28px] mb-[12px]">
          Enter OTP
        </h2>

        {/* Subheading */}
        <p className="font-inter font-normal text-[14px] leading-[20px] tracking-[0%] text-center text-[#708090] w-[324px] mb-[32px]">
          A 6-digit code has been sent to {email}
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
            className={`font-inter font-medium text-[14px] leading-[20px] tracking-[0%] w-[150px] h-[20px] mb-[4px] text-right hover:underline ${
              countdown > 0 || isResending
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#327bf5]"
            }`}
            disabled={countdown > 0 || isResending}
          >
            {countdown > 0
              ? `Resend in ${countdown}s`
              : isResending
              ? "Sending..."
              : "Resend OTP"}
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          id="otp"
          ref={inputRef}
          value={otp}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="______"
          className={`w-[324px] h-[44px] px-3 py-3 rounded-lg border ${
            errorMessage ? "border-red-500" : "border-[#e3e3e3]"
          } bg-white text-[#1c1c1c] text-center font-mono text-lg font-normal leading-5 mb-[8px]`}
          maxLength={6}
        />

        {/* Error Message */}
        {errorMessage && (
          <p className="font-inter font-normal text-[12px] leading-[16px] tracking-[0%] text-red-500 w-[324px] mb-[8px]">
            {errorMessage}
          </p>
        )}

        {/* Help Text */}
        <p className="font-inter font-normal text-[12px] leading-[16px] tracking-[0%] text-[#708090] w-[324px] mb-[16px] text-center">
          Please enter the 6-digit code sent to your email
        </p>

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
            {isLoading ? "Verifying..." : "Verify"}
          </span>
        </button>

        {/* Back to login link */}
        <button
          onClick={() => navigate("/")}
          className="font-inter font-medium text-[14px] leading-[20px] tracking-[0%] text-[#708090] mt-4 hover:text-[#327bf5] hover:underline"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
