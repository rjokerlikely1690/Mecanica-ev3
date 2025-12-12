import React from 'react';
import { Container, Card } from 'react-bootstrap';
import CatalogoRepuestos from '../repuestos/CatalogoRepuestos';
import './PageLayout.css';

const RepuestosPage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Catálogo de Repuestos</h1>
          <p className="page-subtitle">Control de stock e inventario</p>
        </div>
        <Card className="page-card">
          <Card.Body>
            <CatalogoRepuestos />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default RepuestosPage;

