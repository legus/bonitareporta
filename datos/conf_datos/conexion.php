<?php
$host = "localhost";
$user = "root";
$password = "";
$database = "bonitareporta";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "error" => "Error de conexión: " . $conn->connect_error
    ]));
}
$conn->set_charset("utf8mb4");
?> 