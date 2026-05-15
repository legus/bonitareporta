<?php
// logica/api/login.php

header('Content-Type: application/json');
require_once __DIR__ . '/../controller/UsuarioController.php';

// Leer el JSON de la petición
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "error" => "JSON inválido"]);
    exit;
}

$controller = new UsuarioController();
$resultado  = $controller->procesarLogin($input);

echo json_encode($resultado);