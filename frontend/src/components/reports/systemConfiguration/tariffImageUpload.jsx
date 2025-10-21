import React, { useState } from "react";
import { Home } from "lucide-react"; // Using lucide icons for Home button
import { useNavigate } from "react-router-dom";

export default function TariffImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage("");
    } else {
      setMessage("⚠️ Please select a valid image file (JPG, PNG, etc.)");
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setMessage("⚠️ Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    setUploading(true);
    setMessage("");

    try {
      const res = await fetch(`${backend}/api/image/tariff-image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setMessage(`✅ Uploaded successfully! File saved as: ${data.filename}`);
      setSelectedImage(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
      >
        <Home className="w-5 h-5" /> Home
      </button>

      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Upload Tariff Image
        </h2>

        {/* File Input */}
        <div className="w-full mb-6">
          <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            Select Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-6 py-4 border border-gray-300 dark:border-gray-700 rounded-2xl text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-4 focus:ring-blue-400 cursor-pointer transition-all"
          />
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="mb-6 w-full flex flex-col items-center">
            <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold">Preview</p>
            <div className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg p-4 bg-gray-50 dark:bg-gray-800">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-96 object-contain rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full px-8 py-4 rounded-2xl text-white text-lg font-semibold transition-colors ${
            uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {/* Status Message */}
        {message && (
          <p
            className={`mt-6 text-lg font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
