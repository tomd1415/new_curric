<?php
include 'config.php';

$id = $_POST['id'];
$field = $_POST['field'];
$value = $_POST['value'];

// Update the database with the new value
$sql = "UPDATE Curriculum SET $field = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('si', $value, $id);
$stmt->execute();

// Fetch the updated row data
$sql = "SELECT * FROM Curriculum WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

echo json_encode($row);

$stmt->close();
$conn->close();
?>
