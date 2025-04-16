import React from "react";

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6 text-red-600">
          <h2>Đã xảy ra lỗi.</h2>
          <p>{this.state.error?.message || "Vui lòng thử lại sau."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
