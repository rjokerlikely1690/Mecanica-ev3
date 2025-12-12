import React from 'react';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import AgendaTurnos from '../agenda/AgendaTurnos';
import HistorialVehiculos from '../vehiculos/HistorialVehiculos';
import ListaServicios from '../servicios/ListaServicios';
import './DashboardCliente.css';

const DashboardCliente = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-cliente">
      <div className="dashboard-cliente-header">
        <Container>
          <Row>
            <Col>
              <div className="welcome-section">
                <h1>Bienvenido, {user?.nombre}</h1>
                <p className="welcome-subtitle">Gestiona tus vehículos y turnos desde aquí</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="dashboard-cliente-content">
        <Row className="mb-4">
          <Col lg={8}>
            <Card id="section-turnos" className="section-card">
              <Card.Header className="section-header">
                <h3>Mis Turnos</h3>
                <p className="section-subtitle">Agenda y gestiona tus citas en el taller</p>
              </Card.Header>
              <Card.Body>
                <AgendaTurnos />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card id="section-vehiculos" className="section-card">
              <Card.Header className="section-header">
                <h3>Mis Vehículos</h3>
                <p className="section-subtitle">Historial y mantenimiento</p>
              </Card.Header>
              <Card.Body>
                <HistorialVehiculos />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card id="section-servicios" className="section-card">
              <Card.Header className="section-header">
                <h3>Servicios Disponibles</h3>
                <p className="section-subtitle">Consulta los servicios que ofrecemos</p>
              </Card.Header>
              <Card.Body>
                <ListaServicios />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardCliente;

