import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Curriculum Components
import Dashboard from './components/dashboard/Dashboard';
import CurriculumTable from './components/curriculum/CurriculumTable';
import CurriculumDetail from './components/curriculum/CurriculumDetail';
import CurriculumEdit from './components/curriculum/CurriculumEdit';
import SubjectView from './components/curriculum/SubjectView';
import YearGroupView from './components/curriculum/YearGroupView';

// Admin Components
import UserManagement from './components/admin/UserManagement';
import SubjectManagement from './components/admin/SubjectManagement';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Alert />
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/curriculum" element={<CurriculumTable />} />
            <Route path="/curriculum/:id" element={<CurriculumDetail />} />
            <Route path="/curriculum/edit/:id" element={<PrivateRoute component={CurriculumEdit} />} />
            <Route path="/subject/:id" element={<SubjectView />} />
            <Route path="/year-group/:id" element={<YearGroupView />} />
            <Route path="/admin/users" element={<AdminRoute component={UserManagement} />} />
            <Route path="/admin/subjects" element={<AdminRoute component={SubjectManagement} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
