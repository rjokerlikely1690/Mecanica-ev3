import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Form, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { servicioService, ordenService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import CalendarioReserva from './CalendarioReserva';
import './ReservaServicio.css';

const ReservaServicio = () => {
  const { servicioId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paso, setPaso] = useState(1); // 1: Calendario, 2: Pago, 3: Confirmación
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [metodoPago, setMetodoPago] = useState('');
  const [notas, setNotas] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [ordenCreada, setOrdenCreada] = useState(null);

  useEffect(() => {
    loadServicio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicioId]);

  const loadServicio = async () => {
    try {
      setLoading(true);
      const data = await servicioService.getById(servicioId);
      setServicio(data);
      setError('');
    } catch (err) {
      setError('Error al cargar el servicio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFechaSeleccionada = (fecha) => {
    setFechaSeleccionada(fecha);
  };

  const handleHoraSeleccionada = (hora) => {
    setHoraSeleccionada(hora);
  };

  const continuarAPago = () => {
    if (fechaSeleccionada && horaSeleccionada) {
      setPaso(2);
    } else {
      setError('Por favor selecciona una fecha y hora');
    }
  };

  const procesarPago = async () => {
    if (!metodoPago) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    try {
      setProcesando(true);
      setError('');

      const fechaFormato = fechaSeleccionada.toISOString().split('T')[0];

      const ordenData = {
        clienteNombre: user.nombre,
        clienteEmail: user.email,
        servicioNombre: servicio.nombre,
        precio: servicio.precio,
        fechaTurno: fechaFormato,
        horaTurno: horaSeleccionada,
        notas: notas,
        metodoPago: metodoPago
      };

      const orden = await ordenService.create(ordenData);
      setOrdenCreada(orden);
      setPaso(3);
    } catch (err) {
      setError('Error al procesar el pago. Por favor intenta nuevamente.');
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <p>Cargando servicio...</p>
      </Container>
    );
  }

  if (!servicio) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">Servicio no encontrado</Alert>
        <Button onClick={() => navigate('/servicios-cliente')}>Volver a servicios</Button>
      </Container>
    );
  }

  return (
    <Container className="reserva-servicio">
      <div className="reserva-header">
        <h1>Reservar Servicio</h1>
        <p className="reserva-subtitle">{servicio.nombre}</p>
      </div>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      <Row>
        <Col lg={8}>
          {paso === 1 && (
            <div>
              <h3 className="mb-4">Selecciona fecha y hora</h3>
              <CalendarioReserva
                fechaSeleccionada={fechaSeleccionada}
                onFechaSeleccionada={handleFechaSeleccionada}
                onHoraSeleccionada={handleHoraSeleccionada}
              />
              {fechaSeleccionada && horaSeleccionada && (
                <div className="mt-4 text-center">
                  <Button variant="primary" size="lg" onClick={continuarAPago}>
                    Continuar al pago
                  </Button>
                </div>
              )}
            </div>
          )}

          {paso === 2 && (
            <Card className="pago-card">
              <Card.Header>
                <h3>Información de pago</h3>
              </Card.Header>
              <Card.Body>
                <div className="resumen-reserva mb-4">
                  <h5>Resumen de tu reserva</h5>
                  <div className="resumen-item">
                    <span>Servicio:</span>
                    <strong>{servicio.nombre}</strong>
                  </div>
                  <div className="resumen-item">
                    <span>Fecha:</span>
                    <strong>{fechaSeleccionada.toLocaleDateString('es-CL', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</strong>
                  </div>
                  <div className="resumen-item">
                    <span>Hora:</span>
                    <strong>{horaSeleccionada}</strong>
                  </div>
                  <div className="resumen-item">
                    <span>Precio:</span>
                    <strong className="precio-total">{formatPrice(servicio.precio)}</strong>
                  </div>
                </div>

                <Form.Group className="mb-4">
                  <Form.Label>Método de pago</Form.Label>
                  <Form.Select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="">Selecciona un método de pago</option>
                    <option value="TARJETA">Tarjeta de crédito/débito</option>
                    <option value="TRANSFERENCIA">Transferencia bancaria</option>
                    <option value="EFECTIVO">Efectivo (en el taller)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Notas adicionales (opcional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Información adicional sobre tu vehículo o el servicio..."
                  />
                </Form.Group>

                <div className="botones-pago">
                  <Button variant="outline-secondary" onClick={() => setPaso(1)}>
                    Volver
                  </Button>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={procesarPago}
                    disabled={procesando || !metodoPago}
                  >
                    {procesando ? 'Procesando...' : 'Confirmar y pagar'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {paso === 3 && ordenCreada && (
            <Card className="confirmacion-card">
              <Card.Body className="text-center">
                <div className="confirmacion-icon">✓</div>
                <h2 className="mt-3">¡Reserva confirmada!</h2>
                <p className="text-muted mb-4">
                  Tu orden ha sido creada exitosamente y el turno ha sido agendado.
                </p>
                
                <div className="detalles-orden">
                  <h5>Detalles de tu orden</h5>
                  <div className="detalle-item">
                    <span>Número de orden:</span>
                    <strong>{ordenCreada.id}</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Servicio:</span>
                    <strong>{ordenCreada.servicioNombre}</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Fecha:</span>
                    <strong>{new Date(ordenCreada.fechaTurno).toLocaleDateString('es-CL')}</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Hora:</span>
                    <strong>{ordenCreada.horaTurno}</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Total pagado:</span>
                    <strong>{formatPrice(ordenCreada.precio)}</strong>
                  </div>
                  <div className="detalle-item">
                    <span>Estado:</span>
                    <Badge bg="success">{ordenCreada.estadoPago}</Badge>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="primary" onClick={() => navigate('/turnos')}>
                    Ver mis turnos
                  </Button>
                  <Button variant="outline-secondary" className="ms-2" onClick={() => navigate('/servicios-cliente')}>
                    Reservar otro servicio
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>

        <Col lg={4}>
          <Card className="info-servicio-card">
            <Card.Header>
              <h5>Detalles del servicio</h5>
            </Card.Header>
            <Card.Body>
              <h4>{servicio.nombre}</h4>
              <p className="text-muted">{servicio.descripcion || 'Sin descripción'}</p>
              <div className="precio-servicio">
                <span className="precio-label">Precio:</span>
                <span className="precio-valor">{formatPrice(servicio.precio)}</span>
              </div>
              {servicio.duracionEstimada && (
                <div className="duracion-servicio mt-3">
                  <Badge bg="info">Duración: {servicio.duracionEstimada}</Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservaServicio;

