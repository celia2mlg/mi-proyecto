package com.example.ProyectoBack.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
	
	
	@Autowired
	private UserDetailsService userDetailsService;
	
	private final JWTAuthorizationFilter jwtAuthorizationFilter = new JWTAuthorizationFilter();
	
	
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authManager) throws Exception {

	    JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter();
	    jwtAuthenticationFilter.setAuthenticationManager(authManager);
	    jwtAuthenticationFilter.setFilterProcessesUrl("/login/url");
	    
	    http
	   
	        .authorizeHttpRequests(request ->
	            request.requestMatchers("/anuncio/publicarAnuncio")
	                .authenticated()
	                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html", "/swagger-ui/index.html")
	                .permitAll()
	                .requestMatchers("/anuncio/getAnuncios")
	                .permitAll()
	                .requestMatchers("/anuncio/getAnuncio/**")
	                .permitAll()
	                .requestMatchers("/login/**")
	                .permitAll()
	                .requestMatchers("/anuncio/{anuncioId}/favorito/{usuarioEmail}")
	                .permitAll()
	        )
	        .cors(cors -> {
	            CorsConfiguration config = new CorsConfiguration();
	            config.addAllowedOrigin("http://localhost:4200");
	            config.addAllowedMethod("GET");
	            config.addAllowedMethod("POST");
	            config.addAllowedMethod("PUT");
	            config.addAllowedMethod("DELETE");
	            config.addAllowedMethod("OPTIONS");
	            config.addAllowedHeader("*");
	            config.setAllowCredentials(true);
	            config.addExposedHeader("Authorization");  
	            cors.configurationSource(request -> config);
	        })
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .addFilter(jwtAuthenticationFilter)
	        .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class)
	        .csrf(csrf -> csrf.disable());

	    return http.build();
	}

	
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    

    @Bean
    AuthenticationManager authManager(HttpSecurity http) throws  Exception{
    	
	    	AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
	    	authManagerBuilder
	    	.userDetailsService(userDetailsService)
	        .passwordEncoder(passwordEncoder());
	    	
	    return authManagerBuilder.build();        
    	
    	
    }

}
