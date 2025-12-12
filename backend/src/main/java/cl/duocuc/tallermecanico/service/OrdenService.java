package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.dto.AgendaRequest;
import cl.duocuc.tallermecanico.dto.OrdenRequest;
import cl.duocuc.tallermecanico.model.Orden;
import cl.duocuc.tallermecanico.model.Turno;
import cl.duocuc.tallermecanico.repository.OrdenRepository;
import cl.duocuc.tallermecanico.repository.TurnoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenService {

    private final OrdenRepository ordenRepository;
    private final TurnoRepository turnoRepository;
    private final AgendaService agendaService;

    public OrdenService(OrdenRepository ordenRepository, TurnoRepository turnoRepository, AgendaService agendaService) {
        this.ordenRepository = ordenRepository;
        this.turnoRepository = turnoRepository;
        this.agendaService = agendaService;
    }

    @Transactional
    public Orden crearOrdenConTurno(OrdenRequest request) {
        // Crear el turno primero
        AgendaRequest agendaRequest = new AgendaRequest();
        agendaRequest.setFecha(request.getFechaTurno());
        agendaRequest.setHora(request.getHoraTurno());
        agendaRequest.setServicioSolicitado(request.getServicioNombre());
        agendaRequest.setClienteNombre(request.getClienteNombre());
        agendaRequest.setClienteEmail(request.getClienteEmail());
        agendaRequest.setNotas(request.getNotas());
        agendaRequest.setConfirmado(true);

        Turno turno = agendaService.crearTurno(agendaRequest);

        // Crear la orden
        Orden orden = new Orden();
        orden.setClienteNombre(request.getClienteNombre());
        orden.setClienteEmail(request.getClienteEmail());
        orden.setServicioNombre(request.getServicioNombre());
        orden.setPrecio(request.getPrecio());
        orden.setFechaTurno(request.getFechaTurno());
        orden.setHoraTurno(request.getHoraTurno());
        orden.setNotas(request.getNotas());
        orden.setMetodoPago(request.getMetodoPago());
        orden.setEstadoPago("PAGADO");
        orden.setTurnoId(turno.getId());

        return ordenRepository.save(orden);
    }

    public List<Orden> listarOrdenes(String clienteEmail) {
        Sort sort = Sort.by(Sort.Direction.DESC, "creadoEn");
        if (clienteEmail != null && !clienteEmail.isBlank()) {
            return ordenRepository.findByClienteEmailIgnoreCase(clienteEmail, sort);
        }
        return ordenRepository.findAll(sort);
    }

    public Optional<Orden> obtenerPorId(String id) {
        return ordenRepository.findById(id);
    }

    public void eliminar(String id) {
        ordenRepository.deleteById(id);
    }
}

