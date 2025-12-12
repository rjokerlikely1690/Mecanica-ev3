package cl.duocuc.tallermecanico.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "mensajes")
public class MensajeInterno {

    @Id
    private String id;

    @NotBlank(message = "El autor es obligatorio")
    private String autor;

    private String rolAutor;

    @NotBlank(message = "El contenido es obligatorio")
    @Size(min = 5, max = 600, message = "El mensaje debe tener entre 5 y 600 caracteres")
    private String contenido;

    private String categoria;

    private boolean destacado = false;

    private LocalDateTime creadoEn = LocalDateTime.now();

    public MensajeInterno() {
    }

    public MensajeInterno(String autor, String rolAutor, String contenido, String categoria) {
        this.autor = autor;
        this.rolAutor = rolAutor;
        this.contenido = contenido;
        this.categoria = categoria;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAutor() {
        return autor;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public String getRolAutor() {
        return rolAutor;
    }

    public void setRolAutor(String rolAutor) {
        this.rolAutor = rolAutor;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public boolean isDestacado() {
        return destacado;
    }

    public void setDestacado(boolean destacado) {
        this.destacado = destacado;
    }

    public LocalDateTime getCreadoEn() {
        return creadoEn;
    }

    public void setCreadoEn(LocalDateTime creadoEn) {
        this.creadoEn = creadoEn;
    }
}

