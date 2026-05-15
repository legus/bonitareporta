<?php


function getConnection() {
    // Parámetros de conexión
    $host = "localhost";
    $db   = "bonitareporta";
    $user = "root";
    $pass = ""; // Reemplazar con contraseña segura
    $charset = "utf8mb4";

    // DSN para PDO
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";

    // Opciones de PDO
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Manejo de errores con excepciones
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Resultados como arrays asociativos
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Prepared statements reales
    ];

    try {
        // Crear conexión PDO
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Registrar error en log y devolver null
        error_log("Error de conexión: " . $e->getMessage());
        return null;
    }
}
?>
