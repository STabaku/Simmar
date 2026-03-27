package com.simaar.simaar.config;

import com.simaar.simaar.security.JwtFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
       .authorizeHttpRequests(auth -> auth
    // allow all static files (html, css, js, images)
    .requestMatchers(
        "/",
        "/index.html",
        "/pages/**",
        "/css/**",
        "/js/**",
        "/images/**",
        "/*.html"
    ).permitAll()
    // public API endpoints
    .requestMatchers("/api/auth/**").permitAll()
    .requestMatchers("/api/bouquets/**").permitAll()
    .requestMatchers("/api/events/**").permitAll()
    .requestMatchers("/api/gift-items/**").permitAll()
    .requestMatchers("/api/gallery/**").permitAll()
    // admin only
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    // everything else needs login
    .anyRequest().authenticated()
)
.formLogin(form -> form.disable())
.httpBasic(basic -> basic.disable())
.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}