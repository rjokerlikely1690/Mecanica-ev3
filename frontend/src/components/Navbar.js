import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  return (
    <BootstrapNavbar 
      bg="dark" 
      variant="dark" 
      expand="lg"
      className="custom-navbar"
    >
      <Container>
        <BootstrapNavbar.Brand 
          as={Link} 
          to="/" 
          className="navbar-brand-custom"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          AutoMax
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className="nav-link-custom"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Inicio
            </Nav.Link>
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className="nav-link-custom"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/dashboard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Dashboard
                </Nav.Link>
                {isAdmin() ? (
                  <>
                    <Nav.Link as={Link} to="/agenda" className="nav-link-custom">
                      Agenda
                    </Nav.Link>
                    <Nav.Link as={Link} to="/vehiculos" className="nav-link-custom">
                      Vehículos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/repuestos" className="nav-link-custom">
                      Repuestos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/mensajes" className="nav-link-custom">
                      Mensajes
                    </Nav.Link>
                    <Nav.Link as={Link} to="/servicios" className="nav-link-custom">
                      Servicios
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/turnos" className="nav-link-custom">
                      Mis Turnos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/vehiculos-cliente" className="nav-link-custom">
                      Mis Vehículos
                    </Nav.Link>
                    <Nav.Link as={Link} to="/servicios-cliente" className="nav-link-custom">
                      Servicios
                    </Nav.Link>
                  </>
                )}
              </>
            ) : null}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <span className="navbar-user-name">{user?.nombre}</span>
                <Button variant="outline-light" onClick={handleLogout} className="logout-btn">
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="nav-link-custom">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="nav-link-custom">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;

