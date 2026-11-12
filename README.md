# Proyecto-Cliente
Proyecto de Sign in y Sign out de Angel y Aiman
Sign In and Sign Up Application (Proyecto_Cliente)
Repositorio

https://github.com/Angeelrodriguez/Proyecto-Cliente

El usuario de GitHub uriajavi@gmail.com ha sido invitado como colaborador del repositorio, con permiso para hacer push.

Explicación

Aplicación web con dos pantallas: registro (sign-up.html) e inicio de sesión (sign-in.html). Los usuarios se guardan en una base de datos MySQL (signdb, tabla user).

Registro: el controlador controllerSignUp.js valida el formulario y envía los datos en XML al servicio REST de GlassFish, que los guarda en MySQL.
Inicio de sesión: el controlador controllerSignIn.js envía el email y la contraseña a un servlet (UserServlet), que los comprueba en MySQL.
Base de datos: el script signdb.sql crea la base de datos y la tabla.
Cómo ejecutarlo
Ejecutar signdb.sql en MySQL.
Desplegar el proyecto en GlassFish desde NetBeans (Clean and Build y Run).
Abrir http://localhost:8080/Proyecto_Cliente/.
