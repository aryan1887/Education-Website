<?php
$host = "localhost";
$user = "root";
$password = "";
$db = "forms";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
  die(json_encode(["status" => "error", "message" => "Connection failed."]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $id = $_POST['id'];
  $fullname = trim($_POST['fullname']);
  $email = trim($_POST['email']);
  $username = trim($_POST['username']);

  if (!$fullname || !$email || !$username) {
    echo json_encode(["status" => "error", "message" => "All fields are required."]);
    exit;
  }

  $stmt = $conn->prepare("UPDATE users SET fullname = ?, email = ?, username = ? WHERE id = ?");
  $stmt->bind_param("sssi", $fullname, $email, $username, $id);

  if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
  } else {
    echo json_encode(["status" => "error", "message" => "Failed to update user."]);
  }

  $stmt->close();
} else {
  echo json_encode(["status" => "error", "message" => "Invalid request."]);
}

$conn->close();
?>
