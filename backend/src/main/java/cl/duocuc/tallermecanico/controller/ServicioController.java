package cl.duocuc.tallermecanico.controller;

import cl.duocuc.tallermecanico.dto.ServicioRequest;
import cl.duocuc.tallermecanico.model.Servicio;
import cl.duocuc.tallermecanico.service.ServicioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@Tag(name = "Servicios", description = "API para gestión de servicios mecánicos")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "bearerAuth")
public class ServicioController {
    
    @Autowired
    private ServicioService servicioService;
    
    @GetMapping
    @Operation(summary = "Listar todos los servicios", description = "Obtiene todos los servicios (solo activos para CLIENTE)")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<List<Servicio>> getAllServicios() {
        List<Servicio> servicios = servicioService.getServiciosActivos();
        return ResponseEntity.ok(servicios);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener servicio por ID", description = "Obtiene un servicio específico por su ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    public ResponseEntity<Servicio> getServicioById(@PathVariable String id) {
        return servicioService.getServicioById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @Operation(summary = "Crear nuevo servicio", description = "Crea un nuevo servicio (solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> createServicio(@Valid @RequestBody ServicioRequest request) {
        try {
            Servicio servicio = servicioService.createServicio(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(servicio);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Actualizar servicio", description = "Actualiza un servicio existente (solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Servicio> updateServicio(@PathVariable String id, 
                                                   @Valid @RequestBody ServicioRequest request) {
        try {
            Servicio servicio = servicioService.updateServicio(id, request);
            return ResponseEntity.ok(servicio);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar servicio", description = "Elimina (desactiva) un servicio (solo ADMIN)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteServicio(@PathVariable String id) {
        try {
            servicioService.deleteServicio(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

