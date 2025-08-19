import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong.</h1>
          <p className="text-gray-700 mb-4">
            An unexpected error has occurred. Our team has been notified.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;