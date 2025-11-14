import React, { useState, useEffect } from "react";
import { 
  XCircle, 
  Clock, 
  DollarSign, 
  Car, 
  Calendar,
  AlertCircle,
  CheckCircle,
  History,
  Calculator,
  Image as ImageIcon,
  Layers,
  ArrowRight
} from 'lucide-react';
import { toast } from "react-toastify";

// --- CONFIGURATION ---
const DEFAULT_BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}`;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000; // 1 second

// Mapping to determine the parent model set automatically from the specific rate type.
const RATE_TO_MODEL_MAP = {
    'Hourly': 'COMPREHENSIVE_RATES',
    'Season': 'COMPREHENSIVE_RATES',
    'Day Season': 'COMPREHENSIVE_RATES',
    'Night Season': 'COMPREHENSIVE_RATES',
    
    'Block1': 'BLOCK2_SPECIAL_RATES',
    'Block2': 'BLOCK2_SPECIAL_RATES',
    'Special': 'BLOCK2_SPECIAL_RATES',

    'Staff Estate A': 'STAFF_ESTATE_RATES',
    'Staff Estate B': 'STAFF_ESTATE_RATES',
    'URA Staff': 'STAFF_ESTATE_RATES',

    'Class1': 'CLASS1_RATES',
};

const MODEL_CATALOG = {
    'COMPREHENSIVE_RATES': 'Comprehensive (Hourly/Season)',
    'BLOCK2_SPECIAL_RATES': 'Block 2 Special',
    'STAFF_ESTATE_RATES': 'Staff Estate Rates',
    'CLASS1_RATES': 'Class 1 Flat Rates'
};

const RATE_TYPES = Object.keys(RATE_TO_MODEL_MAP); // Use keys from the map for the dropdown

// Utility function to format the datetime-local string (YYYY-MM-DDTHH:MM)
// into the API's required format (YYYY-MM-DDTHH:MM:SSZ).
const formatApiDateTime = (dateTimeStr) => {
    return `${dateTimeStr}:00Z`;
};

export default function FeeCalculator() {
    // Set 'Hourly' as the initial rate, which auto-sets the model to 'COMPREHENSIVE_RATES'
    const [rateType, setRateType] = useState("Hourly"); 

    // This state is now managed automatically based on rateType
    const [modelCatalogKey, setModelCatalogKey] = useState(RATE_TO_MODEL_MAP["Hourly"]);

    const [entryTime, setEntryTime] = useState("");
    const [exitTime, setExitTime] = useState("");
    const [vehicleType, setVehicleType] = useState("Car/HGV");
    
    // UI/Result states
    const [fee, setFee] = useState(null);
    const [hoursParked, setHoursParked] = useState(null);
    const [history, setHistory] = useState([]);
    const [tariffImageUrl, setTariffImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    
    const backendUrl = DEFAULT_BACKEND_URL;

    // --- EFFECTS ---

    // 1. Automatically update modelCatalogKey when rateType changes
    useEffect(() => {
        const mappedKey = RATE_TO_MODEL_MAP[rateType];
        if (mappedKey && mappedKey !== modelCatalogKey) {
            setModelCatalogKey(mappedKey);
        }
    }, [rateType, modelCatalogKey]);

    // 2. Fetch tariff image on load
    useEffect(() => {
        setTariffImageUrl(`${backendUrl}/api/image/tariff-image`);
    }, [backendUrl]);

    // --- LOGIC ---

    // Helper to display errors without using alert()
    const displayError = (message) => {
        setErrorMessage(message);
        toast.error(message);
        setTimeout(() => setErrorMessage(null), 5000); // Clear error after 5 seconds
    };

    const calculateFee = async () => {
        setFee(null);
        setHoursParked(null);
        setErrorMessage(null);

        if (!entryTime || !exitTime) {
            return displayError("Please enter both entry and exit times.");
        }
        
        // Use local time strings for duration calculation and validation
        const entryDate = new Date(entryTime);
        const exitDate = new Date(exitTime);

        if (exitDate <= entryDate) {
            return displayError("Exit time cannot be before or the same as entry time.");
        }

        const totalMinutes = (exitDate.getTime() - entryDate.getTime()) / (1000 * 60);
        const totalHours = totalMinutes / 60;
        
        // --- FORMATTING FOR API PAYLOAD ---
        const apiEntryTime = formatApiDateTime(entryTime);
        const apiExitTime = formatApiDateTime(exitTime);
        // ----------------------------------

        const payload = {
            entryDateTime: apiEntryTime, 
            exitDateTime: apiExitTime,   
            // Send the exact vehicle type string
            vehicleType: vehicleType, 
            rateType: rateType,
            modelCatalogKey: modelCatalogKey 
        };
        
        setLoading(true);
        
        const apiPath = "/api/fee-computation/calculate-fee";

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const response = await fetch(`${backendUrl}${apiPath}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                const totalFee = data.total_fee;
                
                // Update successful calculation states
                setFee(totalFee.toFixed(2));
                setHoursParked(totalHours);

                // Add to history - Use backend-confirmed rate_type and fee_model
                setHistory((prev) => [
                    {
                        entryTime: entryDate.toLocaleString(),
                        exitTime: exitDate.toLocaleString(),
                        vehicleType,
                        // Using data from the response for canonical values
                        rateType: data.rate_type || rateType, 
                        modelCatalogKey: data.fee_model || modelCatalogKey,
                        hours: totalHours.toFixed(2),
                        fee: totalFee.toFixed(2),
                    },
                    ...prev,
                ]);

                toast.success("Fee calculated successfully!");
                setLoading(false);
                return; // Success, exit function
            } catch (error) {
                if (attempt === MAX_RETRIES - 1) {
                    // Last attempt failed
                    const apiMessage = `Calculation failed: ${error.message}.`;
                    displayError(apiMessage);
                    setFee(null);
                } else {
                    // Exponential backoff
                    const delay = BASE_DELAY_MS * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        setLoading(false);
    };

    // UI component for custom alert/message
    const Message = ({ message, type }) => {
        if (!message) return null;
        const bgColor = type === 'error' ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
        return (
            <div className={`fixed top-4 right-4 p-4 rounded-xl text-white font-semibold shadow-2xl flex items-center bg-gradient-to-r ${bgColor} z-50 animate-in slide-in-from-right duration-300`}>
                <XCircle className="w-5 h-5 mr-2" />
                {message}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            <Message message={errorMessage} type="error" />
            
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
                <div className="px-6 py-5">
                    <div className="flex items-center gap-4 max-w-7xl mx-auto">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-200">
                            <Calculator className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Parking Fee Calculator
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Calculate parking fees with real-time tariff rates
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Main Calculator Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Form */}
                    <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Parking Details</h3>
                                    <p className="text-sm text-blue-100 mt-0.5">Enter parking session information</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Entry Time */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Entry Time *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <input
                                        type="datetime-local"
                                        value={entryTime}
                                        onChange={(e) => setEntryTime(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Exit Time */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Exit Time *
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <input
                                        type="datetime-local"
                                        value={exitTime}
                                        onChange={(e) => setExitTime(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Vehicle Type *
                                </label>
                                <div className="relative">
                                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <select
                                        value={vehicleType}
                                        onChange={(e) => setVehicleType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none appearance-none bg-white"
                                    >
                                        <option>Car/HGV</option>
                                        <option>MC</option>
                                        <option>Car/MC/HGV</option>
                                    </select>
                                </div>
                            </div>

                            {/* Rate Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Specific Rate Type *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                    <select
                                        value={rateType}
                                        onChange={(e) => setRateType(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none appearance-none bg-white"
                                    >
                                        {RATE_TYPES.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Inferred Model Info */}
                            <div className="rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                                        <Layers className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                                            Inferred Rate Model
                                        </p>
                                        <p className="text-sm font-bold text-blue-900 mt-1">
                                            {MODEL_CATALOG[modelCatalogKey]}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Calculate Button */}
                            <button
                                onClick={calculateFee}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Calculating...
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="h-5 w-5" />
                                        Calculate Parking Fee
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Tariff Image */}
                    <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                                    <ImageIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Tariff Rate Card</h3>
                                    <p className="text-sm text-indigo-100 mt-0.5">Current parking tariff structure</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 flex items-center justify-center min-h-[400px]">
                            {tariffImageUrl ? (
                                <img
                                    src={tariffImageUrl}
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x300/e0e0e0/555?text=Tariff+Image+Unavailable" }}
                                    alt="Tariff"
                                    className="w-full h-auto rounded-xl border-2 border-slate-200 shadow-lg"
                                />
                            ) : (
                                <div className="text-center">
                                    <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500">Loading tariff image...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Result Display */}
                {fee !== null && (
                    <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Calculation Result</h3>
                                    <p className="text-sm text-green-100 mt-0.5">Fee computed successfully</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Fee Amount */}
                            <div className="text-center mb-8">
                                <p className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">
                                    Total Parking Fee
                                </p>
                                <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg">
                                    <DollarSign className="w-12 h-12 text-green-600" />
                                    <span className="text-6xl font-extrabold text-green-700">
                                        {fee}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-5 h-5 text-blue-600" />
                                        <span className="text-xs font-semibold text-blue-700 uppercase">Time Parked</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-900">{hoursParked.toFixed(2)}</p>
                                    <p className="text-xs text-blue-600 mt-1">hours</p>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Car className="w-5 h-5 text-purple-600" />
                                        <span className="text-xs font-semibold text-purple-700 uppercase">Vehicle Type</span>
                                    </div>
                                    <p className="text-xl font-bold text-purple-900">{vehicleType}</p>
                                </div>

                                <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <DollarSign className="w-5 h-5 text-orange-600" />
                                        <span className="text-xs font-semibold text-orange-700 uppercase">Rate Applied</span>
                                    </div>
                                    <p className="text-lg font-bold text-orange-900">{rateType}</p>
                                    <p className="text-xs text-orange-600 mt-1">{MODEL_CATALOG[modelCatalogKey]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* History Section */}
                {history.length > 0 && (
                    <div className="rounded-2xl border-2 bg-white shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                                    <History className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Calculation History</h3>
                                    <p className="text-sm text-slate-300 mt-0.5">
                                        Recent calculations (showing {Math.min(history.length, 5)} of {history.length})
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-3">
                                {history.slice(0, 5).map((h, idx) => (
                                    <div
                                        key={idx}
                                        className="group p-5 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Time Info */}
                                            <div className="space-y-2">
                                                <div className="flex items-start gap-2">
                                                    <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-600">Entry</p>
                                                        <p className="text-sm text-slate-800">{h.entryTime}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 pl-6">
                                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-600">Exit</p>
                                                        <p className="text-sm text-slate-800">{h.exitTime}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details & Fee */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">Vehicle:</span>
                                                    <span className="text-sm font-semibold text-slate-800">{h.vehicleType}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">Duration:</span>
                                                    <span className="text-sm font-semibold text-slate-800">{h.hours} hrs</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-slate-600">Rate:</span>
                                                    <span className="text-sm font-semibold text-slate-800">{h.rateType}</span>
                                                </div>
                                                <div className="pt-2 mt-2 border-t-2 border-slate-200">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-slate-700">Total Fee:</span>
                                                        <span className="text-xl font-bold text-green-600">${h.fee}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {history.length > 5 && (
                                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                                    <p className="text-sm text-slate-600">
                                        Showing last 5 entries. <span className="font-semibold">{history.length - 5} more</span> in history.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}