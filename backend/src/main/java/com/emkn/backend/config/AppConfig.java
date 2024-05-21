package com.emkn.backend.config;

import com.emkn.backend.repository.user.SQLUserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public SQLUserRepository sqlUserRepository() {
        return new SQLUserRepository();
    }

}