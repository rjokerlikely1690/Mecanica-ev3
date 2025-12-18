package cl.duocuc.tallermecanico.controller;

import cl.duocuc.tallermecanico.model.Rol;
import cl.duocuc.tallermecanico.model.Usuario;
import cl.duocuc.tallermecanico.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuarios", description = "API para gestión de usuarios (solo administradores)")
@CrossOrigin(origins = "http://localhost:3000")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los usuarios", description = "Obtiene la lista completa de usuarios (solo admin)")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.getAllUsuarios();
        // No devolver las contraseñas
        usuarios.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(usuarios);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene los datos de un usuario específico")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable String id) {
        return usuarioService.getUsuarioById(id)
                .map(usuario -> {
                    usuario.setPassword(null);
                    return ResponseEntity.ok(usuario);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Crear nuevo usuario", description = "Crea un nuevo usuario con el rol especificado")
    public ResponseEntity<?> crearUsuario(@RequestBody Map<String, String> request) {
        try {
            String nombre = request.get("nombre");
            String email = request.get("email");
            String password = request.get("password");
            Rol rol = Rol.valueOf(request.get("rol").toUpperCase());
            
            Usuario usuario = usuarioService.crearUsuario(nombre, email, password, rol);
            usuario.setPassword(null);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    public ResponseEntity<?> actualizarUsuario(
            @PathVariable String id,
            @RequestBody Map<String, Object> request) {
        try {
            String nombre = (String) request.get("nombre");
            String email = (String) request.get("email");
            Rol rol = Rol.valueOf(((String) request.get("rol")).toUpperCase());
            Boolean activo = request.get("activo") != null ? (Boolean) request.get("activo") : null;
            
            Usuario usuario = usuarioService.actualizarUsuario(id, nombre, email, rol, activo);
            usuario.setPassword(null);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cambiar contraseña de usuario", description = "Cambia la contraseña de un usuario")
    public ResponseEntity<?> cambiarPassword(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        try {
            String nuevaPassword = request.get("password");
            usuarioService.cambiarPassword(id, nuevaPassword);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Contraseña actualizada correctamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema")
    public ResponseEntity<?> eliminarUsuario(@PathVariable String id) {
        try {
            usuarioService.eliminarUsuario(id);
            Map<String, String> response = new HashMap<>();
            response.put("mensaje", "Usuario eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("mensaje", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

