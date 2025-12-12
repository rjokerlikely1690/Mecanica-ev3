package cl.duocuc.tallermecanico.config;

import cl.duocuc.tallermecanico.model.MensajeInterno;
import cl.duocuc.tallermecanico.model.Repuesto;
import cl.duocuc.tallermecanico.model.Rol;
import cl.duocuc.tallermecanico.model.Turno;
import cl.duocuc.tallermecanico.model.Usuario;
import cl.duocuc.tallermecanico.model.Vehiculo;
import cl.duocuc.tallermecanico.repository.MensajeInternoRepository;
import cl.duocuc.tallermecanico.repository.RepuestoRepository;
import cl.duocuc.tallermecanico.repository.TurnoRepository;
import cl.duocuc.tallermecanico.repository.UsuarioRepository;
import cl.duocuc.tallermecanico.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private TurnoRepository turnoRepository;
    
    @Autowired
    private VehiculoRepository vehiculoRepository;
    
    @Autowired
    private RepuestoRepository repuestoRepository;
    
    @Autowired
    private MensajeInternoRepository mensajeInternoRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Crear usuario ADMIN si no existe
        if (!usuarioRepository.existsByEmail("admin@automax.cl")) {
            Usuario admin = new Usuario();
            admin.setNombre("Administrador");
            admin.setEmail("admin@automax.cl");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMIN);
            admin.setActivo(true);
            usuarioRepository.save(admin);
            System.out.println("Usuario ADMIN creado: admin@automax.cl / admin123");
        }
        
        // Crear usuario CLIENTE de ejemplo si no existe
        if (!usuarioRepository.existsByEmail("cliente@test.cl")) {
            Usuario cliente = new Usuario();
            cliente.setNombre("Cliente Test");
            cliente.setEmail("cliente@test.cl");
            cliente.setPassword(passwordEncoder.encode("cliente123"));
            cliente.setRol(Rol.CLIENTE);
            cliente.setActivo(true);
            usuarioRepository.save(cliente);
            System.out.println("Usuario CLIENTE creado: cliente@test.cl / cliente123");
        }
        
        if (turnoRepository.count() == 0) {
            Turno turno = new Turno();
            turno.setFecha(LocalDate.now().plusDays(1));
            turno.setHora("10:00");
            turno.setServicioSolicitado("Mantención completa");
            turno.setClienteNombre("Cliente Test");
            turno.setClienteEmail("cliente@test.cl");
            turno.setNotas("Revisar frenos y alineación");
            turno.setConfirmado(true);
            turnoRepository.save(turno);
        }
        
        if (vehiculoRepository.count() == 0) {
            Vehiculo vehiculo = new Vehiculo();
            vehiculo.setPatente("AA-BB11");
            vehiculo.setMarca("Toyota");
            vehiculo.setModelo("Corolla");
            vehiculo.setAnio(2019);
            vehiculo.setDuenoNombre("Cliente Test");
            vehiculo.setDuenoEmail("cliente@test.cl");
            Vehiculo.HistorialEntrada entrada = new Vehiculo.HistorialEntrada();
            entrada.setDescripcion("Cambio de aceite y filtros");
            entrada.setFecha(LocalDate.now().minusMonths(1));
            vehiculo.agregarHistorial(entrada);
            vehiculoRepository.save(vehiculo);
        }
        
        if (repuestoRepository.count() == 0) {
            Repuesto repuesto = new Repuesto();
            repuesto.setNombre("Filtro de aceite");
            repuesto.setDescripcion("Filtro sintético para motores 2.0");
            repuesto.setPrecio(new BigDecimal("12990"));
            repuesto.setStockActual(15);
            repuesto.setStockMinimo(5);
            repuesto.setProveedor("Lubritek");
            repuestoRepository.save(repuesto);
        }
        
        if (mensajeInternoRepository.count() == 0) {
            MensajeInterno mensaje = new MensajeInterno(
                    "Administrador",
                    "ADMIN",
                    "Recordatorio: revisar los vehículos entregados hoy antes de las 18:00.",
                    "Operaciones"
            );
            mensaje.setDestacado(true);
            mensajeInternoRepository.save(mensaje);
        }
    }
}


