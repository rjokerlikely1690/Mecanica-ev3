package cl.duocuc.tallermecanico.controller;

import cl.duocuc.tallermecanico.dto.MensajeRequest;
import cl.duocuc.tallermecanico.model.MensajeInterno;
import cl.duocuc.tallermecanico.service.MensajeService;
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

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
public class MensajeController {

    private final MensajeService mensajeService;

    public MensajeController(MensajeService mensajeService) {
        this.mensajeService = mensajeService;
    }

    @GetMapping
    public List<MensajeInterno> listar() {
        return mensajeService.listar();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MensajeInterno crear(@Valid @RequestBody MensajeRequest request) {
        return mensajeService.crear(request);
    }

    @PutMapping("/{id}/destacado")
    @PreAuthorize("hasRole('ADMIN')")
    public MensajeInterno actualizarDestacado(@PathVariable String id,
                                              @RequestParam boolean destacado) {
        return mensajeService.actualizarDestacado(id, destacado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String id) {
        mensajeService.eliminar(id);
    }
}

