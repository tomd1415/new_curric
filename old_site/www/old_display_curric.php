<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Display Curriculum</title>
    <!-- <link rel="stylesheet" href="styles.css"> -->
    <link rel="stylesheet" href="displaystyles.css">
</head>
<body>
    <div class="container">
        <?php include 'config.php'; ?>
        
        <h1>Display Curriculum</h1>
        
        <form method="GET" action="" class="filter-form">
            <div class="filter-group">
                <h2>Select Subjects:</h2>
                <?php
                // Get the list of subjects from the database
                $subjectQuery = "SELECT DISTINCT Subject FROM Curriculum";
                $subjectResult = $conn->query($subjectQuery);

                while ($subjectRow = $subjectResult->fetch_assoc()) {
                    $subject = $subjectRow['Subject'];
                    $checked = isset($_GET['subjects']) && in_array($subject, $_GET['subjects']) ? 'checked' : '';
                    echo "<label><input type='checkbox' name='subjects[]' value='$subject' $checked> $subject</label><br>";
                }
                ?>
            </div>
            <div class="filter-group">
                <h2>Select Year Groups:</h2>
                <?php
                // Get the list of year groups from the database
                $yearGroupQuery = "SELECT DISTINCT YearGroup FROM Curriculum";
                $yearGroupResult = $conn->query($yearGroupQuery);

                while ($yearGroupRow = $yearGroupResult->fetch_assoc()) {
                    $yearGroup = $yearGroupRow['YearGroup'];
                    $checked = isset($_GET['yearGroups']) && in_array($yearGroup, $_GET['yearGroups']) ? 'checked' : '';
                    echo "<label><input type='checkbox' name='yearGroups[]' value='$yearGroup' $checked> $yearGroup</label><br>";
                }
                ?>
            </div>
            <button type="submit">Filter</button>
        </form>

        <?php
        $selectedSubjects = isset($_GET['subjects']) ? $_GET['subjects'] : [];
        $selectedYearGroups = isset($_GET['yearGroups']) ? $_GET['yearGroups'] : [];

        $subjectCondition = $selectedSubjects ? "Subject IN ('" . implode("','", $selectedSubjects) . "')" : "1=1";
        $yearGroupCondition = $selectedYearGroups ? "YearGroup IN ('" . implode("','", $selectedYearGroups) . "')" : "1=1";

        $sql = "SELECT * FROM Curriculum WHERE $subjectCondition AND $yearGroupCondition";
        $result = $conn->query($sql);
        
        while ($row = $result->fetch_assoc()) {
            $row["Knowledge_and_skills_autumn_Term_1"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Knowledge_and_skills_autumn_Term_1"]);
            $row["Knowledge_and_skills_autumn_Term_2"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Knowledge_and_skills_autumn_Term_2"]);
            $row["Knowledge_and_skills_spring_Term_1"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Knowledge_and_skills_spring_Term_1"]);
            $row["Knowledge_and_skills_spring_Term_2"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Knowledge_and_skills_spring_Term_2"]);
            $row["Knowledge_and_skills_summer_Term_1"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Knowledge_and_skills_summer_Term_1"]);
            $row["Knowledge_and_skills_summer_Term_2"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Knowledge_and_skills_summer_Term_2"]);
            $row["Key_Assessments"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Key_Assessments"]);
            $row["Important_literacy_and_numeracy"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Important_literacy_and_numeracy"]);
            $row["Wider_skills"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["Wider_skills"]);
            $row["How_you_can_help_your_child_at_home"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["How_you_can_help_your_child_at_home"]);

            // Add these lines to handle new fields
            $row["key_assessments_au1"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["key_assessments_au1"]);
            $row["key_assessments_au2"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["key_assessments_au2"]);
            $row["key_assessments_sp1"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["key_assessments_sp1"]);
            $row["key_assessments_sp2"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["key_assessments_sp2"]);
            $row["key_assessments_su2"] = str_replace(["[b]", "[/b]"], ["<strong>", "</strong>"], $row["key_assessments_su2"]);

            echo "<div class='subject-box'>";
            echo "<h2>{$row['Subject']} - {$row['YearGroup']}</h2>";
            echo "<div class='term-box'>";
            echo "<h3 style='clear: both; display: block; width: 100%;'>Knowledge and Skills</h2>";
            echo "<div class='term'>";
            echo "<h3>Autumn Term 1</h3>";
            echo "<p>" . nl2br(($row["Knowledge_and_skills_autumn_Term_1"])) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Autumn Term 2</h3>";
            echo "<p>" . nl2br(($row["Knowledge_and_skills_autumn_Term_2"])) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Spring Term 1</h3>";
            echo "<p>" . nl2br(($row["Knowledge_and_skills_spring_Term_1"])) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Spring Term 2</h3>";
            echo "<p>" . nl2br(($row["Knowledge_and_skills_spring_Term_2"])) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Summer Term 1</h3>";
            echo "<p>" . nl2br(($row["Knowledge_and_skills_summer_Term_1"])) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Summer Term 2</h3>";
            echo "<p>" . nl2br(($row["Knowledge_and_skills_summer_Term_2"])) . "</p>";
            echo "</div>";
            echo "</div>";  // Close term-box
            
            if (!empty($row["Key_Assessments"])) {
                echo "<div class='assessment-box'>";
                echo "<h3>Key Assessments</h3>";
                echo "<p>" . nl2br(($row["Key_Assessments"])) . "</p>";
                echo "</div>";
            }
            
            if (!empty($row["key_assessments_au1"]) or !empty($row["key_assessments_au2"]) or !empty($row["key_assessments_sp1"]) or !empty($row["key_assessments_sp2"]) or !empty($row["key_assessments_su1"]) or !empty($row["key_assessments_su2"])) {

                echo "<div class='assessment-wrap'>";
                echo "<h3 style='clear: both; display: block; width: 100%;'>Key Assessments</h2>";
                echo "<div class='assessment-box'>";
                echo "<h3>Autumn Term 1</h3>";
                echo "<p>" . nl2br($row["key_assessments_au1"]) . "</p>";
                echo "</div>";

                echo "<div class='assessment-box'>";
                echo "<h3>Autumn Term 2</h3>";
                echo "<p>" . nl2br($row["key_assessments_au2"]) . "</p>";
                echo "</div>";

                echo "<div class='assessment-box'>";
                echo "<h3>Spring Term 1</h3>";
                echo "<p>" . nl2br($row["key_assessments_sp1"]) . "</p>";
                echo "</div>";

                echo "<div class='assessment-box'>";
                echo "<h3>Spring Term 2</h3>";
                echo "<p>" . nl2br($row["key_assessments_sp2"]) . "</p>";
                echo "</div>";

                echo "<div class='assessment-box'>";
                echo "<h3>Summer Term 1</h3>";
                echo "<p>" . nl2br($row["key_assessments_su1"]) . "</p>";
                echo "</div>";
                
                echo "<div class='assessment-box'>";
                echo "<h3>Summer Term 2</h3>";
                echo "<p>" . nl2br($row["key_assessments_su2"]) . "</p>";
                echo "</div>";

                echo "</div>"; // Close assessment-wrap

            } else if (empty($row["Key_Assessments"])){
                echo "<div class='assessment-box'>";
                echo "<h3>Key Assessments</h3>";
                echo "<p>" . nl2br(($row["Key_Assessments"])) . "</p>";
                echo "</div>";
            }

            echo "<div class='literacy-box'>";
            echo "<h3>Important Literacy and Numeracy</h3>";
            echo "<p>" . nl2br(($row["Important_literacy_and_numeracy"])) . "</p>";
            echo "</div>";
            echo "<div class='wider-skills-box'>";
            echo "<h3>Wider Skills</h3>";
            echo "<p>" . nl2br(($row["Wider_skills"])) . "</p>";
            echo "</div>";
            echo "<div class='help-box'>";
            echo "<h3>How You Can Help Your Child at Home</h3>";
            echo "<p>" . nl2br(($row["How_you_can_help_your_child_at_home"])) . "</p>";
            echo "</div>";
            echo "</div>";  // Close subject-box
        }

        $conn->close();
        ?>
    </div>
</body>
</html>
