package cl.duocuc.tallermecanico.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MensajeRequest {

    @NotBlank(message = "El autor es obligatorio")
    private String autor;

    private String rolAutor;

    @NotBlank(message = "El contenido es obligatorio")
    @Size(min = 5, max = 600, message = "El mensaje debe tener entre 5 y 600 caracteres")
    private String contenido;

    private String categoria;

    private Boolean destacado;

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

    public Boolean getDestacado() {
        return destacado;
    }

    public void setDestacado(Boolean destacado) {
        this.destacado = destacado;
    }
}

