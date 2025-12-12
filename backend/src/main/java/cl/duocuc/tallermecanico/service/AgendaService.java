package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.dto.AgendaRequest;
import cl.duocuc.tallermecanico.model.Turno;
import cl.duocuc.tallermecanico.repository.TurnoRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AgendaService {

    private final TurnoRepository turnoRepository;

    public AgendaService(TurnoRepository turnoRepository) {
        this.turnoRepository = turnoRepository;
    }

    public List<Turno> listarTurnos(String clienteEmail) {
        Sort sort = Sort.by(Sort.Direction.ASC, "fecha").and(Sort.by("hora").ascending());
        if (clienteEmail != null && !clienteEmail.isBlank()) {
            return turnoRepository.findByClienteEmailIgnoreCase(clienteEmail, sort);
        }
        return turnoRepository.findAll(sort);
    }

    public Turno crearTurno(AgendaRequest request) {
        Turno turno = new Turno();
        copiarDatos(turno, request);
        turno.setConfirmado(Boolean.TRUE.equals(request.getConfirmado()));
        return turnoRepository.save(turno);
    }

    public Optional<Turno> obtenerPorId(String id) {
        return turnoRepository.findById(id);
    }

    public Turno actualizarTurno(Turno turnoExistente, AgendaRequest request) {
        copiarDatos(turnoExistente, request);
        if (request.getConfirmado() != null) {
            turnoExistente.setConfirmado(request.getConfirmado());
        }
        return turnoRepository.save(turnoExistente);
    }

    public void eliminar(String id) {
        turnoRepository.deleteById(id);
    }

    private void copiarDatos(Turno turno, AgendaRequest request) {
        turno.setFecha(request.getFecha());
        turno.setHora(request.getHora());
        turno.setServicioSolicitado(request.getServicioSolicitado());
        turno.setNotas(request.getNotas());
        turno.setClienteEmail(request.getClienteEmail());
        turno.setClienteNombre(request.getClienteNombre());
    }
}

