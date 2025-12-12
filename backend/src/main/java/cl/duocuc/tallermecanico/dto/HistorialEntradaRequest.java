package cl.duocuc.tallermecanico.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class HistorialEntradaRequest {

    @NotBlank(message = "La descripción es obligatoria")
    private String descripcion;

    private String tecnico;

    private LocalDate fecha;

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

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}

