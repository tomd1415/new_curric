import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CurriculumViewer from './components/CurriculumViewer';
import TermDetail from './components/TermDetail';
import Year8ComputingDetail from './components/Year8ComputingDetail';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-blue-700 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Curriculum Management</h1>
            <nav>
              <Link to="/" className="text-white hover:text-blue-200 mr-4">Home</Link>
              <Link to="/curriculum" className="text-white hover:text-blue-200 mr-4">Curriculum Viewer</Link>
              <Link to="/year8-computing" className="text-white hover:text-blue-200">Year 8 Computing</Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={
              <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-4">Welcome</h2>
                <p>The application is currently under development.</p>
              </div>
            } />
            <Route path="/curriculum" element={<CurriculumViewer />} />
            <Route path="/curriculum/:subject/:yearGroup/:term" element={<TermDetail />} />
            <Route path="/year8-computing" element={<Year8ComputingDetail />} />
          </Routes>
        </main>
        <footer className="bg-gray-200 p-4 text-center">
          <p>© {new Date().getFullYear()} Exhall School</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
