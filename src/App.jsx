import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Configuration from './components/Configuration';
import Recommendation from './components/Recommendation';
import Output from './components/Output';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function App() {
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