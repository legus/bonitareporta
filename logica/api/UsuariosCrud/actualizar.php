<?php
require_once __DIR__ . "/../../services/usuarioService.php";

$data = json_decode(file_get_contents("php://input"), true);

$service = new UsuarioService();
$response = $service->actualizarUsuario($data);

echo json_encode($response);
?>