import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { agendaService } from '../../services/apiService';
import './CalendarioReserva.css';

const CalendarioReserva = ({ fechaSeleccionada, onFechaSeleccionada, onHoraSeleccionada }) => {
  const [turnos, setTurnos] = useState([]);
  const [mesActual, setMesActual] = useState(new Date());
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  useEffect(() => {
    loadTurnos();
  }, [mesActual]);

  useEffect(() => {
    if (fechaSeleccionada) {
      generarHorasDisponibles(fechaSeleccionada);
    }
  }, [fechaSeleccionada, turnos]);

  const loadTurnos = async () => {
    try {
      const data = await agendaService.getAll();
      setTurnos(data);
    } catch (err) {
      console.error('Error al cargar turnos:', err);
    }
  };

  const generarHorasDisponibles = (fecha) => {
    const horas = [];
    const fechaStr = fecha.toISOString().split('T')[0];
    const turnosDelDia = turnos.filter(t => t.fecha === fechaStr);
    const horasOcupadas = turnosDelDia.map(t => t.hora);

    for (let hora = 9; hora <= 18; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaStr = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
        if (!horasOcupadas.includes(horaStr)) {
          horas.push(horaStr);
        }
      }
    }
    setHorasDisponibles(horas);
  };

  const obtenerDiasDelMes = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = primerDia.getDay();

    const dias = [];
    
    // Días del mes anterior para completar la semana
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
        tieneTurnos: turnosDelDia.length > 0,
        cantidadTurnos: turnosDelDia.length,
        esPasado: esPasado,
        esSeleccionado: fechaSeleccionada && fechaStr === fechaSeleccionada.toISOString().split('T')[0]
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

  const seleccionarFecha = (dia) => {
    if (dia.esDelMes && !dia.esPasado) {
      onFechaSeleccionada(dia.fecha);
      setHoraSeleccionada(null);
    }
  };

  const seleccionarHora = (hora) => {
    setHoraSeleccionada(hora);
    onHoraSeleccionada(hora);
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const dias = obtenerDiasDelMes();

  return (
    <Container className="calendario-reserva">
      <Card>
        <Card.Header className="calendario-header">
          <div className="calendario-navegacion">
            <Button variant="link" onClick={() => cambiarMes(-1)} className="btn-nav">
              ‹
            </Button>
            <h4 className="calendario-mes">
              {nombresMeses[mesActual.getMonth()]} {mesActual.getFullYear()}
            </h4>
            <Button variant="link" onClick={() => cambiarMes(1)} className="btn-nav">
              ›
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="calendario-grid">
            {diasSemana.map(dia => (
              <div key={dia} className="dia-semana-header">{dia}</div>
            ))}
            {dias.map((dia, index) => (
              <div
                key={index}
                className={`dia-calendario ${
                  !dia.esDelMes ? 'dia-otro-mes' : 
                  dia.esPasado ? 'dia-pasado' : 
                  dia.esSeleccionado ? 'dia-seleccionado' : 
                  dia.tieneTurnos ? 'dia-con-turnos' : 'dia-disponible'
                }`}
                onClick={() => seleccionarFecha(dia)}
              >
                <span className="numero-dia">{dia.numero}</span>
                {dia.tieneTurnos && (
                  <Badge bg="secondary" className="badge-turnos">
                    {dia.cantidadTurnos}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {fechaSeleccionada && (
            <div className="horas-disponibles">
              <h5 className="mt-4 mb-3">
                Horas disponibles para {fechaSeleccionada.toLocaleDateString('es-CL', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h5>
              <div className="horas-grid">
                {horasDisponibles.length > 0 ? (
                  horasDisponibles.map(hora => (
                    <Button
                      key={hora}
                      variant={horaSeleccionada === hora ? 'primary' : 'outline-primary'}
                      className="btn-hora"
                      onClick={() => seleccionarHora(hora)}
                    >
                      {hora}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted">No hay horas disponibles para este día</p>
                )}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CalendarioReserva;

