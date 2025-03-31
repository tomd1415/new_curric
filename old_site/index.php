<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subject Overview</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        h2 {
            margin-top: 20px;
        }
        .year {
            margin-top: 40px;
        }
    </style>
</head>
<body>
    <h1>Subject Overview</h1>
    <?php
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
	    echo "<h1> Connection error!</h1>";
    }
    // SQL query to select all records
    $sql = "SELECT Year, Term, Area_of_study, Literacy_focus, Numeracy_focus, SMSC FROM subject_overview WHERE subject='computing' ORDER BY Year, Term";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $current_year = "";
        // Output data of each row
        while($row = $result->fetch_assoc()) {
            if ($current_year != $row["Year"]) {
                if ($current_year != "") {
                    echo "</table>";
                }
                $current_year = $row["Year"];
                echo "<div class='year'><h2>{$current_year}</h2>";
                echo "<table>
                        <tr>
                            <th>Term</th>
                            <th>Area of Study</th>
                            <th>Literacy Focus</th>
                            <th>Numeracy Focus</th>
                            <th>SMSC</th>
                        </tr>";
            }
            echo "<tr>
                    <td>{$row["Term"]}</td>
                    <td>{$row["Area_of_study"]}</td>
                    <td>{$row["Literacy_focus"]}</td>
                    <td>{$row["Numeracy_focus"]}</td>
                    <td>{$row["SMSC"]}</td>
                </tr>";
        }
        echo "</table>";
    } else {
        echo "0 results";
    }
    $conn->close();
    ?>
</body>
</html>

