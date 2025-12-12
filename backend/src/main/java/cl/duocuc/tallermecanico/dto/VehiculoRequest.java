package cl.duocuc.tallermecanico.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class VehiculoRequest {

    @NotBlank(message = "La patente es obligatoria")
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

    @Size(max = 200, message = "La nota inicial no puede superar los 200 caracteres")
    private String notaInicial;

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

    public String getNotaInicial() {
        return notaInicial;
    }

    public void setNotaInicial(String notaInicial) {
        this.notaInicial = notaInicial;
    }
}

