import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './contexts/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Employees from './pages/Employees.jsx'
import Projects from './pages/Projects.jsx'
import Tasks from './pages/Tasks.jsx'
import Activities from './pages/Activities.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'
import Profile from './pages/Profile.jsx'
import Notifications from './pages/Notifications.jsx'
import Services from './pages/Services.jsx'
import CreateRVM from './pages/CreateRVM.jsx'
import EditRVM from './pages/EditRVM.jsx'

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Navbar />
    {children}
  </ProtectedRoute>
)

function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedLayout>
                  <Dashboard />
                </ProtectedLayout>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedLayout>
                  <Employees />
                </ProtectedLayout>
              }
            />
            <Route
              path="/projects"
              element={
                <ProtectedLayout>
                  <Projects />
                </ProtectedLayout>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedLayout>
                  <Tasks />
                </ProtectedLayout>
              }
            />
            <Route
              path="/activities"
              element={
                <ProtectedLayout>
                  <Activities />
                </ProtectedLayout>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedLayout>
                  <Reports />
                </ProtectedLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedLayout>
                  <Settings />
                </ProtectedLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedLayout>
                  <Profile />
                </ProtectedLayout>
              }
            />
            <Route
              path="/services"
              element={
                <ProtectedLayout>
                  <Services />
                </ProtectedLayout>
              }
            />
            <Route
              path="/services/create"
              element={
                <ProtectedLayout>
                  <CreateRVM />
                </ProtectedLayout>
              }
            />
            <Route
              path="/services/edit/:id"
              element={
                <ProtectedLayout>
                  <EditRVM />
                </ProtectedLayout>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedLayout>
                  <Notifications />
                </ProtectedLayout>
              }
            />
            {/* Catch all unmatched routes and redirect to dashboard if authenticated, otherwise to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App