package cl.duocuc.tallermecanico.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Document(collection = "vehiculos")
public class Vehiculo {

    @Id
    private String id;

    @NotBlank(message = "La patente es obligatoria")
    @Size(min = 5, max = 10, message = "La patente debe tener entre 5 y 10 caracteres")
    private String patente;

    @NotBlank(message = "La marca es obligatoria")
    private String marca;

    @NotBlank(message = "El modelo es obligatorio")
    private String modelo;

    @NotNull(message = "El año es obligatorio")
    private Integer anio;

    @NotBlank(message = "El nombre del dueño es obligatorio")
    private String duenoNombre;

    @NotBlank(message = "El correo del dueño es obligatorio")
    @Email(message = "El correo del dueño no es válido")
    private String duenoEmail;

    @Valid
    private List<HistorialEntrada> historial = new ArrayList<>();

    private LocalDateTime creadoEn = LocalDateTime.now();

    public Vehiculo() {
    }

    public void agregarHistorial(HistorialEntrada entrada) {
        if (this.historial == null) {
            this.historial = new ArrayList<>();
        }
        this.historial.add(entrada);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatente() {
        return patente;
    }

    public void setPatente(String patente) {
        this.patente = patente;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public String getDuenoNombre() {
        return duenoNombre;
    }

    public void setDuenoNombre(String duenoNombre) {
        this.duenoNombre = duenoNombre;
    }

    public String getDuenoEmail() {
        return duenoEmail;
    }

    public void setDuenoEmail(String duenoEmail) {
        this.duenoEmail = duenoEmail;
    }

    public List<HistorialEntrada> getHistorial() {
        return historial;
    }

    public void setHistorial(List<HistorialEntrada> historial) {
        this.historial = historial;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }

    public static class HistorialEntrada {

        private String id = UUID.randomUUID().toString();
        private LocalDate fecha = LocalDate.now();
        private String descripcion;
        private String tecnico;

        public HistorialEntrada() {
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public LocalDate getFecha() {
            return fecha;
        }

        public void setFecha(LocalDate fecha) {
            this.fecha = fecha;
        }

        public String getDescripcion() {
            return descripcion;
        }

        public void setDescripcion(String descripcion) {
            this.descripcion = descripcion;
        }

        public String getTecnico() {
            return tecnico;
        }

        public void setTecnico(String tecnico) {
            this.tecnico = tecnico;
        }
    }
}

