import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getAllLearnedProgress } from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Đăng ký các thành phần của Chart.js và plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const Statistics = () => {
  const [learnedWords, setLearnedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLearnedWords = async () => {
      setLoading(true);
      setError("");
      try {
        const progressResponse = await getAllLearnedProgress();
        setLearnedWords(progressResponse.data.$values);
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải dữ liệu thống kê"
        );
        toast.error("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchLearnedWords();
  }, []);

  // Tạo gradient colors
  const createGradient = (ctx, chartArea, colorStart, colorEnd) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
  };

  // Dữ liệu cho biểu đồ
  const chartData = {
    labels: ["Cấp 1", "Cấp 2", "Cấp 3", "Cấp 4+"],
    datasets: [
      {
        label: "Số từ",
        data: [
          learnedWords.filter((word) => word.memoryLevel === 1).length,
          learnedWords.filter((word) => word.memoryLevel === 2).length,
          learnedWords.filter((word) => word.memoryLevel === 3).length,
          learnedWords.filter((word) => word.memoryLevel >= 4).length,
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeOutBounce",
    },
    plugins: {
      legend: {
        display: false, // Ẩn legend vì chỉ có một dataset
      },
      title: {
        display: true,
        text: "Thống kê từ vựng theo mức độ ghi nhớ",
        font: {
          size: 20,
          family: "'Inter', sans-serif",
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
      },
      datalabels: {
        display: true,
        color: "#333",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => (value > 0 ? value : ""),
        anchor: "end",
        align: "bottom",
        offset: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
            family: "'Inter', sans-serif",
            weight: "bold",
          },
        },
      },
      y: {
        display: false, // Ẩn trục tung
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      },
    },
    onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement[0]
        ? "pointer"
        : "default";
    },
  };

  // Thêm gradient background colors khi chart render
  const plugins = [
    {
      id: "customGradient",
      beforeDatasetDraw(chart) {
        const { ctx, chartArea } = chart;
        const dataset = chart.data.datasets[0];
        dataset.backgroundColor = chart.data.labels.map((_, index) => {
          const colorPairs = [
            ["rgba(255, 99, 132, 0.8)", "rgba(255, 99, 132, 0.4)"],
            ["rgba(54, 162, 235, 0.8)", "rgba(54, 162, 235, 0.4)"],
            ["rgba(255, 206, 86, 0.8)", "rgba(255, 206, 86, 0.4)"],
            ["rgba(153, 102, 255, 0.8)", "rgba(153, 102, 255, 0.4)"],
          ];
          return createGradient(
            ctx,
            chartArea,
            colorPairs[index][0],
            colorPairs[index][1]
          );
        });
        dataset.borderColor = [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
        ];
      },
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 bg-opacity-80 flex justify-center items-start pt-20 px-4">
      <div className="w-full max-w-4xl">
        <Link
          to="/revise"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-300 text-white rounded-full shadow-md hover:shadow-lg hover:scale-105 transition duration-300 font-semibold mb-2"
        >
          Quay lại ôn tập
        </Link>

        <div>
          {loading && (
            <div className="text-gray-700 text-center py-6">Đang tải...</div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {!loading && !error && learnedWords.length === 0 && (
            <div className="text-gray-700 text-center py-6">
              Chưa có dữ liệu thống kê. Hãy học từ vựng để xem thống kê!
            </div>
          )}

          {!loading && !error && learnedWords.length > 0 && (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-inner">
              <div style={{ height: "300px" }}>
                <Bar
                  data={chartData}
                  options={chartOptions}
                  plugins={plugins}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
