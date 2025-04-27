import React, { useState } from "react";
import {
  Search,
  Upload,
  Link,
  Home,
  Share,
  Star,
  Trash,
  User,
  Settings,
  HelpCircle,
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("files");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const files = [
    {
      id: 1,
      name: "Jakob headshot.png",
      size: "1.2 MB",
      type: "png",
      thumbnail: "/api/placeholder/40/40",
    },
    {
      id: 2,
      name: "Tech requirements.doc",
      size: "22 MB",
      type: "pdf",
      thumbnail: "/api/placeholder/40/40",
    },
    {
      id: 3,
      name: "Ayini moodboard.png",
      size: "7.2 MB",
      type: "png",
      thumbnail: "/api/placeholder/40/40",
    },
    {
      id: 4,
      name: "JusDesign moodboard.png",
      size: "8 MB",
      type: "png",
      thumbnail: "/api/placeholder/40/40",
    },
    {
      id: 5,
      name: "Q3 - 2024 reporting.xls",
      size: "18.4 MB",
      type: "xls",
      thumbnail: "/api/placeholder/40/40",
    },
    {
      id: 6,
      name: "Q2 - 2024 reporting.xls",
      size: "21 MB",
      type: "xls",
      thumbnail: "/api/placeholder/40/40",
    },
    {
      id: 7,
      name: "Consultation services.ppt",
      size: "32 MB",
      type: "ppt",
      thumbnail: "/api/placeholder/40/40",
    },
  ];

  return (
    <nav className="absolute w-[268px] h-[858px] top-[20px] left-[132px] bg-white shadow-md">
      {/* Logo font SFPro và icon không có sẵn*/}
      <div className="flex items-center w-[268px] h-[60px] pt-[20px] pr-[24px] pb-[20px] pl-[24px] gap-[10px] border-b border-[#eeeeee]">
        <span className="font-SFPro font-[590] text-[17.26px] leading-[19.18px] tracking-[0%] text-[#1c1c1c] w-[104px] h-[20px]">
          OneTransfer
        </span>
      </div>

      {/* Add new button */}
      <div className="px-4 relative">
        {/* Add new button */}
        <button
          onClick={toggleDropdown}
          className="w-full bg-blue-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add new
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10">
            <div className="px-4 py-2">
              <span className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wide">
                Add new
              </span>
            </div>
            <ul>
              <li className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <svg
                  className="w-5 h-5 mr-3 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <span className="font-inter text-sm font-medium text-gray-800 flex-1">
                  File upload
                </span>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <svg
                  className="w-5 h-5 mr-3 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <span className="font-inter text-sm font-medium text-gray-800 flex-1">
                  Create short link
                </span>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* General Section */}
      <div className="mt-6">
        <div className="px-4">
          <span className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wide">
            General
          </span>
        </div>
        <ul className="mt-2">
          <li className="flex items-center px-4 py-2 bg-gray-100">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12h18M3 6h18M3 18h18"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-800">
              Dashboard
            </span>
          </li>
          <li className="flex items-center px-4 py-2 hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m-4 0H7a2 2 0 01-2-2v-6a2 2 0 012-2h2m4 0V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-600">
              Shared with me
            </span>
          </li>
          <li className="flex items-center px-4 py-2 hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-600">
              Favourites
            </span>
          </li>
          <li className="flex items-center px-4 py-2 hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-600">
              Deleted files
            </span>
          </li>
        </ul>
      </div>

      {/* More Section */}
      <div className="mt-6">
        <div className="px-4">
          <span className="font-inter text-xs font-medium text-gray-500 uppercase tracking-wide">
            More
          </span>
        </div>
        <ul className="mt-2">
          <li className="flex items-center px-4 py-2 hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-600">
              My profile
            </span>
          </li>
          <li className="flex items-center px-4 py-2 hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-600">
              Settings
            </span>
          </li>
          <li className="flex items-center px-4 py-2 hover:bg-gray-50">
            <svg
              className="w-5 h-5 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536-3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            <span className="font-inter text-sm font-medium text-gray-600">
              Support
            </span>
          </li>
        </ul>
      </div>

      {/* Log out */}
      <div className="absolute bottom-4 px-4">
        <button className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50">
          <svg
            className="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            ></path>
          </svg>
          <span className="font-inter text-sm font-medium">Log out</span>
        </button>
      </div>
    </nav>
  );
};

export default Dashboard;
