import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-blue-700 text-white p-4">
          <h1 className="text-xl font-bold">Curriculum Management</h1>
        </header>
        <main className="flex-grow container mx-auto px-4 py-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Welcome</h2>
            <p>The application is currently under development.</p>
          </div>
        </main>
        <footer className="bg-gray-200 p-4 text-center">
          <p>© {new Date().getFullYear()} Exhall School</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
