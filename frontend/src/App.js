import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import GestionServicios from './components/servicios/GestionServicios';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './components/landing/Landing';
import AgendaPage from './components/pages/AgendaPage';
import VehiculosPage from './components/pages/VehiculosPage';
import RepuestosPage from './components/pages/RepuestosPage';
import MensajesPage from './components/pages/MensajesPage';
import TurnosClientePage from './components/pages/TurnosClientePage';
import VehiculosClientePage from './components/pages/VehiculosClientePage';
import ServiciosClientePage from './components/pages/ServiciosClientePage';
import ReservaServicio from './components/reserva/ReservaServicio';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/agenda"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AgendaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehiculos"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <VehiculosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/repuestos"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <RepuestosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mensajes"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <MensajesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/servicios"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <GestionServicios />
                </ProtectedRoute>
              }
            />
            {/* Cliente Routes */}
            <Route
              path="/turnos"
              element={
                <ProtectedRoute>
                  <TurnosClientePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehiculos-cliente"
              element={
                <ProtectedRoute>
                  <VehiculosClientePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/servicios-cliente"
              element={
                <ProtectedRoute>
                  <ServiciosClientePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservar/:servicioId"
              element={
                <ProtectedRoute requireCliente={true}>
                  <ReservaServicio />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
