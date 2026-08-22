import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';

// Seeker Protected Pages
import SeekerDashboard from './pages/seeker/Dashboard';
import SeekerProfile from './pages/seeker/Profile';
import SeekerApplications from './pages/seeker/Applications';
import SeekerRecommendations from './pages/seeker/Recommendations';
import SavedJobs from './pages/seeker/SavedJobs';
import SeekerInterviews from './pages/seeker/Interviews';

// Recruiter Protected Pages
import RecruiterDashboard from './pages/recruiter/Dashboard';
import CompanyProfile from './pages/recruiter/Company';
import CreateJob from './pages/recruiter/CreateJob';
import JobApplicants from './pages/recruiter/Applicants';
import RecruiterInterviews from './pages/recruiter/Interviews';

// Admin Protected Pages
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <MainLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Seeker Guards */}
            <Route
              path="/seeker/dashboard"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/profile"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/applications"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/recommendations"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerRecommendations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/saved-jobs"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SavedJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seeker/interviews"
              element={
                <ProtectedRoute allowedRoles={['seeker']}>
                  <SeekerInterviews />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Guards */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/company"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <CompanyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/create"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <CreateJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:jobId/applicants"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <JobApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/interviews"
              element={
                <ProtectedRoute allowedRoles={['recruiter']}>
                  <RecruiterInterviews />
                </ProtectedRoute>
              }
            />

            {/* Admin Guards */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
