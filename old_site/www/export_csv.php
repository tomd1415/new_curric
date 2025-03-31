<?php
include 'config.php';

// Query to select the desired record (Year 7 Computing)
$sql = "SELECT * FROM Curriculum WHERE 1=1";
// WHERE YearGroup = 'Year 7' AND Subject = 'English'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output headers so that the file is downloaded rather than displayed
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename=curric_db.csv');

    // Create a file pointer connected to the output stream
    $output = fopen('php://output', 'w');

    // Output the column headings
    $row = $result->fetch_assoc();
    fputcsv($output, array_keys($row));

    // Output the rows
    fputcsv($output, $row);

    // Close the file pointer
    fclose($output);
} else {
    echo "No records found.";
}

$conn->close();
?>
