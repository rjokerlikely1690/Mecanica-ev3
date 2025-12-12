package cl.duocuc.tallermecanico.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Ingrese el token JWT obtenido del endpoint /api/auth/login")))
                .info(new Info()
                        .title("API Taller Mecánico AutoMax")
                        .version("1.0.0")
                        .description("API REST para gestión de servicios de taller mecánico. " +
                                   "Incluye autenticación JWT y control de acceso por roles.")
                        .contact(new Contact()
                                .name("DuocUC")
                                .email("contacto@duocuc.cl"))
                        .license(new License()
                                .name("Academic License")
                                .url("https://www.duocuc.cl")));
    }
}


