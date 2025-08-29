import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Configuration from "./components/Configuration";
import Recommendation from "./components/Recommendation";
import Output from "./components/Output";
import Loader from "./components/Loader";
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for ~2.5s before app loads
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/recommendation" element={<Recommendation />} />
              <Route path="/output" element={<Output />} />
            </Routes>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;