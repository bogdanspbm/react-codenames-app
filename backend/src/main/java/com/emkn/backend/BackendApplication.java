package com.emkn.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.File;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(BackendApplication.class);

        // Путь к keystore
        String keystorePath = "/etc/letsencrypt/live/codenames.madzhuga.com/keystore.p12";
        File keystore = new File(keystorePath);

        // Проверка наличия keystore и установка профиля
        if (keystore.exists()) {
            app.setAdditionalProfiles("https");
        } else {
            app.setAdditionalProfiles("http");
        }

        app.run(args);
    }
}
