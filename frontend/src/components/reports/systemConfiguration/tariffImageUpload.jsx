import React, { useState, useEffect } from "react";
import { Home, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TariffImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const navigate = useNavigate();

  const backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

  // Fetch previously uploaded images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${backend}/api/image/tariff-images`);
        if (!res.ok) throw new Error("Failed to fetch images");
        const data = await res.json();
        setUploadedImages(data.images || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchImages();
  }, [backend]);

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

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
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
      setUploadedImages((prev) => [data.filename, ...prev]);
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
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-tr from-blue-50 to-indigo-100 p-6 relative"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
      >
        <Home className="w-5 h-5" /> Home
      </button>

      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 flex flex-col items-center space-y-8 animate-fadeIn">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
          Upload Tariff Image
        </h2>

        {/* Drag-and-Drop / File Input */}
        <div className="w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center transition-all hover:border-blue-500 cursor-pointer">
          <label className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Drag & Drop an Image Here or Click to Select
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute w-full h-full opacity-0 cursor-pointer"
          />
          {previewUrl && (
            <div
              className="mt-4 w-full border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg p-4 bg-gray-50 dark:bg-gray-800 transition-transform duration-300 hover:scale-105"
              onClick={() => setModalOpen(true)}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-[400px] object-contain rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`w-full px-8 py-4 rounded-2xl text-white text-lg font-semibold transition-all transform ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:scale-105 shadow-md"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>

        {/* Status Message */}
        {message && (
          <p
            className={`text-lg font-medium mt-2 transition-colors ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Previously Uploaded Images */}
        {uploadedImages.length > 0 && (
          <div className="w-full mt-8">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Uploaded Images
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer overflow-hidden rounded-2xl shadow-md hover:scale-105 transition-transform"
                  onClick={() => {
                    setPreviewUrl(`${backend}/uploads/${img}`);
                    setModalOpen(true);
                  }}
                >
                  <img
                    src={`${backend}/uploads/${img}`}
                    alt={`Uploaded ${idx}`}
                    className="w-full h-36 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {modalOpen && previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl z-50"
            >
              <X />
            </button>
            <img
              src={previewUrl}
              alt="Full Preview"
              className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
