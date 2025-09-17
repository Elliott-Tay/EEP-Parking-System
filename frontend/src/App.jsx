import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/PageNotFound';
import ConfigurationPage from './components/Configuration';
import DailySettlementReport from './components/reports/paymentCollection/DailySettlementReport';
import AckSumAnalysis from './components/reports/paymentCollection/AckSum';
import DailyConsolidatedSummary from './components/reports/paymentCollection/DailyConsolidatedSummary';
import DailyCashcardCollection from './components/reports/paymentCollection/DailyCashCardCollection';
import CounterDailyStatistics from './components/reports/movementCounter/CounterDailyStatistics';
import CounterMonthlyStatistics from './components/reports/movementCounter/CounterMonthlyStatistics';
import DailyMovementDetails from './components/reports/movementCounter/DailyMovementDetail';
import DailyParkingDuration from './components/reports/movementCounter/DailyParkingDuration';
import SeasonCardMaster from './components/reports/seasonMaster/seasonCardMaster';
import SeasonTransactionDetails from './components/reports/seasonMaster/seasonTransactionDetails';
import ToBeExpiredSeason from './components/reports/seasonMaster/ToBeExpiredSeason';
import RemoteControlHistory from './components/reports/History/RemoteControlHistory';
import StationErrorHistory from './components/reports/History/StationErrorHistory';
import TicketComplimentary from './components/reports/Miscellaneous/TicketComplimentary';
import NetsCollectionComparison from './components/reports/Miscellaneous/NetsCollectionComparison';
import PublicHolidaySetup from './components/reports/systemConfiguration/holidaySetup';
import ParkingTariffConfiguration from './components/reports/systemConfiguration/parkingTariffSetup';
import SearchCheckSeason from './components/reports/systemConfiguration/searchCheckSeason';
import MovementTransaction from './components/reports/enquiry/movementTransactions';
import EntryTransaction from './components/reports/enquiry/entryTransactions';
import ExitValidTransaction from './components/reports/enquiry/exitValidTransaction';
import ExitInvalidTransactionDetail from './components/reports/enquiry/exitInvalidTransactions';
import ExitInvalidTransactionSummary from './components/reports/enquiry/exitInvalidTransactionsSummary';
import DailyComplimentaryEnquiry from './components/reports/enquiry/complimentary';
import SeasonMasterHistoryEnquiry from './components/reports/enquiry/seasonMasterHistory';
import CepasCollectionFileReport from './components/reports/enquiry/collectionFileReport';
import CepasAckResultAnalysis from './components/reports/enquiry/collectionFileAck';
import PrivateRoute from './components/auth/PrivateRoute';
import Register from "./components/auth/Register";
import ReportPage from './components/Report';
import Login from './components/auth/Login';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const protectedRoutes = [
    { path: "/configuration", element: <ConfigurationPage /> },
    { path: "/reports", element: <ReportPage /> },
    { path: "/reports/daily-settlement", element: <DailySettlementReport /> },
    { path: "/reports/ack-sum-analysis", element: <AckSumAnalysis /> },
    { path: "/reports/daily-summary", element: <DailyConsolidatedSummary /> },
    { path: "/reports/cashcard-collection", element: <DailyCashcardCollection /> },
    { path: "/reports/counter-daily", element: <CounterDailyStatistics /> },
    { path: "/reports/counter-monthly", element: <CounterMonthlyStatistics /> },
    { path: "/reports/movement-details", element: <DailyMovementDetails /> },
    { path: "/reports/parking-duration", element: <DailyParkingDuration /> },
    { path: "/reports/season-master", element: <SeasonCardMaster /> },
    { path: "/reports/season-transactions", element: <SeasonTransactionDetails /> },
    { path: "/reports/expiring-season", element: <ToBeExpiredSeason /> },
    { path: "/reports/remote-control-history", element: <RemoteControlHistory /> },
    { path: "/reports/station-errors", element: <StationErrorHistory /> },
    { path: "/reports/ticket-complimentary", element: <TicketComplimentary /> },
    { path: "/reports/nets-comparison", element: <NetsCollectionComparison /> },
    { path: "/config/holiday-setup", element: <PublicHolidaySetup /> },
    { path: "/config/parking-tariff", element: <ParkingTariffConfiguration /> },
    { path: "/config/check-search-season", element: <SearchCheckSeason /> },
    { path: "/enquiry/movement-transaction", element: <MovementTransaction /> },
    { path: "/enquiry/entry-transaction", element: <EntryTransaction /> },
    { path: "/enquiry/exit-valid-transaction", element: <ExitValidTransaction /> },
    { path: "/enquiry/exit-invalid-detail", element: <ExitInvalidTransactionDetail /> },
    { path: "/enquiry/exit-invalid-summary", element: <ExitInvalidTransactionSummary /> },
    { path: "/enquiry/complimentary", element: <DailyComplimentaryEnquiry /> },
    { path: "/enquiry/season-master-history", element: <SeasonMasterHistoryEnquiry /> },
    { path: "/enquiry/collection-file-report", element: <CepasCollectionFileReport /> },
    { path: "/enquiry/collection-file-ack-sum", element: <CepasAckResultAnalysis /> },
  ];

  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={<PrivateRoute>{element}</PrivateRoute>}
                />
              ))}

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
