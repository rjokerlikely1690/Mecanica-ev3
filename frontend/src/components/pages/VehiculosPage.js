import React from 'react';
import { Container, Card } from 'react-bootstrap';
import HistorialVehiculos from '../vehiculos/HistorialVehiculos';
import './PageLayout.css';

const VehiculosPage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Historial de Vehículos</h1>
          <p className="page-subtitle">Base de datos de todos los vehículos</p>
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

export default VehiculosPage;

