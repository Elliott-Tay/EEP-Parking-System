import React, { useState } from "react";

function ViewLogLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!userId || !password) {
      alert("Please enter both User ID and Password.");
      return;
    }

    // TODO: Call API to verify credentials
    console.log({ userId, password });
    alert(`Logging in as: ${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold mb-6">View Log</h1>

      <form 
        onSubmit={handleLogin} 
        className="w-full max-w-sm bg-white border rounded-lg shadow p-6"
      >
        <p className="text-gray-700 mb-4">Please input your User ID and Password</p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default ViewLogLogin;
