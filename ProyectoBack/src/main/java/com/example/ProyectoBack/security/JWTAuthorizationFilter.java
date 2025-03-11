package com.example.ProyectoBack.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JWTAuthorizationFilter extends OncePerRequestFilter {

	 @Override
	    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
	        String path = request.getRequestURI();
	        return path.startsWith("/swagger-ui") || path.startsWith("/v3/api-docs");
	    }
	 
	 
	@Override
	protected void doFilterInternal(HttpServletRequest request, 
									HttpServletResponse response, 
									FilterChain filterChain)
									throws ServletException, IOException {
		
		String bearerToken = request.getHeader("Authorization");
		System.out.println("token:" +bearerToken);
		if(bearerToken!=null && bearerToken.startsWith("Bearer ")) {
			String token = bearerToken.replace("Bearer ", "");
			UsernamePasswordAuthenticationToken usernamePAT = TokenUtils.getAuthentication(token);
			SecurityContextHolder.getContext().setAuthentication(usernamePAT);
			
		}
		
		filterChain.doFilter(request, response);
		
	}
	
}
