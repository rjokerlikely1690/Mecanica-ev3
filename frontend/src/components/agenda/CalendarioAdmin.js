import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Modal, Badge } from 'react-bootstrap';
import { agendaService } from '../../services/apiService';
import './CalendarioAdmin.css';

const CalendarioAdmin = () => {
  const [turnos, setTurnos] = useState([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadTurnos();
  }, [mesActual]);

  const loadTurnos = async () => {
    try {
      const data = await agendaService.getAll();
      setTurnos(data);
    } catch (err) {
      console.error('Error al cargar turnos:', err);
    }
  };

  const obtenerDiasDelMes = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias = [];
    
    // Días del mes anterior
    const mesAnterior = new Date(año, mes, 0);
    const diasMesAnterior = mesAnterior.getDate();
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
      dias.push({
        numero: diasMesAnterior - i,
        esDelMes: false,
        fecha: new Date(año, mes - 1, diasMesAnterior - i)
      });
    }

    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(año, mes, dia);
      const fechaStr = fecha.toISOString().split('T')[0];
      const turnosDelDia = turnos.filter(t => t.fecha === fechaStr);
      const esPasado = fecha < new Date(new Date().setHours(0, 0, 0, 0));
      
      dias.push({
        numero: dia,
        esDelMes: true,
        fecha: fecha,
        fechaStr: fechaStr,
        tieneTurnos: turnosDelDia.length > 0,
        cantidadTurnos: turnosDelDia.length,
        turnos: turnosDelDia,
        esPasado: esPasado,
        esHoy: fechaStr === new Date().toISOString().split('T')[0]
      });
    }

    // Completar hasta el final de la semana
    const diasRestantes = 42 - dias.length;
    for (let dia = 1; dia <= diasRestantes; dia++) {
      dias.push({
        numero: dia,
        esDelMes: false,
        fecha: new Date(año, mes + 1, dia)
      });
    }

    return dias;
  };

  const cambiarMes = (direccion) => {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + direccion, 1));
  };

  const seleccionarDia = (dia) => {
    if (dia.esDelMes && dia.tieneTurnos) {
      setDiaSeleccionado(dia);
      setTurnosDelDia(dia.turnos);
      setShowModal(true);
    }
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const dias = obtenerDiasDelMes();

  return (
    <Container className="calendario-admin">
      <Card>
        <Card.Header className="calendario-header-admin">
          <div className="calendario-navegacion">
            <Button variant="link" onClick={() => cambiarMes(-1)} className="btn-nav-admin">
              ‹
            </Button>
            <h4 className="calendario-mes">
              {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h4>
            <Button variant="link" onClick={() => cambiarMes(1)} className="btn-nav-admin">
              ›
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="calendario-grid-admin">
            {diasSemana.map(dia => (
              <div key={dia} className="dia-semana-header">{dia}</div>
            ))}
            {dias.map((dia, index) => (
              <div
                key={index}
                className={`dia-calendario-admin ${
                  !dia.esDelMes ? 'dia-otro-mes' : 
                  dia.esPasado ? 'dia-pasado' : 
                  dia.esHoy ? 'dia-hoy' :
                  dia.tieneTurnos ? 'dia-con-turnos' : 'dia-disponible'
                }`}
                onClick={() => seleccionarDia(dia)}
              >
                <span className="numero-dia">{dia.numero}</span>
                {dia.tieneTurnos && (
                  <Badge bg="primary" className="badge-turnos-admin">
                    {dia.cantidadTurnos}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          <div className="leyenda-calendario mt-4">
            <div className="leyenda-item">
              <div className="leyenda-color dia-hoy"></div>
              <span>Hoy</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-con-turnos"></div>
              <span>Con citas</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-disponible"></div>
              <span>Disponible</span>
            </div>
            <div className="leyenda-item">
              <div className="leyenda-color dia-pasado"></div>
              <span>Pasado</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Citas del {diaSeleccionado?.fecha.toLocaleDateString('es-CL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {turnosDelDia.length > 0 ? (
            <div className="lista-turnos-modal">
              {turnosDelDia.map((turno) => (
                <div key={turno.id} className="turno-item-modal">
                  <div className="turno-hora">
                    <Badge bg="primary">{turno.hora}</Badge>
                  </div>
                  <div className="turno-info">
                    <h6>{turno.clienteNombre}</h6>
                    <p className="text-muted mb-1">{turno.clienteEmail}</p>
                    <p className="mb-1"><strong>Servicio:</strong> {turno.servicioSolicitado}</p>
                    {turno.notas && (
                      <p className="text-muted mb-0"><small>Notas: {turno.notas}</small></p>
                    )}
                  </div>
                  <div className="turno-estado">
                    {turno.confirmado ? (
                      <Badge bg="success">Confirmado</Badge>
                    ) : (
                      <Badge bg="warning">Pendiente</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No hay citas para este día</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CalendarioAdmin;

