import './App.css';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      {/* Main content area */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center">Hello world!</h1>
          <p className="mt-4 text-center">
            Welcome to the CarPark Management System. This is a simple React app.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;