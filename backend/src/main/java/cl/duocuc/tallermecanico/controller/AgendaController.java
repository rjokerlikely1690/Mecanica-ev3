package cl.duocuc.tallermecanico.controller;

import cl.duocuc.tallermecanico.dto.AgendaRequest;
import cl.duocuc.tallermecanico.model.Turno;
import cl.duocuc.tallermecanico.service.AgendaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/agenda")
public class AgendaController {

    private final AgendaService agendaService;

    public AgendaController(AgendaService agendaService) {
        this.agendaService = agendaService;
    }

    @GetMapping
    public List<Turno> listarTurnos(@RequestParam(required = false) String clienteEmail) {
        return agendaService.listarTurnos(clienteEmail);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Turno crearTurno(@Valid @RequestBody AgendaRequest request) {
        return agendaService.crearTurno(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Turno actualizarTurno(@PathVariable String id, @Valid @RequestBody AgendaRequest request) {
        Turno existente = agendaService.obtenerPorId(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turno no encontrado"));
        return agendaService.actualizarTurno(existente, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarTurno(@PathVariable String id) {
        if (agendaService.obtenerPorId(id).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Turno no encontrado");
        }
        agendaService.eliminar(id);
    }
}

