<?php
class UsuarioService
{
    private function errorResponse(string $message): array
    {
        return [
            'success' => false,
            'message' => $message
        ];
    }

    public function crearUsuario(array $data): array
    {
        if (empty($data['nombre'])) {
            return $this->errorResponse('El nombre es obligatorio');
        }

        if (empty($data['apellido'])) {
            return $this->errorResponse('El apellido es obligatorio');
        }

        if (empty($data['email'])) {
            return $this->errorResponse('El email es obligatorio');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->errorResponse('Email inválido');
        }

        if (empty($data['contraseña'])) {
            return $this->errorResponse('El contraseña es obligatorio');
        }

        return [
            'success' => true,
            'operation' => 'create',
            'table' => 'usuarios',
            'data_to_save' => [
                'nombre' => $data['nombre'],
                'apellido' => $data['apellido'],
                'email' => $data['email'],
                'contraseña' => password_hash($data['contraseña'], PASSWORD_DEFAULT)
            ]
        ];
    }

    public function listarUsuarios(array $data): array
    {
        return [
            'success' => true,
            'operation' => 'select_all',
            'table' => 'usuarios'
        ];
    }

    public function actualizarUsuario(array $data): array
    {
        if (empty($data['id_usuario'])) {
            return $this->errorResponse('El ID es obligatorio');
        }

        return [
            'success' => true,
            'operation' => 'update',
            'table' => 'usuarios',
            'id_usuario' => $data['id_usuario'],
            'data_to_update' => isset($data['update_data']) && is_array($data['update_data']) ? $data['update_data'] : []
        ];
    }

    public function eliminarUsuario(array $data): array
    {
        if (empty($data['id_usuario'])) {
            return $this->errorResponse('El ID es obligatorio');
        }

        return [
            'success' => true,
            'operation' => 'delete',
            'table' => 'usuarios',
            'id_usuario' => $data['id_usuario']
        ];
    }

}
?>