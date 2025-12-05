import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RefreshCw, 
  XCircle, 
  Loader2, 
  DollarSign, 
  Clock, 
  Home,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

// Define backend endpoint
const API_ENDPOINT = `${process.env.REACT_APP_BACKEND_API_URL}/api/remote-control/parking-charge-errors`;

// --- Helper Functions ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(new Date(dateString));
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatFeeDifference = (calculated, expected) => {
    const diff = expected - calculated;
    if (diff === 0) return formatCurrency(0);

    const sign = diff > 0 ? '+' : '-';
    const color = diff > 0 ? 'text-red-500 font-semibold' : 'text-green-500 font-semibold';

    return (
        <span className={color}>
            {sign} {formatCurrency(Math.abs(diff))}
        </span>
    );
};

// --- Child Table Renderer ---
const ErrorTable = ({ logs }) => {
    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="p-4 rounded-2xl bg-gray-100">
                    <CheckCircle className="h-12 w-12 text-gray-400" />
                </div>
                <div className="text-center">
                    <p className="text-gray-600 font-semibold mb-1">No parking charge errors found</p>
                    <p className="text-sm text-gray-500">All parking charges are calculating correctly</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl shadow-lg border-2 border-gray-200 bg-white/80 backdrop-blur-xl">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-red-500 to-rose-600 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">ID</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Error Timestamp</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Source / Code</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Fee Details</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Entry/Exit Time</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Duration</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Error Message</th>
                    </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                        <tr key={log.ErrorID} className="hover:bg-red-50/50 transition duration-150 ease-in-out">
                            {/* ID */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                #{log.ErrorID}
                            </td>

                            {/* Log Timestamp */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                                    {formatDate(log.LogTimestamp)}
                                </div>
                            </td>

                            {/* Source / Code */}
                            <td className="px-4 py-4 whitespace-nowrap">
                                <span className="text-xs font-semibold inline-flex items-center px-3 py-1.5 rounded-lg text-red-800 bg-red-100 border-2 border-red-200">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    {log.ErrorCode}
                                </span>
                                <div className="text-xs text-gray-500 mt-2 font-medium">{log.SourceSystem} ({log.FeeModelUsed})</div>
                            </td>

                            {/* Fee Details */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-green-50 border border-green-200">
                                            <DollarSign size={12} className="text-green-600" />
                                            <span className="font-medium text-xs">Calc: {formatCurrency(log.CalculatedFee)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 border border-yellow-200">
                                            <DollarSign size={12} className="text-yellow-600" />
                                            <span className="font-medium text-xs">Exp: {formatCurrency(log.ExpectedFee)}</span>
                                        </div>
                                    </div>
                                    <div className="text-xs mt-1 font-semibold">
                                        <span className="text-gray-600">Diff: </span>
                                        {formatFeeDifference(log.CalculatedFee, log.ExpectedFee)}
                                    </div>
                                </div>
                            </td>

                            {/* Entry/Exit */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                        <span className="font-medium">Entry:</span> {formatDate(log.EntryDateTime)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs">
                                        <TrendingDown className="h-3 w-3 text-red-500" />
                                        <span className="font-medium">Exit:</span> {formatDate(log.ExitDateTime)}
                                    </div>
                                </div>
                            </td>

                            {/* Duration */}
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 border-2 border-purple-200">
                                    <Clock size={14} className="text-purple-600" />
                                    <span className="font-semibold text-purple-900">{log.DurationMinutes} min</span>
                                </div>
                            </td>

                            {/* Error Message */}
                            <td className="px-4 py-4 max-w-md text-sm text-gray-700">
                                <p className="whitespace-normal text-xs leading-relaxed bg-red-50 p-3 rounded-lg border border-red-100">
                                    {log.ErrorMessage}
                                </p>
                                {log.RawInputData && (
                                    <details className="mt-3 text-xs">
                                        <summary className="cursor-pointer text-red-600 hover:text-red-800 font-semibold flex items-center gap-1.5">
                                            <FileText className="h-3 w-3" />
                                            Raw Data
                                        </summary>
                                        <pre className="mt-2 p-3 bg-gray-50 rounded-lg text-xs overflow-x-auto border-2 border-gray-200 font-mono">
                                            {log.RawInputData}
                                        </pre>
                                    </details>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// --- MAIN COMPONENT (no default export) ---
export function ParkingChargingError() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchErrors = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_ENDPOINT);

            if (!response.ok) {
                const errorBody = await response.json().catch(() => ({ message: 'Unknown server error' }));
                throw new Error(`HTTP error! ${response.status}. Details: ${errorBody.details || errorBody.message}`);
            }

            const data = await response.json();
            setLogs(data);
            toast.success(`Loaded ${data.length} error log(s)`);
        } catch (err) {
            console.error("Fetch failed:", err);
            const errorMsg = `Failed to load logs. Error: ${err.message}`;
            setError(errorMsg);
            toast.error('Failed to load error logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchErrors();
    }, []);

    // Calculate statistics
    const totalErrors = logs.length;
    const totalCalculatedFees = logs.reduce((sum, log) => sum + (log.CalculatedFee || 0), 0);
    const totalExpectedFees = logs.reduce((sum, log) => sum + (log.ExpectedFee || 0), 0);
    const totalDiscrepancy = totalExpectedFees - totalCalculatedFees;
    const avgDuration = logs.length > 0 
        ? Math.round(logs.reduce((sum, log) => sum + (log.DurationMinutes || 0), 0) / logs.length)
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-rose-50/20">
            {/* Header */}
            <div className="border-b bg-white/80 backdrop-blur-xl shadow-sm sticky top-0 z-10">
                <div className="px-6 py-5">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200">
                                <XCircle className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                    Parking Charge Error Dashboard
                                </h1>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Real-time log of discrepancies between calculated and expected parking fees
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    fetchErrors();
                                    toast.info('Refreshing error logs...');
                                }}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <RefreshCw className={`h-4 w-4 text-red-600 ${loading ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline text-gray-700 font-medium">
                                    {loading ? 'Refreshing...' : 'Refresh'}
                                </span>
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 transition-all duration-200 shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 hover:scale-105"
                            >
                                <Home className="h-4 w-4" />
                                <span className="hidden sm:inline">Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 max-w-7xl mx-auto space-y-6">
                {/* Statistics Summary - Only show when data is available */}
                {!loading && !error && logs.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Errors */}
                        <div className="relative overflow-hidden rounded-xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-200/30 rounded-full -mr-10 -mt-10" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 rounded-lg bg-red-500 shadow-md">
                                        <AlertTriangle className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-red-700">Total Errors</span>
                                </div>
                                <p className="text-2xl font-bold text-red-900">{totalErrors}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                                    <Activity className="h-3 w-3" />
                                    <span>Error Records</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Discrepancy */}
                        <div className={`relative overflow-hidden rounded-xl border-2 ${totalDiscrepancy !== 0 ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100' : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-100'} p-5 shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                            <div className={`absolute top-0 right-0 w-20 h-20 ${totalDiscrepancy !== 0 ? 'bg-orange-200/30' : 'bg-green-200/30'} rounded-full -mr-10 -mt-10`} />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`p-2 rounded-lg ${totalDiscrepancy !== 0 ? 'bg-orange-500' : 'bg-green-500'} shadow-md`}>
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <span className={`text-xs font-semibold ${totalDiscrepancy !== 0 ? 'text-orange-700' : 'text-green-700'}`}>Total Discrepancy</span>
                                </div>
                                <p className={`text-2xl font-bold ${totalDiscrepancy !== 0 ? 'text-orange-900' : 'text-green-900'}`}>
                                    {formatCurrency(Math.abs(totalDiscrepancy))}
                                </p>
                                <div className={`mt-2 flex items-center gap-1 text-xs ${totalDiscrepancy !== 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {totalDiscrepancy > 0 ? <TrendingUp className="h-3 w-3" /> : totalDiscrepancy < 0 ? <TrendingDown className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                                    <span>{totalDiscrepancy > 0 ? 'Over Expected' : totalDiscrepancy < 0 ? 'Under Expected' : 'Balanced'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Calculated */}
                        <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-sky-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/30 rounded-full -mr-10 -mt-10" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 rounded-lg bg-blue-500 shadow-md">
                                        <DollarSign className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-blue-700">Total Calculated</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">{formatCurrency(totalCalculatedFees)}</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
                                    <Activity className="h-3 w-3" />
                                    <span>System Calculated</span>
                                </div>
                            </div>
                        </div>

                        {/* Average Duration */}
                        <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-violet-100 p-5 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10" />
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-2 rounded-lg bg-purple-500 shadow-md">
                                        <Clock className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-xs font-semibold text-purple-700">Avg Duration</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-900">{avgDuration} min</p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-purple-600">
                                    <Activity className="h-3 w-3" />
                                    <span>Parking Time</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 border-b-2 border-red-700">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <XCircle className="h-5 w-5" />
                            Error Log Details
                        </h3>
                        <p className="text-sm text-red-50 mt-0.5">
                            {logs.length > 0 ? `Showing ${logs.length} error record(s)` : 'No errors detected'}
                        </p>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Loader2 className="h-12 w-12 text-red-500 animate-spin" />
                                <p className="text-gray-600 font-medium">Loading error logs...</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl shadow-md">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold text-red-800 mb-1">Data Fetch Error</p>
                                        <p className="text-sm">{error}</p>
                                        <button
                                            onClick={fetchErrors}
                                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading && !error && <ErrorTable logs={logs} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ParkingChargingError;
