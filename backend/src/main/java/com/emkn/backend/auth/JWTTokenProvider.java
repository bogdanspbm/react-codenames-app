package com.emkn.backend.auth;

import com.emkn.backend.model.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.json.JSONObject;

import java.util.Date;

public class JWTTokenProvider {


    private static final String SECRET_KEY = System.getenv("SECRET_KET") != null ? System.getenv("SECRET_KET") : "9DR096UaOj7UzziS4LkWfXh+TtRtn7PyDW71/AXGIhU=";
    private static final long EXPIRATION_TIME = 1000L * 60L * 60L * 24L * 365L;


    public static String generateToken(UserDTO userDTO) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        JSONObject json = new JSONObject();
        json.put("username", userDTO.getUsername());
        json.put("id", userDTO.getId());


        return Jwts.builder().setSubject(json.toString()).setIssuedAt(new Date()).setExpiration(expiryDate).signWith(SignatureAlgorithm.HS256, SECRET_KEY).compact();
    }

    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public static int getUserIDFromToken(String token) {

        if (token.startsWith("Bearer ")) {
            token = token.substring(6);
        }

        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        JSONObject json = new JSONObject(claims.getSubject());
        int userID = json.getInt("id");


        return userID;
    }
}