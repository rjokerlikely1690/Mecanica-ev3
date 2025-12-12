package cl.duocuc.tallermecanico.controller;

import cl.duocuc.tallermecanico.dto.OrdenRequest;
import cl.duocuc.tallermecanico.model.Orden;
import cl.duocuc.tallermecanico.service.OrdenService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "*")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @GetMapping
    public List<Orden> listar(@RequestParam(required = false) String clienteEmail) {
        return ordenService.listarOrdenes(clienteEmail);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Orden> crear(@Valid @RequestBody OrdenRequest request) {
        Orden orden = ordenService.crearOrdenConTurno(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(orden);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orden> obtener(@PathVariable String id) {
        return ordenService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String id) {
        ordenService.eliminar(id);
    }
}

