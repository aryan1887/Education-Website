<?php
$host = "localhost";
$user = "root";
$password = "";
$db = "forms";

$conn = new mysqli($host, $user, $password, $db);
if ($conn->connect_error) {
  die(json_encode(["status" => "error", "message" => "Connection failed."]));
}

$sql = "SELECT id, fullname, email, username FROM users";
$result = $conn->query($sql);

$users = [];
while ($row = $result->fetch_assoc()) {
  $users[] = $row;
}

echo json_encode(["status" => "success", "data" => $users]);
$conn->close();
?>
