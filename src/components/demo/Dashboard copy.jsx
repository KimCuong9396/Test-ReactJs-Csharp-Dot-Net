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

const Dashboard1 = () => {
  const [activeTab, setActiveTab] = useState("files");

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
    <div className="flex h-screen bg-blue-500">
      {/* Blue background with tagline */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-500 z-0 flex items-center justify-center">
        <div className="text-white text-center px-6">
          <h1 className="text-4xl font-bold mb-2">
            Share large files and create short links with ease!
          </h1>
        </div>
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 pt-16 z-10 flex">
        <div className="bg-white rounded-lg shadow-lg w-full flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-gray-100 p-4">
            <div className="flex items-center mb-6">
              <span className="font-semibold text-lg flex items-center">
                <span className="mr-2">⎐</span> OneTransfer
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-400 mb-2">ADD NEW</p>
              <div className="space-y-2">
                <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                  <Upload size={18} className="mr-2" />
                  <span>File upload</span>
                  <div className="ml-auto w-4 h-4 bg-blue-500 rounded-sm"></div>
                </div>
                <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                  <Link size={18} className="mr-2" />
                  <span>Create short link</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center p-2 bg-blue-50 rounded text-blue-600 cursor-pointer">
                <Home size={18} className="mr-2" />
                <span>Dashboard</span>
              </div>
              <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                <Share size={18} className="mr-2" />
                <span>Shared with me</span>
              </div>
              <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                <Star size={18} className="mr-2" />
                <span>Favourites</span>
              </div>
              <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                <Trash size={18} className="mr-2" />
                <span>Deleted files</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">MORE</p>
              <div className="space-y-2">
                <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                  <User size={18} className="mr-2" />
                  <span>My profile</span>
                </div>
                <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                  <Settings size={18} className="mr-2" />
                  <span>Settings</span>
                </div>
                <div className="flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer text-gray-700">
                  <HelpCircle size={18} className="mr-2" />
                  <span>Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search here"
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <span className="mr-3">⌘ + S</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <div className="inline-flex rounded-lg">
                <button
                  onClick={() => setActiveTab("files")}
                  className={`px-4 py-2 rounded-l-lg ${
                    activeTab === "files"
                      ? "bg-gray-100 font-medium"
                      : "bg-white"
                  }`}
                >
                  My files
                </button>
                <button
                  onClick={() => setActiveTab("links")}
                  className={`px-4 py-2 rounded-r-lg ${
                    activeTab === "links"
                      ? "bg-gray-100 font-medium"
                      : "bg-white"
                  }`}
                >
                  Short links
                </button>
              </div>
            </div>

            {/* Files list */}
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="w-8 pb-3">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="pb-3 text-left font-medium text-gray-600 text-sm">
                      <div className="flex items-center">
                        Name <span className="ml-1">↓</span>
                      </div>
                    </th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr
                      key={file.id}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td>
                        <div className="flex items-center">
                          <img
                            src={file.thumbnail}
                            alt=""
                            className="w-10 h-10 mr-3 rounded"
                          />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <div className="flex text-sm text-gray-500">
                              <span>{file.size}</span>
                              <span className="mx-2">•</span>
                              <span>{file.type}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard1;
