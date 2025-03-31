<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subject Overview</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            color: #333;
            margin: 20px;
        }
        h1 {
            text-align: center;
            color: #0056b3;
        }
        .year, .subject {
            margin-top: 40px;
        }
        h2 {
            color: #0056b3;
            border-bottom: 2px solid #0056b3;
            padding-bottom: 5px;
        }
        h3 {
            color: #333;
            margin-top: 20px;
            cursor: pointer;
            padding-right: 10px;
        }
        form {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            justify-content: space-between;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin-bottom: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        label {
            text-align: justify;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #e6f2ff;
            color: #0056b3;
        }
        tr:nth-child(even) {
            background-color: #f2f9ff;
        }
        tr:hover {
            background-color: #e1ecf9;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 auto;
            max-width: 1200px;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .filters {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 20px;
        }
        .filter-box {
            display: flex;
            width: 46%;
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .filter-box.collapsible .content {
            display: none;
        }
        .filter-box input[type="checkbox"] {
            margin-right: 10px;
        }
        .filter-box label {
            display: block;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .editable {
            background-color: #ffffe0;
        }
        .submit-btn {
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            background-color: #0056b3;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .submit-btn:hover {
            background-color: #004494;
        }
    </style>
    <script>
        function updateCell(subject, year, term, field, newValue) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "update_cell.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.responseText);
                }
            };
            xhr.send("subject=" + subject + "&year=" + year + "&term=" + term + "&field=" + field + "&value=" + encodeURIComponent(newValue));
        }

        function makeEditable(event, subject, year, term, field) {
            event.target.contentEditable = true;
            event.target.classList.add('editable');
            event.target.focus();
            event.target.onblur = function () {
                event.target.contentEditable = false;
                event.target.classList.remove('editable');
                updateCell(subject, year, term, field, event.target.innerText);
            };
        }

        function toggleCollapse(event) {
            const header = event.target;
            const content = header.nextElementSibling;
            if (content.style.display === "none" || content.style.display === "") {
                content.style.display = "grid";
            } else {
                content.style.display = "none";
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.filter-box h3').forEach(header => {
                header.addEventListener('click', toggleCollapse);
            });
        });
    </script>
</head>
<body>
    <div class="container">
        <h1>Subject Overview</h1>
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

        // Get selected subjects and years from query parameters
        $selected_subjects = isset($_GET['subjects']) ? $_GET['subjects'] : [];
        $selected_years = isset($_GET['years']) ? $_GET['years'] : [];

        // Fetch subjects from the database
        $subject_query = "SELECT DISTINCT subject FROM subject_overview ORDER BY subject";
        $subject_result = $conn->query($subject_query);

        // Fetch years from the database
        $year_query = "SELECT DISTINCT Year FROM subject_overview ORDER BY FIELD(Year, 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 10 - Core PE', 'Year 10 FC AQA', 'Year 10 S/C Eduquas', 'BTEC Level 1 Introductory to Sport Year 10 Units', 'Year 11', 'Year 11 - Core PE', 'BTEC Level 1 Introductory to Sport Year 11 Units', 'Year 11 F/C', 'Post 16')";
        $year_result = $conn->query($year_query);

        // Generate checkboxes for subjects and years
        echo '<div class="filters">
                <form method="get" action="">
                    <div class="filter-box collapsible">
                        <h3>Select Subjects</h3>
                        <div class="content grid">';

        if ($subject_result->num_rows > 0) {
            while($subject_row = $subject_result->fetch_assoc()) {
                $subject = $subject_row['subject'];
                $checked = in_array($subject, $selected_subjects) ? 'checked' : '';
                echo "<label><input type='checkbox' name='subjects[]' value='$subject' $checked>$subject</label>";
            }
        }

        echo '          </div>
                    </div>
                    <div class="filter-box collapsible">
                        <h3>Select Years</h3>
                        <div class="content grid">';

        if ($year_result->num_rows > 0) {
            while($year_row = $year_result->fetch_assoc()) {
                $year = $year_row['Year'];
                $checked = in_array($year, $selected_years) ? 'checked' : '';
                echo "<label><input type='checkbox' name='years[]' value='$year' $checked>$year</label>";
            }
        }

        echo '          </div>
                    </div>
                    <input type="submit" class="submit-btn" value="Filter">
                </form>
            </div>';

        // SQL query to select all records based on the selected subjects and years
        $sql = "SELECT subject, Year, Term, Area_of_study, Literacy_focus, Numeracy_focus, SMSC 
                FROM subject_overview 
                WHERE 1=1";

        if (!empty($selected_subjects)) {
            $subjects_in = "'" . implode("','", $selected_subjects) . "'";
            $sql .= " AND subject IN ($subjects_in)";
        }
        if (!empty($selected_years)) {
            $years_in = "'" . implode("','", $selected_years) . "'";
            $sql .= " AND Year IN ($years_in)";
        }
        $sql .= " ORDER BY subject, FIELD(Year, 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 10 - Core PE', 'Year 10 FC AQA', 'Year 10 S/C Eduquas', 'BTEC Level 1 Introductory to Sport Year 10 Units', 'Year 11', 'Year 11 - Core PE', 'BTEC Level 1 Introductory to Sport Year 11 Units', 'Year 11 F/C', 'Post 16'), Year, Term";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            $current_subject = "";
            $current_year = "";
            // Output data of each row
            while($row = $result->fetch_assoc()) {
                if ($current_subject != $row["subject"]) {
                    if ($current_subject != "") {
                        echo "</table></div>"; // Close previous subject table
                    }
                    $current_subject = $row["subject"];
                    echo "<div class='subject'><h3>{$current_subject}</h3>";
                    $current_year = ""; // Reset year for new subject
                }
                if ($current_year != $row["Year"]) {
                    if ($current_year != "") {
                        echo "</table>"; // Close previous year table
                    }
                    $current_year = $row["Year"];
                    echo "<div class='year'><h2>{$current_year}</h2>";
                    echo "<table>
                            <tr>
                                <th class='wide-col'>Term</th>
                                <th>Area of Study</th>
                                <th>Literacy Focus</th>
                                <th>Numeracy Focus</th>
                                <th>SMSC</th>
                            </tr>";
                }
                echo "<tr>
                        <td class='wide-col' onclick=\"makeEditable(event, '{$row["subject"]}', '{$row["Year"]}', '{$row["Term"]}', 'Term')\">{$row["Term"]}</td>
                        <td onclick=\"makeEditable(event, '{$row["subject"]}', '{$row["Year"]}', '{$row["Term"]}', 'Area_of_study')\">{$row["Area_of_study"]}</td>
                        <td onclick=\"makeEditable(event, '{$row["subject"]}', '{$row["Year"]}', '{$row["Term"]}', 'Literacy_focus')\">{$row["Literacy_focus"]}</td>
                        <td onclick=\"makeEditable(event, '{$row["subject"]}', '{$row["Year"]}', '{$row["Term"]}', 'Numeracy_focus')\">{$row["Numeracy_focus"]}</td>
                        <td onclick=\"makeEditable(event, '{$row["subject"]}', '{$row["Year"]}', '{$row["Term"]}', 'SMSC')\">{$row["SMSC"]}</td>
                    </tr>";
            }
            echo "</table></div>"; // Close the last subject and year table
        } else {
            echo "No results found for the selected criteria.";
        }
        $conn->close();

        ?>
    </div>
</body>
</html>
