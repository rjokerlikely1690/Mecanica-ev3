import React from 'react';
import { Container, Card } from 'react-bootstrap';
import HistorialVehiculos from '../vehiculos/HistorialVehiculos';
import './PageLayout.css';

const VehiculosClientePage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Mis Vehículos</h1>
          <p className="page-subtitle">Historial y mantenimiento</p>
        </div>
        <Card className="page-card">
          <Card.Body>
            <HistorialVehiculos />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default VehiculosClientePage;

