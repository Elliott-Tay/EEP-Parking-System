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
import SeasonHolderMaster from './components/reports/systemConfiguration/seasonMaster';
import SeasonUpdate from './components/reports/systemConfiguration/seasonUpdate';
import MultipleSeasonRegister from './components/reports/systemConfiguration/multipleSeasonRegister';
import ChangeSeasonIU from './components/reports/systemConfiguration/changeSeasonNo';
import SearchCheckSeason from './components/reports/systemConfiguration/searchCheckSeason';
import MovementTransaction from './components/reports/enquiry/movementTransactions';
import EntryTransaction from './components/reports/enquiry/entryTransactions';
import ExitValidTransaction from './components/reports/enquiry/exitValidTransaction';
import ExitInvalidTransactionDetail from './components/reports/enquiry/exitInvalidTransactions';
import DailyComplimentaryEnquiry from './components/reports/enquiry/complimentary';
import DailyRedemptionEnquiry from './components/reports/enquiry/redemption';
import SeasonMasterHistoryEnquiry from './components/reports/enquiry/seasonMasterHistory';
import CepasCollectionFileReport from './components/reports/enquiry/collectionFileReport';
import CepasAckResultAnalysis from './components/reports/enquiry/collectionFileAck';
import LcscCashcardComparison from './components/reports/enquiry/LCSCCollection';
import HourlyMaxOccupancyReport from './components/reports/enquiry/HourlyMaxOccupancy';
import TailgatingReport from './components/reports/enquiry/tailGatingReport';
import IUFrequencyReport from './components/reports/enquiry/IUFrequency';
import VehiclesParked72HoursReport from './components/reports/enquiry/Vehicles72';
import EPSPerformanceReport from './components/reports/enquiry/EPSPerformance';
import UPOSCollectionFileReport from './components/reports/enquiry/UPOSCollectionFile';
import UPOSCollectionReport from './components/reports/enquiry/UPOSCollectionReport';
import VCCWhitelistReport from './components/reports/VCC/VCCWhitelist';
import VCCExitTransaction from './components/reports/VCC/VCCExitTransaction';
import VCCSettlementFileReport from './components/reports/VCC/VCCSettlementFile';
import VCCCollectionComparison from './components/reports/VCC/VCCCollectionComparison';
import EZPayWhitelistReport from './components/reports/VCC/EZPayWhitelist';
import EZPayExitTransaction from './components/reports/VCC/EZPayExitTransaction';
import EZPayCollectionFileReport from './components/reports/VCC/EZPayCollectionFile';
import EZPayCollectionComparison from './components/reports/VCC/EZPayCollectionComparison';
import OutstandingSettlementFile from './components/reports/outstanding/outstandingSettlementFile';
import OutstandingAcknowledgeFile from './components/reports/outstanding/outstandingAcknowledgement';
import OutstandingSummaryFile from './components/reports/outstanding/outstandingSummary';
import OutstandingLTACollectionFile from './components/reports/outstanding/LTACollectionFile';
import OutstandingLTAAcknowledgeFile from './components/reports/outstanding/LTAAcknowledgement';
import OutstandingLTAResultFile from './components/reports/outstanding/LTAResultFile';
import OutstandingMovementTransaction from './components/reports/outstanding/movementTransaction';
import AccessControl from './components/systemMaintenance/accessControl';
import ChangePassword from './components/systemMaintenance/changePassword';
import SystemFunctionAudit from './components/systemMaintenance/systemFunctionAudit';
import ViewLogLogin from './components/systemMaintenance/viewLog';
import TariffSetupCarVan from './components/reports/systemConfiguration/parkingTariff/edit/CVTariff';
import TariffSetupLorry from './components/reports/systemConfiguration/parkingTariff/edit/LorryTariff';
import TariffSetupMotorcycle from './components/reports/systemConfiguration/parkingTariff/edit/MCycleTariff';
import TariffSetupDaySeason from './components/reports/systemConfiguration/parkingTariff/edit/daySeason';
import TariffSetupNightSeason from './components/reports/systemConfiguration/parkingTariff/edit/nightSeason';
import TariffSetupCarVanB from './components/reports/systemConfiguration/parkingTariff/edit/CVTariffB';
import TariffSetupLorryB from './components/reports/systemConfiguration/parkingTariff/edit/LorryTariffB';
import TariffSetupMotorcycleB from './components/reports/systemConfiguration/parkingTariff/edit/MCycleTariffB';
import TariffSetupDaySeasonB from './components/reports/systemConfiguration/parkingTariff/edit/daySeasonB';
import TariffSetupNightSeasonB from './components/reports/systemConfiguration/parkingTariff/edit/nightSeasonB';
import TariffSetupCarVanView from './components/reports/systemConfiguration/parkingTariff/view/CVTariffView';
import TariffSetupLorryView from './components/reports/systemConfiguration/parkingTariff/view/LorryTariffView';
import TariffSetupMotorcycleView from './components/reports/systemConfiguration/parkingTariff/view/MCycleView';
import TariffSetupDaySeasonView from './components/reports/systemConfiguration/parkingTariff/view/daySeasonView';
import TariffSetupNightSeasonView from './components/reports/systemConfiguration/parkingTariff/view/nightSeasonView';
import TariffSetupCarVanBView from './components/reports/systemConfiguration/parkingTariff/view/CVTariffBView';
import TariffSetupLorryBView from './components/reports/systemConfiguration/parkingTariff/view/LorryTariffBView';
import TariffSetupMotorcycleBView from './components/reports/systemConfiguration/parkingTariff/view/MCycleBView';
import TariffSetupDaySeasonBView from './components/reports/systemConfiguration/parkingTariff/view/daySeasonBView';
import TariffSetupNightSeasonBView from './components/reports/systemConfiguration/parkingTariff/view/nightSeasonBView';
import PrivateRoute from './components/auth/PrivateRoute';
import ReportPage from './components/Report';
import Login from './components/auth/Login';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const protectedRoutes = [
    { path: "/configuration", element: <ConfigurationPage />, requiredRole: "admin" },
    { path: "/reports", element: <ReportPage /> },
    { path: "/reports/daily-settlement", element: <DailySettlementReport /> },
    { path: "/reports/ack-sum-analysis", element: <AckSumAnalysis /> },
    { path: "/reports/daily-summary", element: <DailyConsolidatedSummary /> },
    { path: "/reports/cashcard-collection", element: <DailyCashcardCollection /> },
    { path: "/reports/counter-daily", element: <CounterDailyStatistics /> },
    { path: "/reports/counter-monthly", element: <CounterMonthlyStatistics /> },
    { path: "/reports/movement-details", element: <DailyMovementDetails /> },
    { path: "/reports/parking-duration", element: <DailyParkingDuration /> },
    { path: "/reports/season-master", element: <SeasonCardMaster />, requiredRole: "admin"},
    { path: "/reports/season-transactions", element: <SeasonTransactionDetails /> },
    { path: "/reports/expiring-season", element: <ToBeExpiredSeason /> },
    { path: "/reports/remote-control-history", element: <RemoteControlHistory />, requiredRole: "admin" },
    { path: "/reports/station-errors", element: <StationErrorHistory /> },
    { path: "/reports/ticket-complimentary", element: <TicketComplimentary /> },
    { path: "/reports/nets-comparison", element: <NetsCollectionComparison /> },
    { path: "/config/holiday-setup", element: <PublicHolidaySetup /> },
    { path: "/config/parking-tariff", element: <ParkingTariffConfiguration /> },
    { path: "/config/season-master", element: <SeasonHolderMaster /> },
    { path: "/config/season-update", element: <SeasonUpdate /> },
    { path: "/config/change-season-no", element: <ChangeSeasonIU /> },
    { path: "/config/multiple-season-register", element: <MultipleSeasonRegister /> },
    { path: "/config/check-search-season", element: <SearchCheckSeason /> },
    { path: "/enquiry/movement-transaction", element: <MovementTransaction /> },
    { path: "/enquiry/entry-transaction", element: <EntryTransaction /> },
    { path: "/enquiry/exit-valid-transaction", element: <ExitValidTransaction /> },
    { path: "/enquiry/exit-invalid-detail", element: <ExitInvalidTransactionDetail /> },
    { path: "/enquiry/complimentary", element: <DailyComplimentaryEnquiry /> },
    { path: "/enquiry/redemption", element: <DailyRedemptionEnquiry />},
    { path: "/enquiry/season-master-history", element: <SeasonMasterHistoryEnquiry /> },
    { path: "/enquiry/collection-file-report", element: <CepasCollectionFileReport /> },
    { path: "/enquiry/collection-file-ack-sum", element: <CepasAckResultAnalysis /> },
    { path: "/enquiry/lcsc-collection-comparison", element: <LcscCashcardComparison /> },
    { path: "/enquiry/hourly-max-occupancy", element: <HourlyMaxOccupancyReport /> },
    { path: "/enquiry/iu-frequency-report", element: <IUFrequencyReport /> },
    { path: "/enquiry/tailgate-report", element: <TailgatingReport /> },
    { path: "/enquiry/vehicles-72-hours", element: <VehiclesParked72HoursReport /> },
    { path: "/enquiry/eps-performance", element: <EPSPerformanceReport /> },
    { path: "/enquiry/upos-collection-file", element: <UPOSCollectionFileReport /> },
    { path: "/enquiry/upos-collection-report", element: <UPOSCollectionReport /> },
    { path: "/vcc-ezpay/vcc-whitelist", element: <VCCWhitelistReport /> },
    { path: "/vcc-ezpay/vcc-exit-transaction", element: <VCCExitTransaction /> },
    { path: "/vcc-ezpay/vcc-settlement-file", element: <VCCSettlementFileReport /> },
    { path: "/vcc-ezpay/vcc-collection-comparison", element: <VCCCollectionComparison /> },
    { path: "/vcc-ezpay/ezp-whitelist", element: <EZPayWhitelistReport /> },
    { path: "/vcc-ezpay/ezp-exit-transaction", element: <EZPayExitTransaction /> },
    { path: "/vcc-ezpay/ezp-settlement-file", element: <EZPayCollectionFileReport /> },
    { path: "/vcc-ezpay/ezp-collection-comparison", element: <EZPayCollectionComparison /> },
    { path: "/outstanding/settlement-file", element: <OutstandingSettlementFile /> },
    { path: "/outstanding/acknowledge-file", element: <OutstandingAcknowledgeFile /> },
    { path: "/outstanding/summary-file", element: <OutstandingSummaryFile /> },
    { path: "/outstanding/lta-collection-file", element: <OutstandingLTACollectionFile /> },
    { path: "/outstanding/lta-acknowledge-file", element: <OutstandingLTAAcknowledgeFile /> },
    { path: "/outstanding/lta-result-file", element: <OutstandingLTAResultFile /> },
    { path: "/outstanding/movement-transaction", element: <OutstandingMovementTransaction /> },
    { path: "/maintenance/access-control", element: <AccessControl />, requiredRole: "admin" },
    { path: "/maintenance/change-password", element: <ChangePassword /> },
    { path: "/maintenance/function-audit", element: <SystemFunctionAudit /> },
    { path: "/maintenance/view-log", element: <ViewLogLogin /> },
    { path: "/tariff/edit/car-van", element: <TariffSetupCarVan /> },
    { path: "/tariff/edit/lorry", element: <TariffSetupLorry /> },
    { path: "/tariff/edit/mcycle", element: <TariffSetupMotorcycle /> },
    { path: "/tariff/edit/day-season", element: <TariffSetupDaySeason /> },
    { path: "/tariff/edit/night-season", element: <TariffSetupNightSeason /> },
    { path: "/tariff/edit/car-van-b", element: <TariffSetupCarVanB /> },
    { path: "/tariff/edit/lorry-b", element: <TariffSetupLorryB /> },
    { path: "/tariff/edit/mcycle-b", element: <TariffSetupMotorcycleB /> },
    { path: "/tariff/edit/day-season-b", element: <TariffSetupDaySeasonB /> },
    { path: "/tariff/edit/night-season-b", element: <TariffSetupNightSeasonB /> },
    { path: "/tariff/view/car-van", element: <TariffSetupCarVanView /> },
    { path: "/tariff/view/lorry", element: <TariffSetupLorryView /> },
    { path: "/tariff/view/mcycle", element: <TariffSetupMotorcycleView /> },
    { path: "/tariff/view/day-season", element: <TariffSetupDaySeasonView /> },
    { path: "/tariff/view/night-season", element: <TariffSetupNightSeasonView /> },
    { path: "/tariff/view/car-van-b", element: <TariffSetupCarVanBView /> },
    { path: "/tariff/view/lorry-b", element: <TariffSetupLorryBView /> },
    { path: "/tariff/view/mcycle-b", element: <TariffSetupMotorcycleBView /> },
    { path: "/tariff/view/day-season-b", element: <TariffSetupDaySeasonBView /> },
    { path: "/tariff/view/night-season-b", element: <TariffSetupNightSeasonBView /> },
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
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              {protectedRoutes.map(({ path, element, requiredRole }) => (
                <Route
                  key={path}
                  path={path}
                  element={<PrivateRoute requiredRole={requiredRole}>{element}</PrivateRoute>}
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
