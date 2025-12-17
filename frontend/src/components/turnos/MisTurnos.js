import React, { useEffect, useState } from 'react';
import {
  Container, Card, Table, Button, Modal, Form, Badge, Spinner, Alert, ButtonGroup
} from 'react-bootstrap';
import { agendaService } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const initialForm = (user) => ({
  fecha: '',
  hora: '',
  servicioSolicitado: '',
  notas: '',
  clienteNombre: user?.nombre || '',
  clienteEmail: user?.email || '',
  confirmado: false,
});

const MisTurnos = () => {
  const { user } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm(user));
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    loadTurnos();
  }, [user]);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await agendaService.getAll(user?.email);
      setTurnos(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los turnos. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(initialForm(user));
  };

  const handleOpenModal = (turno = null) => {
    if (turno) {
      setEditingId(turno.id);
      setFormData({
        fecha: turno.fecha,
        hora: turno.hora,
        servicioSolicitado: turno.servicioSolicitado,
        notas: turno.notas || '',
        clienteNombre: turno.clienteNombre,
        clienteEmail: turno.clienteEmail,
        confirmado: turno.confirmado,
      });
    } else {
      setEditingId(null);
      setFormData(initialForm(user));
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        clienteNombre: user?.nombre,
        clienteEmail: user?.email,
        confirmado: false,
      };

      if (editingId) {
        await agendaService.update(editingId, payload);
      } else {
        await agendaService.create(payload);
      }

      handleCloseModal();
      loadTurnos();
    } catch (err) {
      console.error(err);
      setError('No se pudo guardar el turno. Verifica los datos e intenta nuevamente.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este turno?')) {
      return;
    }
    try {
      await agendaService.remove(id);
      loadTurnos();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el turno. Intenta nuevamente.');
    }
  };

  const formatFecha = (fechaIso) => {
    if (!fechaIso) return '-';
    const date = new Date(fechaIso);
    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const turnosFiltrados = turnos.filter(t => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaTurno = new Date(t.fecha);
    fechaTurno.setHours(0, 0, 0, 0);

    if (filtro === 'todos') return true;
    if (filtro === 'proximos') return fechaTurno >= hoy;
    if (filtro === 'pasados') return fechaTurno < hoy;
    if (filtro === 'pendientes') return !t.confirmado;
    if (filtro === 'confirmados') return t.confirmado;
    return true;
  });

  if (loading) {
    return (
      <div className="mt-4">
        <Container>
          <Card className="mb-4">
            <Card.Body className="text-center py-5">
              <Spinner animation="border" role="status" className="mb-3" />
              <p className="text-muted">Cargando tus turnos...</p>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Container>
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
              <div>
                <h2 className="mb-1 fw-bold" style={{ color: '#1a1a1a' }}>Mis Turnos</h2>
                <small className="text-muted">
                  Gestiona y consulta todos tus turnos agendados
                </small>
              </div>
              <Button 
                onClick={() => handleOpenModal()} 
                variant="primary"
                style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
              >
                <span>+</span> Agendar turno
              </Button>
            </div>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            <div className="mb-4">
              <ButtonGroup>
                <Button
                  variant={filtro === 'todos' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFiltro('todos')}
                >
                  Todos
                </Button>
                <Button
                  variant={filtro === 'proximos' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFiltro('proximos')}
                >
                  Próximos
                </Button>
                <Button
                  variant={filtro === 'pasados' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFiltro('pasados')}
                >
                  Pasados
                </Button>
                <Button
                  variant={filtro === 'pendientes' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFiltro('pendientes')}
                >
                  Pendientes
                </Button>
                <Button
                  variant={filtro === 'confirmados' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFiltro('confirmados')}
                >
                  Confirmados
                </Button>
              </ButtonGroup>
            </div>

            <div className="table-responsive">
              <Table hover responsive className="align-middle">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Servicio</th>
                    <th>Notas</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center text-muted py-4">
                        <div className="py-4">
                          <div className="text-muted mb-3" style={{ fontSize: '1.1rem' }}>
                            {filtro === 'todos'
                              ? 'No tienes turnos agendados'
                              : `No tienes turnos ${filtro}`}
                          </div>
                          {filtro === 'todos' && (
                            <Button variant="primary" size="sm" onClick={() => handleOpenModal()}>
                              Agendar turno
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    turnosFiltrados.map((turno) => {
                      const hoy = new Date();
                      hoy.setHours(0, 0, 0, 0);
                      const fechaTurno = new Date(turno.fecha);
                      fechaTurno.setHours(0, 0, 0, 0);
                      const esPasado = fechaTurno < hoy;
                      const estado = turno.confirmado ? 'confirmado' : (esPasado ? 'pasado' : 'pendiente');

                      return (
                        <tr key={turno.id}>
                          <td>{formatFecha(turno.fecha)}</td>
                          <td>{turno.hora}</td>
                          <td>{turno.servicioSolicitado}</td>
                          <td>{turno.notas || '-'}</td>
                          <td>
                            <Badge
                              bg={estado === 'confirmado' ? 'success' :
                                  estado === 'pendiente' ? 'warning' : 'secondary'}
                              className="px-3 py-2"
                            >
                              {estado === 'confirmado' ? 'Confirmado' :
                               estado === 'pendiente' ? 'Pendiente' : 'Pasado'}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-secondary"
                                onClick={() => handleOpenModal(turno)}
                              >
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(turno.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Editar turno' : 'Nuevo turno'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Servicio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Mantención preventiva, cambio de aceite..."
                  value={formData.servicioSolicitado}
                  onChange={(e) => setFormData({ ...formData, servicioSolicitado: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Notas adicionales <small className="text-muted">(opcional)</small></Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ej: El vehículo hace ruido al frenar..."
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editingId ? 'Guardar cambios' : 'Agendar turno'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
};

export default MisTurnos;
