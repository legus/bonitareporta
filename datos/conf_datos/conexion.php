<?php
// Parámetros de conexión
$host = "localhost";       // Cambiar si usas otro servidor
$user = "root";            // Usuario de la base de datos
$password = "";            // Contraseña del usuario
$database = "bonitareporta"; // Nombre de la base de datos

// Crear conexión
$conn = new mysqli($host, $user, $password, $database);

// Verificar conexión
if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "insert_id" => null,
        "affected_rows" => 0,
        "error" => "Error de conexión: " . $conn->connect_error
    ]));
}

// Configurar charset para evitar problemas con acentos
$conn->set_charset("utf8");

// Retornar conexión para ser usada en otros scripts
?>
