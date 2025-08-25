// frontend/src/pages/Home.jsx
import React from "react";
import { FileText, Calendar, Clock, User, CreditCard } from "lucide-react";

const buttonIcons = {
  "Daily Settlement File": <FileText size={16} />,
  "Analysis of Ack/Sum file": <FileText size={16} />,
  "Daily Cashier Shift": <User size={16} />,
  "Daily Consolidated Summary": <FileText size={16} />,
  "Daily CashCard Collection": <CreditCard size={16} />,
  "Counter Daily Statistics": <Calendar size={16} />,
  "Counter Monthly Statistics": <Calendar size={16} />,
  "Daily Movement Details": <Clock size={16} />,
  "Daily Parking Duration": <Clock size={16} />,
  "Remote Control History": <Clock size={16} />,
  "Station Error History": <FileText size={16} />,
  "Season Card Master": <CreditCard size={16} />,
  "Season Transaction Details": <FileText size={16} />,
  "To Be Expired Season": <Calendar size={16} />,
  "Ticket Complimentary": <FileText size={16} />,
  "NETS Collection Comparison": <FileText size={16} />,
};

const CardSection = ({ title, buttons }) => (
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-4 text-gray-700">{title}</h2>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {buttons.map((btn) => (
        <button
          key={btn}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
        >
          {buttonIcons[btn]}
          <span className="truncate">{btn}</span>
        </button>
      ))}
    </div>
  </div>
);

export default function Home() {
  return (
    <div className="p-6 bg-gray-50 min-h-[auto]">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">G.tech Carpark Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <CardSection
            title="Payment Collection"
            titleColor="text-green-500"
            buttons={[
              "Daily Settlement File",
              "Analysis of Ack/Sum file",
              "Daily Cashier Shift",
              "Daily Consolidated Summary",
            ]}
          />
          <CardSection
            title="Payment Collection Details"
            buttons={["Daily CashCard Collection"]}
          />
        </div>

        {/* Column 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <CardSection
            title="Movement Counter & Trans"
            titleColor="text-purple-500"
            buttons={[
              "Counter Daily Statistics",
              "Counter Monthly Statistics",
              "Daily Movement Details",
              "Daily Parking Duration",
            ]}
          />
          <CardSection
            title="Movement History"
            buttons={["Remote Control History", "Station Error History"]}
          />
        </div>

        {/* Column 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
          <CardSection
            title="Season Master & Details"
            titleColor="text-orange-500"
            buttons={[
              "Season Card Master",
              "Season Transaction Details",
              "To Be Expired Season",
            ]}
          />
          <CardSection
            title="Others"
            buttons={["Ticket Complimentary", "NETS Collection Comparison"]}
          />
        </div>
      </div>
    </div>
  );
}