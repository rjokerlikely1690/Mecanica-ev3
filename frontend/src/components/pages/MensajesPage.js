import React from 'react';
import { Container, Card } from 'react-bootstrap';
import TablonMensajes from '../mensajes/TablonMensajes';
import './PageLayout.css';

const MensajesPage = () => {
  return (
    <div className="page-layout">
      <Container className="page-container">
        <div className="page-header">
          <h1>Tablón Interno</h1>
          <p className="page-subtitle">Comunicación con el equipo</p>
        </div>
        <Card className="page-card">
          <Card.Body>
            <TablonMensajes />
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default MensajesPage;

