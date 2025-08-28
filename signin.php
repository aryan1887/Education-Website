<?php
session_start();

$host = "localhost";
$user = "root";
$password = "";
$db = "forms";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
  die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = trim($_POST['email']);
  $password = trim($_POST['password']);

  if (empty($email) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Please fill in all fields."]);
    exit;
  }

  $stmt = $conn->prepare("SELECT fullname, password FROM users WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
      echo json_encode(["status" => "success", "name" => $row['fullname']]);
    } else {
      echo json_encode(["status" => "error", "message" => "Incorrect password."]);
    }
  } else {
    echo json_encode(["status" => "error", "message" => "Email not registered."]);
  }

  $stmt->close();
} else {
  echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}

$conn->close();
?>
