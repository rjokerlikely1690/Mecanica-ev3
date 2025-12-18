package cl.duocuc.tallermecanico.service;

import cl.duocuc.tallermecanico.model.Rol;
import cl.duocuc.tallermecanico.model.Usuario;
import cl.duocuc.tallermecanico.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }
    
    public Optional<Usuario> getUsuarioById(String id) {
        return usuarioRepository.findById(id);
    }
    
    public Usuario crearUsuario(String nombre, String email, String password, Rol rol) {
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRol(rol);
        usuario.setActivo(true);
        
        return usuarioRepository.save(usuario);
    }
    
    public Usuario actualizarUsuario(String id, String nombre, String email, Rol rol, Boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Verificar si el email cambió y no está en uso por otro usuario
        if (!usuario.getEmail().equals(email) && usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("El email ya está en uso por otro usuario");
        }
        
        usuario.setNombre(nombre);
        usuario.setEmail(email);
        usuario.setRol(rol);
        if (activo != null) {
            usuario.setActivo(activo);
        }
        
        return usuarioRepository.save(usuario);
    }
    
    public void cambiarPassword(String id, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }
    
    public void eliminarUsuario(String id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}

