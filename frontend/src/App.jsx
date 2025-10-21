import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/PageNotFound';
import PrivateRoute from './components/auth/PrivateRoute';
import ReportPage from './components/Report';
import Login from './components/auth/Login';
import { lazy, Suspense } from 'react';
import Skeleton from './components/Skeleton';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

  // Lazy Load Report Components
  const ConfigurationPage = lazy(() => import('./components/Configuration'));
  const DailySettlementReport = lazy(() => import('./components/reports/paymentCollection/DailySettlementReport'));
  const AckSumAnalysis = lazy(() => import('./components/reports/paymentCollection/AckSum'));
  const DailyConsolidatedSummary = lazy(() => import('./components/reports/paymentCollection/DailyConsolidatedSummary'));
  const DailyCashcardCollection = lazy(() => import('./components/reports/paymentCollection/DailyCashCardCollection'));
  const CounterDailyStatistics = lazy(() => import('./components/reports/movementCounter/CounterDailyStatistics'));
  const CounterMonthlyStatistics = lazy(() => import('./components/reports/movementCounter/CounterMonthlyStatistics'));
  const DailyMovementDetails = lazy(() => import('./components/reports/movementCounter/DailyMovementDetail'));
  const DailyParkingDuration = lazy(() => import('./components/reports/movementCounter/DailyParkingDuration'));
  const SeasonCardMaster = lazy(() => import('./components/reports/seasonMaster/seasonCardMaster'));
  const SeasonTransactionDetails = lazy(() => import('./components/reports/seasonMaster/seasonTransactionDetails'));
  const ToBeExpiredSeason = lazy(() => import('./components/reports/seasonMaster/ToBeExpiredSeason'));
  const RemoteControlHistory = lazy(() => import('./components/reports/History/RemoteControlHistory'));
  const StationErrorHistory = lazy(() => import('./components/reports/History/StationErrorHistory'));
  const TicketComplimentary = lazy(() => import('./components/reports/Miscellaneous/TicketComplimentary'));
  const NetsCollectionComparison = lazy(() => import('./components/reports/Miscellaneous/NetsCollectionComparison'));
  const PublicHolidaySetup = lazy(() => import('./components/reports/systemConfiguration/holidaySetup'));
  const ParkingTariffConfiguration = lazy(() => import('./components/reports/systemConfiguration/parkingTariffSetup'));
  const SeasonHolderMaster = lazy(() => import('./components/reports/systemConfiguration/seasonMaster'));
  const SeasonUpdate = lazy(() => import('./components/reports/systemConfiguration/seasonUpdate'));
  const MultipleSeasonRegister = lazy(() => import('./components/reports/systemConfiguration/multipleSeasonRegister'));
  const ChangeSeasonIU = lazy(() => import('./components/reports/systemConfiguration/changeSeasonNo'));
  const SearchCheckSeason = lazy(() => import('./components/reports/systemConfiguration/searchCheckSeason'));
  const MovementTransaction = lazy(() => import('./components/reports/enquiry/movementTransactions'));
  const EntryTransaction = lazy(() => import('./components/reports/enquiry/entryTransactions'));
  const ExitValidTransaction = lazy(() => import('./components/reports/enquiry/exitValidTransaction'));
  const ExitInvalidTransactionDetail = lazy(() => import('./components/reports/enquiry/exitInvalidTransactions'));
  const DailyComplimentaryEnquiry = lazy(() => import('./components/reports/enquiry/complimentary'));
  const DailyRedemptionEnquiry = lazy(() => import('./components/reports/enquiry/redemption'));
  const SeasonMasterHistoryEnquiry = lazy(() => import('./components/reports/enquiry/seasonMasterHistory'));
  const CepasCollectionFileReport = lazy(() => import('./components/reports/enquiry/collectionFileReport'));
  const CepasAckResultAnalysis = lazy(() => import('./components/reports/enquiry/collectionFileAck'));
  const LcscCashcardComparison = lazy(() => import('./components/reports/enquiry/LCSCCollection'));
  const HourlyMaxOccupancyReport = lazy(() => import('./components/reports/enquiry/HourlyMaxOccupancy'));
  const TailgatingReport = lazy(() => import('./components/reports/enquiry/tailGatingReport'));
  const IUFrequencyReport = lazy(() => import('./components/reports/enquiry/IUFrequency'));
  const VehiclesParked72HoursReport = lazy(() => import('./components/reports/enquiry/Vehicles72'));
  const EPSPerformanceReport = lazy(() => import('./components/reports/enquiry/EPSPerformance'));
  const UPOSCollectionFileReport = lazy(() => import('./components/reports/enquiry/UPOSCollectionFile'));
  const UPOSCollectionReport = lazy(() => import('./components/reports/enquiry/UPOSCollectionReport'));
  const VCCWhitelistReport = lazy(() => import('./components/reports/VCC/VCCWhitelist'));
  const VCCExitTransaction = lazy(() => import('./components/reports/VCC/VCCExitTransaction'));
  const VCCSettlementFileReport = lazy(() => import('./components/reports/VCC/VCCSettlementFile'));
  const VCCCollectionComparison = lazy(() => import('./components/reports/VCC/VCCCollectionComparison'));
  const EZPayWhitelistReport = lazy(() => import('./components/reports/VCC/EZPayWhitelist'));
  const EZPayExitTransaction = lazy(() => import('./components/reports/VCC/EZPayExitTransaction'));
  const EZPayCollectionFileReport = lazy(() => import('./components/reports/VCC/EZPayCollectionFile'));
  const EZPayCollectionComparison = lazy(() => import('./components/reports/VCC/EZPayCollectionComparison'));
  const OutstandingSettlementFile = lazy(() => import('./components/reports/outstanding/outstandingSettlementFile'));
  const OutstandingAcknowledgeFile = lazy(() => import('./components/reports/outstanding/outstandingAcknowledgement'));
  const OutstandingSummaryFile = lazy(() => import('./components/reports/outstanding/outstandingSummary'));
  const OutstandingLTACollectionFile = lazy(() => import('./components/reports/outstanding/LTACollectionFile'));
  const OutstandingLTAAcknowledgeFile = lazy(() => import('./components/reports/outstanding/LTAAcknowledgement'));
  const OutstandingLTAResultFile = lazy(() => import('./components/reports/outstanding/LTAResultFile'));
  const OutstandingMovementTransaction = lazy(() => import('./components/reports/outstanding/movementTransaction'));
  const AccessControl = lazy(() => import('./components/systemMaintenance/accessControl'));
  const ChangePassword = lazy(() => import('./components/systemMaintenance/changePassword'));
  const SystemFunctionAudit = lazy(() => import('./components/systemMaintenance/systemFunctionAudit'));
  const ViewLogLogin = lazy(() => import('./components/systemMaintenance/viewLog'));

  // Lazy Load Edit Tariff
  const TariffSetupCarVan = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/CVTariff'));
  const TariffSetupLorry = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/LorryTariff'));
  const TariffSetupMotorcycle = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/MCycleTariff'));
  const TariffSetupDaySeason = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/daySeason'));
  const TariffSetupNightSeason = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/nightSeason'));
  const TariffSetupCarVanB = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/CVTariffB'));
  const TariffSetupLorryB = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/LorryTariffB'));
  const TariffSetupMotorcycleB = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/MCycleTariffB'));
  const TariffSetupDaySeasonB = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/daySeasonB'));
  const TariffSetupNightSeasonB = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/edit/nightSeasonB'));

  // Lazy Load View Tariff
  const TariffSetupCarVanView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/CVTariffView'));
  const TariffSetupLorryView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/LorryTariffView'));
  const TariffSetupMotorcycleView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/MCycleView'));
  const TariffSetupDaySeasonView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/daySeasonView'));
  const TariffSetupNightSeasonView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/nightSeasonView'));
  const TariffSetupCarVanBView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/CVTariffBView'));
  const TariffSetupLorryBView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/LorryTariffBView'));
  const TariffSetupMotorcycleBView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/MCycleBView'));
  const TariffSetupDaySeasonBView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/daySeasonBView'));
  const TariffSetupNightSeasonBView = lazy(() => import('./components/reports/systemConfiguration/parkingTariff/view/nightSeasonBView'));

  const TariffImageUpload = lazy(() => import('./components/reports/systemConfiguration/tariffImageUpload'));

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
    { path: "/config/tariff-image-upload", element: <TariffImageUpload />},
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
        <Suspense
          fallback={
            <div className="p-4 space-y-4">
              <Skeleton height="40px" width="60%" />
              <Skeleton height="30px" width="80%" />
              <Skeleton height="200px" width="100%" />
            </div>
          }
        >
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
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
