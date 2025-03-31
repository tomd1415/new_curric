<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "127.0.0.1";
$username = "root";
$password = "exhall2024";
$dbname = "exhall_curriculum";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$subject = $_POST['subject'];
$year = $_POST['year'];
$term = $_POST['term'];
$field = $_POST['field'];
$newValue = $_POST['value'];

// Update query
$sql = "UPDATE subject_overview SET $field = ? WHERE subject = ? AND Year = ? AND Term = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $newValue, $subject, $year, $term);

if ($stmt->execute()) {
    echo "Record updated successfully";
} else {
    echo "Error updating record: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
