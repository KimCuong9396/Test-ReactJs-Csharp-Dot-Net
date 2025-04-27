import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  LogOut,
  BookOpen,
  Users,
  FileText,
  BarChart,
  Moon,
  Sun,
  Search,
  Bell,
  Globe,
  Calendar,
  Download,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"; // Replaced react-beautiful-dnd

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("vi");
  const [activeUsers, setActiveUsers] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(
    !localStorage.getItem("onboardingCompleted")
  );
  const [widgets, setWidgets] = useState([
    { id: "stats", title: "Thống kê", type: "stats" },
    { id: "chart", title: "Biểu đồ", type: "chart" },
    { id: "notifications", title: "Thông báo", type: "notifications" },
    { id: "activities", title: "Hoạt động", type: "activities" },
  ]);
  const navigate = useNavigate();

  // Giả lập cập nhật dữ liệu thời gian thực
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 1000));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success(
      language === "vi" ? "Đăng xuất thành công!" : "Logged out successfully!",
      { position: "top-right" }
    );
    setTimeout(() => navigate("/login"), 1500);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    toast.info(
      language === "vi"
        ? `Đã chuyển sang chủ đề: ${newTheme}`
        : `Switched to theme: ${newTheme}`,
      { position: "top-right" }
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(
        language === "vi"
          ? `Tìm kiếm: ${searchQuery}`
          : `Searching: ${searchQuery}`,
        { position: "top-right" }
      );
    }
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    toast.info(
      language === "vi"
        ? `Đã chuyển sang ngôn ngữ: ${lang === "vi" ? "Tiếng Việt" : "English"}`
        : `Switched to language: ${lang === "vi" ? "Vietnamese" : "English"}`,
      { position: "top-right" }
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedWidgets = Array.from(widgets);
    const [movedWidget] = reorderedWidgets.splice(result.source.index, 1);
    reorderedWidgets.splice(result.destination.index, 0, movedWidget);
    setWidgets(reorderedWidgets);
  };

  // Dữ liệu giả cho biểu đồ
  const barChartData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
    datasets: [
      {
        label: language === "vi" ? "Người dùng mới" : "New Users",
        data: [120, 190, 300, 500],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Khóa học", "Người dùng", "Bài học"],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
      },
    ],
  };

  // Dữ liệu giả cho thông báo
  const notifications = [
    {
      id: 1,
      message:
        language === "vi"
          ? "Khóa học mới 'Tiếng Anh Cơ Bản' đã được thêm."
          : "New course 'Basic English' added.",
      time: "2 giờ trước",
    },
    {
      id: 2,
      message:
        language === "vi"
          ? "Người dùng mới đăng ký: Nguyễn Văn A."
          : "New user registered: Nguyễn Văn A.",
      time: "1 giờ trước",
    },
    {
      id: 3,
      message:
        language === "vi"
          ? "Hệ thống cần bảo trì vào 00:00 ngày mai."
          : "System maintenance scheduled at 00:00 tomorrow.",
      time: "30 phút trước",
    },
  ];

  // Dữ liệu giả cho hoạt động gần đây
  const recentActivities = [
    {
      id: 1,
      action:
        language === "vi"
          ? "Cập nhật khóa học 'IELTS Advanced'"
          : "Updated course 'IELTS Advanced'",
      time: "10:30 AM hôm nay",
    },
    {
      id: 2,
      action:
        language === "vi"
          ? "Xóa người dùng 'user123'"
          : "Deleted user 'user123'",
      time: "9:15 AM hôm nay",
    },
    {
      id: 3,
      action:
        language === "vi"
          ? "Thêm từ vựng mới vào bài học 5"
          : "Added new vocabulary to lesson 5",
      time: "8:45 AM hôm nay",
    },
  ];

  // Dữ liệu giả cho vai trò
  const roles = [
    { id: 1, name: "Admin", permissions: ["all"] },
    { id: 2, name: "Editor", permissions: ["edit_courses", "edit_lessons"] },
    { id: 3, name: "Viewer", permissions: ["view_reports"] },
  ];

  // Gợi ý AI
  const aiSuggestions = [
    language === "vi"
      ? "Cập nhật khóa học 'TOEIC 2025' để thêm bài kiểm tra mới."
      : "Update 'TOEIC 2025' course to add new quizzes.",
    language === "vi"
      ? "Kiểm tra tài khoản người dùng không hoạt động trong 30 ngày."
      : "Review user accounts inactive for 30 days.",
  ];

  const handleExport = (format) => {
    toast.info(
      language === "vi"
        ? `Đang xuất dữ liệu dưới dạng ${format}...`
        : `Exporting data as ${format}...`,
      { position: "top-right" }
    );
  };

  const completeOnboarding = () => {
    localStorage.setItem("onboardingCompleted", "true");
    setShowOnboarding(false);
  };

  return (
    <div
      className={`flex h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300 ${
        theme === "blue" ? "bg-blue-50" : theme === "green" ? "bg-green-50" : ""
      }`}
    >
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <h2 className="text-2xl font-semibold text-center">Admin Panel</h2>
        <nav>
          <Link
            to="/admin/manage-courses"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={
              language === "vi" ? "Quản lý các khóa học" : "Manage courses"
            }
          >
            <BookOpen className="mr-2" size={20} />
            {language === "vi" ? "Quản lý khóa học" : "Manage Courses"}
          </Link>
          <Link
            to="/admin/manage-vocabulary"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={language === "vi" ? "Quản lý từ vựng" : "Manage vocabulary"}
          >
            <FileText className="mr-2" size={20} />
            {language === "vi" ? "Quản lý từ vựng" : "Manage Vocabulary"}
          </Link>
          <Link
            to="/admin/manage-lessons"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={language === "vi" ? "Quản lý bài học" : "Manage lessons"}
          >
            <BookOpen className="mr-2" size={20} />
            {language === "vi" ? "Quản lý bài học" : "Manage Lessons"}
          </Link>
          <Link
            to="/admin/manage-users"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={language === "vi" ? "Quản lý người dùng" : "Manage users"}
          >
            <Users className="mr-2" size={20} />
            {language === "vi" ? "Quản lý người dùng" : "Manage Users"}
          </Link>
          <Link
            to="/admin/manage-progress"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={language === "vi" ? "Quản lý tiến độ" : "Manage progress"}
          >
            <BarChart className="mr-2" size={20} />
            {language === "vi" ? "Quản lý tiến độ" : "Manage Progress"}
          </Link>
          <Link
            to="/admin/calendar"
            className="block py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={language === "vi" ? "Lịch sự kiện" : "Event Calendar"}
          >
            <Calendar className="mr-2" size={20} />
            {language === "vi" ? "Lịch sự kiện" : "Event Calendar"}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-4 rounded hover:bg-gray-700 flex items-center transition duration-150"
            title={language === "vi" ? "Đăng xuất" : "Log out"}
          >
            <LogOut className="mr-2" size={20} />
            {language === "vi" ? "Đăng xuất" : "Log Out"}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden p-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <button onClick={toggleSidebar} className="md:hidden">
              <Menu size={24} className="text-gray-600 dark:text-gray-200" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {language === "vi" ? "Bảng điều khiển" : "Dashboard"}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === "vi" ? "Tìm kiếm..." : "Search..."
                    }
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search
                    className="absolute left-3 top-2.5 text-gray-400"
                    size={20}
                  />
                </form>
              </div>
              <button
                onClick={() => changeLanguage(language === "vi" ? "en" : "vi")}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title={
                  language === "vi"
                    ? "Chuyển sang tiếng Anh"
                    : "Switch to Vietnamese"
                }
              >
                <Globe size={20} className="text-gray-600 dark:text-gray-200" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title={
                  language === "vi"
                    ? "Chuyển đổi chế độ tối"
                    : "Toggle dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-gray-200" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </button>
              <select
                onChange={(e) => changeTheme(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                title={language === "vi" ? "Chọn chủ đề" : "Select theme"}
              >
                <option value="default">
                  {language === "vi" ? "Mặc định" : "Default"}
                </option>
                <option value="blue">
                  {language === "vi" ? "Xanh" : "Blue"}
                </option>
                <option value="green">
                  {language === "vi" ? "Xanh lá" : "Green"}
                </option>
              </select>
              <button
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                title={language === "vi" ? "Chat hỗ trợ" : "Support Chat"}
              >
                <MessageSquare
                  size={20}
                  className="text-gray-600 dark:text-gray-200"
                />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Onboarding Guide */}
              {showOnboarding && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {language === "vi"
                        ? "Chào mừng bạn đến với Admin Panel!"
                        : "Welcome to Admin Panel!"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {language === "vi"
                        ? "Sử dụng sidebar để quản lý khóa học, người dùng, và hơn thế nữa. Nhấn 'Hoàn tất' để bắt đầu!"
                        : "Use the sidebar to manage courses, users, and more. Click 'Complete' to start!"}
                    </p>
                    <button
                      onClick={completeOnboarding}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {language === "vi" ? "Hoàn tất" : "Complete"}
                    </button>
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              <div className="mb-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {language === "vi" ? "Gợi ý từ AI" : "AI Suggestions"}
                </h3>
                <ul className="mt-4 space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 dark:text-gray-300"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Drag and Drop Widgets */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="widgets">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`grid grid-cols-1 gap-6 lg:grid-cols-2 ${
                        snapshot.isDraggingOver
                          ? "bg-gray-200 dark:bg-gray-700"
                          : ""
                      }`}
                    >
                      {widgets.length > 0 ? (
                        widgets.map((widget, index) => (
                          <Draggable
                            key={widget.id}
                            draggableId={widget.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-transform ${
                                  snapshot.isDragging ? "scale-105" : ""
                                }`}
                              >
                                {widget.type === "stats" && (
                                  <>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                      {language === "vi"
                                        ? "Thống kê"
                                        : "Statistics"}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                                      <div className="transition-transform transform hover:scale-105">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                          {language === "vi"
                                            ? "Tổng khóa học"
                                            : "Total Courses"}
                                        </p>
                                        <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                                          25
                                        </p>
                                      </div>
                                      <div className="transition-transform transform hover:scale-105">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                          {language === "vi"
                                            ? "Tổng người dùng"
                                            : "Total Users"}
                                        </p>
                                        <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                                          {activeUsers}
                                        </p>
                                      </div>
                                      <div className="transition-transform transform hover:scale-105">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                          {language === "vi"
                                            ? "Bài học hoàn thành"
                                            : "Lessons Completed"}
                                        </p>
                                        <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                                          5,678
                                        </p>
                                      </div>
                                      <div className="transition-transform transform hover:scale-105">
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                          {language === "vi"
                                            ? "Tiến độ trung bình"
                                            : "Average Progress"}
                                        </p>
                                        <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
                                          82%
                                        </p>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {widget.type === "chart" && (
                                  <>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                      {language === "vi"
                                        ? "Phân tích dữ liệu"
                                        : "Data Analytics"}
                                    </h3>
                                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <div>
                                        <Bar
                                          data={barChartData}
                                          options={{
                                            responsive: true,
                                            plugins: {
                                              legend: { position: "top" },
                                              title: {
                                                display: true,
                                                text:
                                                  language === "vi"
                                                    ? "Người dùng mới theo tháng"
                                                    : "New Users by Month",
                                              },
                                            },
                                          }}
                                        />
                                      </div>
                                      <div>
                                        <Pie
                                          data={pieChartData}
                                          options={{
                                            responsive: true,
                                            plugins: {
                                              legend: { position: "top" },
                                              title: {
                                                display: true,
                                                text:
                                                  language === "vi"
                                                    ? "Phân bổ tài nguyên"
                                                    : "Resource Distribution",
                                              },
                                            },
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </>
                                )}
                                {widget.type === "notifications" && (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {language === "vi"
                                          ? "Thông báo"
                                          : "Notifications"}
                                      </h3>
                                      <Bell
                                        className="text-gray-600 dark:text-gray-200"
                                        size={20}
                                      />
                                    </div>
                                    <ul className="mt-4 space-y-4">
                                      {notifications.map((notification) => (
                                        <li
                                          key={notification.id}
                                          className="flex items-center space-x-3"
                                        >
                                          <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                              {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              {notification.time}
                                            </p>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                                {widget.type === "activities" && (
                                  <>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                      {language === "vi"
                                        ? "Hoạt động gần đây"
                                        : "Recent Activities"}
                                    </h3>
                                    <ul className="mt-4 space-y-4">
                                      {recentActivities.map((activity) => (
                                        <li
                                          key={activity.id}
                                          className="flex items-center space-x-3"
                                        >
                                          <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                              {activity.action}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              {activity.time}
                                            </p>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">
                          {language === "vi"
                            ? "Không thể tải widgets. Vui lòng kiểm tra kết nối."
                            : "Unable to load widgets. Please check your connection."}
                        </p>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Role Management */}
              <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {language === "vi" ? "Quản lý vai trò" : "Role Management"}
                </h3>
                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {language === "vi" ? "Tên vai trò" : "Role Name"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {language === "vi" ? "Quyền" : "Permissions"}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {language === "vi" ? "Hành động" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {roles.map((role) => (
                        <tr key={role.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {role.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {role.permissions.join(", ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">
                              {language === "vi" ? "Chỉnh sửa" : "Edit"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Settings */}
              <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {language === "vi" ? "Cấu hình nhanh" : "Quick Settings"}
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {language === "vi"
                        ? "Bật thông báo email"
                        : "Enable email notifications"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-150"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-150"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {language === "vi"
                        ? "Cho phép đăng ký tự động"
                        : "Allow auto-registration"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition duration-150"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition duration-150"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Export Data */}
              <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {language === "vi" ? "Xuất dữ liệu" : "Export Data"}
                </h3>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => handleExport("CSV")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <Download className="mr-2" size={20} />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport("PDF")}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                  >
                    <Download className="mr-2" size={20} />
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport("Excel")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Download className="mr-2" size={20} />
                    Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Admin;
