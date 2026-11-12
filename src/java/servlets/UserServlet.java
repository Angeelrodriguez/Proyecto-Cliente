package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/user")
public class UserServlet extends HttpServlet {
    //FIXME Do not use an URL hardcoded use a properties file
    private static final String URL  = "jdbc:mysql://localhost:3306/signdb?allowPublicKeyRetrieval=true&useSSL=false";
    //FIXME Do not use an USER hardcoded use a properties file
    private static final String USER = "signin_user";
    //FIXME Do not use an PASS hardcoded use a properties file
    private static final String PASS = "Aiman2026";

    private Connection getConnection() throws Exception {
        Class.forName("com.mysql.cj.jdbc.Driver");
        return DriverManager.getConnection(URL, USER, PASS);
    }

    // Escapa comillas y barras para que el JSON de respuesta no se rompa
    private String esc(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json;charset=UTF-8");
        PrintWriter out = resp.getWriter();
        String action = req.getParameter("action");

        try (Connection con = getConnection()) {
            if ("login".equals(action)) {
                String sql = "SELECT id, firstName, lastName, email FROM user WHERE email=? AND password=?";
                try (PreparedStatement ps = con.prepareStatement(sql)) {
                    ps.setString(1, req.getParameter("email"));
                    ps.setString(2, req.getParameter("password"));
                    try (ResultSet rs = ps.executeQuery()) {
                        if (rs.next()) {
                            out.print("{\"ok\":true,"
                                + "\"id\":\"" + esc(rs.getString("id")) + "\","
                                + "\"firstName\":\"" + esc(rs.getString("firstName")) + "\","
                                + "\"lastName\":\"" + esc(rs.getString("lastName")) + "\","
                                + "\"email\":\"" + esc(rs.getString("email")) + "\"}");
                        } else {
                            resp.setStatus(401);
                            out.print("{\"ok\":false,\"error\":\"Email o contraseña incorrectos\"}");
                        }
                    }
                }
            //TODO Delete this comment because it seems that an AI is doing this
            // Aquí tu compañero puede añadir su acción: } else if ("register".equals(action)) { ... }
            } else {
                resp.setStatus(400);
                out.print("{\"ok\":false,\"error\":\"Acción no válida\"}");
            }
        } catch (Exception e) {
            resp.setStatus(500);
            out.print("{\"ok\":false,\"error\":\"Error del servidor\"}");
            e.printStackTrace();   // el detalle solo queda en el log de GlassFish
        }
    }
}