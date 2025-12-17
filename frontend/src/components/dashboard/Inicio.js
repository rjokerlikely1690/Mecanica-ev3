import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { agendaService, vehiculoService, servicioService } from '../../services/apiService';

const Inicio = () => {
  const { user } = useAuth();
  const [proximosTurnos, setProximosTurnos] = useState([]);
  const [vehiculosCount, setVehiculosCount] = useState(0);
  const [turnosCount, setTurnosCount] = useState(0);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [serviciosDestacados, setServiciosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResumen();
  }, []);

  const loadResumen = async () => {
    try {
      setLoading(true);
      const [turnos, vehiculos, servicios] = await Promise.all([
        agendaService.getAll(user?.email),
        vehiculoService.getAll(user?.email),
        servicioService.getAll()
      ]);
      
      const ahora = new Date();
      const proximos = turnos
        .filter(t => {
          const fechaTurno = new Date(t.fecha);
          return fechaTurno >= ahora;
        })
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .slice(0, 3);
      
      const actividad = turnos
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5);
      
      const destacados = servicios.filter(s => s.activo !== false).slice(0, 3);
      
      setProximosTurnos(proximos);
      setTurnosCount(turnos.length);
      setVehiculosCount(vehiculos.length);
      setActividadReciente(actividad);
      setServiciosDestacados(destacados);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fechaIso) => {
    if (!fechaIso) return '-';
    return new Date(fechaIso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center py-5">
        <Spinner animation="border" role="status" />
        <p className="text-muted mt-3">Cargando tu información...</p>
      </Container>
    );
  }

  const turnoMasProximo = proximosTurnos.length > 0 ? proximosTurnos[0] : null;

  return (
    <Container className="mt-4">
      {/* HERO SECTION */}
      <Row className="mb-5">
        <Col>
          <Card className="border-0 shadow-lg" style={{
            background: turnoMasProximo ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #8B4513 0%, #6B4423 100%)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <Card.Body className="p-5" style={{ color: '#ffffff' }}>
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div className="flex-grow-1 mb-4 mb-md-0">
                  <h1 className="h3 fw-bold mb-2" style={{ color: '#ffffff', fontSize: '1.75rem' }}>
                    Hola, {user?.nombre}
                  </h1>
                  {turnoMasProximo ? (
                    <>
                      <p className="mb-4" style={{ color: '#d4af7a', fontSize: '1.1rem' }}>
                        Tu próximo turno está programado para:
                      </p>
                      <div className="bg-white bg-opacity-15 p-4 rounded" style={{ backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h3 className="h5 fw-bold mb-1" style={{ color: '#ffffff' }}>
                              {turnoMasProximo.servicioSolicitado}
                            </h3>
                            <p className="mb-1" style={{ color: '#f5f5f5', fontSize: '1rem' }}>
                              {formatFecha(turnoMasProximo.fecha)} a las {turnoMasProximo.hora}
                            </p>
                            <Badge 
                              bg={turnoMasProximo.confirmado ? 'success' : 'warning'} 
                              className="px-3 py-2 mt-2"
                            >
                              {turnoMasProximo.confirmado ? 'Confirmado' : 'Pendiente de confirmación'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button
                          variant="light"
                          as={Link}
                          to="/turnos"
                          className="me-3"
                          style={{
                            backgroundColor: '#ffffff',
                            color: '#8B4513',
                            borderColor: '#ffffff',
                            fontWeight: '600',
                            padding: '0.75rem 1.5rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          Ver todos mis turnos
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mb-4" style={{ color: '#f5f5f5', fontSize: '1.1rem' }}>
                        No tienes turnos próximos. Agenda un servicio para comenzar.
                      </p>
                      <Button
                        variant="light"
                        as={Link}
                        to="/turnos"
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#8B4513',
                          borderColor: '#ffffff',
                          fontWeight: '600',
                          padding: '0.75rem 1.5rem',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Agendar mi primer turno
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MÉTRICAS */}
      <Row className="mb-5 g-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #8B4513' }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="h2 mb-1 fw-bold" style={{ color: '#8B4513' }}>{proximosTurnos.length}</div>
                  <Card.Text className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    Turnos próximos
                  </Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #2d2d2d' }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="h2 mb-1 fw-bold" style={{ color: '#1a1a1a' }}>{turnosCount}</div>
                  <Card.Text className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    Total de turnos
                  </Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: '4px solid #2d2d2d' }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="h2 mb-1 fw-bold" style={{ color: '#1a1a1a' }}>{vehiculosCount}</div>
                  <Card.Text className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    Vehículos registrados
                  </Card.Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ACCESOS RÁPIDOS */}
      <Row className="mb-5">
        <Col>
          <div className="mb-3">
            <h3 className="h5 fw-semibold mb-1" style={{ color: '#1a1a1a' }}>
              Acciones rápidas
            </h3>
            <small className="text-muted">Accede rápidamente a las funciones principales</small>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <Button
              as={Link}
              to="/turnos"
              variant="outline-dark"
              style={{
                borderColor: '#8B4513',
                color: '#8B4513',
                fontWeight: '600',
                padding: '0.75rem 1.5rem',
                minWidth: '180px'
              }}
            >
              Agendar turno
            </Button>
            <Button
              as={Link}
              to="/servicios-cliente"
              variant="outline-dark"
              style={{
                borderColor: '#1a1a1a',
                color: '#1a1a1a',
                fontWeight: '500',
                padding: '0.75rem 1.5rem',
                minWidth: '180px'
              }}
            >
              Ver servicios
            </Button>
            <Button
              as={Link}
              to="/vehiculos-cliente"
              variant="outline-dark"
              style={{
                borderColor: '#1a1a1a',
                color: '#1a1a1a',
                fontWeight: '500',
                padding: '0.75rem 1.5rem',
                minWidth: '180px'
              }}
            >
              Mis vehículos
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* ACTIVIDAD RECIENTE */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="h5 fw-semibold mb-1" style={{ color: '#1a1a1a' }}>
                    Actividad reciente
                  </h4>
                  <small className="text-muted">Últimos turnos agendados</small>
                </div>
                <Button
                  variant="outline-dark"
                  size="sm"
                  as={Link}
                  to="/turnos"
                  style={{
                    borderColor: '#8B4513',
                    color: '#8B4513',
                    fontWeight: '500'
                  }}
                >
                  Ver todos
                </Button>
              </div>
              {actividadReciente.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3">Aún no tienes actividad registrada</p>
                  <Button
                    as={Link}
                    to="/turnos"
                    style={{
                      backgroundColor: '#8B4513',
                      borderColor: '#8B4513',
                      color: '#ffffff',
                      fontWeight: '600'
                    }}
                  >
                    Explorar servicios
                  </Button>
                </div>
              ) : (
                <div>
                  {actividadReciente.map((turno, idx) => {
                    const fechaTurno = new Date(turno.fecha);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    fechaTurno.setHours(0, 0, 0, 0);
                    const esFuturo = fechaTurno >= hoy;
                    const estado = turno.confirmado ? 'confirmado' : 'pendiente';
                    
                    return (
                      <div
                        key={turno.id}
                        className={`py-3 ${idx < actividadReciente.length - 1 ? 'border-bottom' : ''}`}
                        style={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                        onClick={() => window.location.href = '/turnos'}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="fw-semibold" style={{ color: '#1a1a1a', fontSize: '1rem' }}>
                                {turno.servicioSolicitado}
                              </span>
                              <Badge
                                bg={estado === 'confirmado' ? 'success' : 'warning'}
                                style={{ fontSize: '0.75rem' }}
                              >
                                {estado === 'confirmado' ? 'Confirmado' : 'Pendiente'}
                              </Badge>
                            </div>
                            <small className="text-muted d-block" style={{ fontSize: '0.875rem' }}>
                              {formatFecha(turno.fecha)} a las {turno.hora}
                              {!esFuturo && <span className="ms-2 text-muted">(Pasado)</span>}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* SERVICIOS DESTACADOS */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h4 className="h5 fw-semibold mb-3" style={{ color: '#1a1a1a' }}>
                Servicios destacados
              </h4>
              {serviciosDestacados.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <p className="mb-0 small">No hay servicios disponibles</p>
                </div>
              ) : (
                <div>
                  {serviciosDestacados.map((servicio, idx) => (
                    <div
                      key={servicio.id}
                      className={idx < serviciosDestacados.length - 1 ? 'mb-3 pb-3 border-bottom' : 'mb-3'}
                    >
                      <div className="fw-semibold mb-1" style={{ fontSize: '0.95rem', color: '#1a1a1a' }}>
                        {servicio.nombre}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="fw-bold" style={{ color: '#8B4513', fontSize: '1rem' }}>
                          {formatPrice(servicio.precio)}
                        </span>
                        <Button
                          variant="link"
                          size="sm"
                          as={Link}
                          to="/servicios-cliente"
                          className="p-0"
                          style={{
                            color: '#8B4513',
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          Ver →
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline-dark"
                    size="sm"
                    as={Link}
                    to="/servicios-cliente"
                    className="w-100 mt-2"
                    style={{
                      borderColor: '#1a1a1a',
                      color: '#1a1a1a',
                      fontWeight: '500'
                    }}
                  >
                    Ver todos los servicios
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;

