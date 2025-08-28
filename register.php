<?php
header('Content-Type: application/json'); // Required for AJAX

session_start();
$conn = new mysqli("localhost", "root", "", "forms");
if ($conn->connect_error) {
  echo json_encode(["status" => "error", "message" => "Database connection failed."]);
  exit;
}

$fullname = trim($_POST['fullname'] ?? '');
$email = trim($_POST['email'] ?? '');
$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirmPassword'] ?? ''; // optional from form

// Validation
if (empty($fullname) || empty($email) || empty($username) || empty($password)) {
  echo json_encode(["status" => "error", "message" => "All fields are required."]);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(["status" => "error", "message" => "Invalid email."]);
  exit;
}
if ($password !== $confirmPassword) {
  echo json_encode(["status" => "error", "message" => "Passwords do not match."]);
  exit;
}

// Check for existing user
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
  echo json_encode(["status" => "error", "message" => "Email or username already exists."]);
  exit;
}
$stmt->close();

// Insert
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $fullname, $email, $username, $hashedPassword);

if ($stmt->execute()) {
  echo json_encode(["status" => "success", "message" => "Registration successful."]);
} else {
  echo json_encode(["status" => "error", "message" => "Database error."]);
}
$stmt->close();
$conn->close();
?>
