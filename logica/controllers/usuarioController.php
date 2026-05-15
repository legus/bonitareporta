<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../services/usuarioService.php';

$body = file_get_contents('php://input');
$data = json_decode($body, true);

if ($body !== '' && $data === null && json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'JSON inválido en el cuerpo de la solicitud',
        'errors' => [json_last_error_msg()]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

class UsuarioController {
    private $usuarioService;

    public function __construct() {
        $this->usuarioService = new UsuarioService();
    }

    public function procesarLogin($input) {
        $email    = $input['email'] ?? null;
        $password = $input['password'] ?? null;

        return $this->usuarioService->login($email, $password);
    }


?>
