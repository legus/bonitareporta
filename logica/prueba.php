<?php
header("Content-Type: application/json");

$request = json_decode(file_get_contents("php://input"), true);

if (!$request) {
    $request = [
        "operation" => "SELECT",
        "table" => "usuarios"
    ];
}

$response = [
    "status" => "success",
    "code" => 200,
    "message" => "Operacion recibida correctamente",
    "data" => [
        "operation" => $request["operation"],
        "table" => $request["table"]
    ],
    "errors" => []
];

echo json_encode($response);
?>