import React, { useState } from "react";

function ChangePassword() {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const handleChangePassword = () => {
    if (!username || !oldPassword || !newPassword || !verifyPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== verifyPassword) {
      alert("New password and verify password do not match!");
      return;
    }

    // TODO: Call API to change password
    console.log({ username, oldPassword, newPassword });
    alert("Password changed successfully!");
    
    // Clear fields
    setOldPassword("");
    setNewPassword("");
    setVerifyPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-8">
      <h1 className="text-2xl font-bold mb-6">Change Password</h1>

      <div className="w-full max-w-md bg-white border rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">User Name:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Verify Password:</label>
          <input
            type="password"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleChangePassword}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
