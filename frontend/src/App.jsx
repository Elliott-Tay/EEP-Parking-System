import './App.css';
import NavBar from './components/NavBar';
import Home from './components/Home';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/PageNotFound';
import ConfigurationPage from './components/Configuration';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <NavBar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/configuration" element={<ConfigurationPage />} />
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