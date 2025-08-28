<?php
$host = "localhost";
$user = "root";
$password = "";
$db = "forms";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
  die(json_encode(["status" => "error", "message" => "DB connection failed."]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['id'])) {
  $id = $_POST['id'];

  $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
  $stmt->bind_param("i", $id);

  if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Failed to delete user."]);
  }

  $stmt->close();
} else {
  echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

$conn->close();
?>
