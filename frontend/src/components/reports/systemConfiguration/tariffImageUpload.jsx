import React, { useState } from "react";
import { Home, X, UploadCloud, CheckCircle2, AlertCircle, FileImage, ShieldAlert, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RedTariffPortal() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isDragging, setIsDragging] = useState(false);
  
  const navigate = useNavigate();
  const backend = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:5000";

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus({ type: "", text: "" });
    } else {
      setStatus({ type: "error", text: "INVALID FORMAT: USE JPG/PNG ONLY" });
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;
    const formData = new FormData();
    formData.append("image", selectedImage);
    setUploading(true);

    try {
      const res = await fetch(`${backend}/api/image/tariff-image`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", text: "SYSTEM UPDATED: TARIFF RE-SYNCED" });
      
      setTimeout(() => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setStatus({ type: "", text: "" });
      }, 3000);
    } catch (err) {
      setStatus({ type: "error", text: "CRITICAL ERROR: UPLOAD INTERRUPTED" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0505] text-slate-900 dark:text-white font-sans">
      
      {/* Red Alert Top Bar */}
      <div className="bg-rose-600 h-1.5 w-full sticky top-0 z-50" />

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6 flex justify-between items-center max-w-6xl mx-auto">
        <button 
          onClick={() => navigate("/")} 
          className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white dark:bg-slate-900 px-6 py-3 rounded-xl shadow-md border-2 border-slate-200 dark:border-slate-800 hover:border-rose-500 transition-all"
        >
          <Home className="w-4 h-4 text-rose-600 transition-transform group-hover:-translate-y-0.5" />
          Terminal Home
        </button>
        <div className="flex items-center gap-3 px-4 py-2 bg-rose-50 dark:bg-rose-950/30 rounded-lg border-2 border-rose-100 dark:border-rose-900/50">
          <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-600">Admin Override Active</span>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-10">
        <header className="text-center mb-10 space-y-3">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic italic">
            Tariff <span className="text-rose-600">Update</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-md mx-auto">Deploy new parking rate boards to the global system instantly.</p>
        </header>

        {/* Main Interface Card */}
        <div className="bg-white dark:bg-slate-900 border-4 border-slate-900 dark:border-slate-800 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(225,29,72,0.1)] dark:shadow-none overflow-hidden">
          
          {!previewUrl ? (
            <div 
              className={`p-12 flex flex-col items-center justify-center min-h-[450px] transition-all duration-300
                ${isDragging ? "bg-rose-50/50 dark:bg-rose-900/10" : "bg-transparent"}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); processFile(e.dataTransfer.files[0]); }}
            >
              <div 
                className={`w-full border-4 border-dashed rounded-[1.5rem] p-12 flex flex-col items-center justify-center transition-colors
                ${isDragging ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20" : "border-slate-200 dark:border-slate-800"}`}
              >
                <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-rose-200 dark:shadow-none">
                  <UploadCloud className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Upload Asset</h3>
                <p className="text-slate-400 font-bold text-sm mb-8">DRAG & DROP TARIFF IMAGE</p>
                
                <label className="cursor-pointer bg-slate-900 dark:bg-rose-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-rose-700 active:scale-95 shadow-lg">
                  Select From System
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => processFile(e.target.files[0])} />
                </label>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
              {/* Preview Window */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[480px] border-4 border-slate-900 dark:border-slate-800 shadow-inner">
                <img src={previewUrl} alt="Tariff Preview" className="max-w-full max-h-[480px] object-contain shadow-2xl" />
                
                <button 
                  onClick={() => { setPreviewUrl(null); setSelectedImage(null); }} 
                  className="absolute top-4 right-4 bg-slate-900 text-white p-2.5 rounded-lg hover:bg-rose-600 transition-colors shadow-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Actions & Info */}
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg"><FileImage className="w-4 h-4 text-rose-600" /></div>
                    <span className="text-xs font-black uppercase truncate max-w-[200px]">{selectedImage?.name}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded italic uppercase">Ready for Sync</span>
                </div>

                {status.text && (
                  <div className={`flex items-center gap-3 p-4 rounded-xl border-2 animate-in slide-in-from-left-4 ${status.type === 'success' ? 'bg-emerald-50 border-emerald-500/30 text-emerald-700' : 'bg-rose-50 border-rose-500/30 text-rose-700'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-xs font-black uppercase italic">{status.text}</p>
                  </div>
                )}

                <button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  className={`w-full py-6 rounded-xl font-black text-sm uppercase tracking-[0.3em] transition-all shadow-xl
                    ${uploading ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700 text-white hover:shadow-rose-500/30 active:translate-y-1"}`}
                >
                  {uploading ? "EXECUTING SYNC..." : "Push New Tariff Live"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6 opacity-40 grayscale">
            <Zap className="w-4 h-4" />
            <span className="text-[9px] font-black uppercase tracking-widest">Protocol Version 4.02 // Critical Infrastructure</span>
            <Zap className="w-4 h-4" />
        </div>
      </main>
    </div>
  );
}