<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Detailed Curriculum</title>
    <link rel="stylesheet" href="displaystyles.css">
    <link rel="stylesheet" href="styles.css">
    <script>
        function updateCell(id, field, newValue, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "update_cell2.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(JSON.parse(xhr.responseText));
                }
            };
            xhr.send("id=" + id + "&field=" + field + "&value=" + encodeURIComponent(newValue));
        }

        function makeEditable(event, id, field) {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'textarea') {
                return;  // Do nothing if it's already a textarea
            }
            const originalText = target.innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/<strong>/gi, '[b]')
                .replace(/<\/strong>/gi, '[/b]')
                .replace(/&nbsp;/gi, ' ')
                .trim();

            const textarea = document.createElement('textarea');
            textarea.value = originalText;
            textarea.style.height = (target.parentElement.clientHeight * 0.9) + "px";  // Set height to 90% of parent height

            target.replaceWith(textarea);
            textarea.focus();

            textarea.oninput = function () {
                textarea.style.height = "auto";
                textarea.style.height = (textarea.scrollHeight) + "px";
            };

            textarea.onblur = function () {
                const newText = textarea.value.trim();
                updateCell(id, field, newText, function(updatedRow) {
                    const updatedText = updatedRow[field]
                        .replace(/\n/g, '<br>')
                        .replace(/\[b\]/gi, '<strong>')
                        .replace(/\[\/b\]/gi, '</strong>');

                    const p = document.createElement('p');
                    p.innerHTML = updatedText;
                    p.onclick = function(event) { makeEditable(event, id, field); };
                    p.classList.add('editable');
                    textarea.replaceWith(p);
                });
            };
        }

        function convertTextareasToParagraphs() {
            document.querySelectorAll('.editable').forEach(element => {
                const id = element.getAttribute('data-id');
                const field = element.getAttribute('data-field');
                const newText = element.innerHTML
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<strong>/gi, '[b]')
                    .replace(/<\/strong>/gi, '[/b]')
                    .replace(/&nbsp;/gi, ' ')
                    .trim();
                updateCell(id, field, newText, function(updatedRow) {
                    const updatedText = updatedRow[field]
                        .replace(/\n/g, '<br>')
                        .replace(/\[b\]/gi, '<strong>')
                        .replace(/\[\/b\]/gi, '</strong>');

                    element.innerHTML = updatedText;
                    element.onclick = function(event) { makeEditable(event, id, field); };
                });
            });
        }

        document.addEventListener('DOMContentLoaded', function() {
            // Simulate click to make all sections editable and then blur to revert them
            setTimeout(() => {
                convertTextareasToParagraphs();
            }, 100);
        });
    </script>
</head>
<body>
    <div class="container">
        <?php include 'config.php'; ?>
        
        <h1>Detailed Curriculum</h1>
        
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

            echo "<div class='subject-box'>";
            echo "<h2>{$row['Subject']} - {$row['YearGroup']}</h2>";
            echo "<div class='term-box'>";
            echo "<h2 style='clear: both; display: block; width: 100%;'>Knowledge and Skills</h2>";
            echo "<div class='term'>";
            echo "<h3>Autumn Term 1</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Knowledge_and_skills_autumn_Term_1'>" . ($row["Knowledge_and_skills_autumn_Term_1"]) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Autumn Term 2</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Knowledge_and_skills_autumn_Term_2'>" . ($row["Knowledge_and_skills_autumn_Term_2"]) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Spring Term 1</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Knowledge_and_skills_spring_Term_1'>" . ($row["Knowledge_and_skills_spring_Term_1"]) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Spring Term 2</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Knowledge_and_skills_spring_Term_2'>" . ($row["Knowledge_and_skills_spring_Term_2"]) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Summer Term 1</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Knowledge_and_skills_summer_Term_1'>" . ($row["Knowledge_and_skills_summer_Term_1"]) . "</p>";
            echo "</div>";
            echo "<div class='term'>";
            echo "<h3>Summer Term 2</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Knowledge_and_skills_summer_Term_2'>" . ($row["Knowledge_and_skills_summer_Term_2"]) . "</p>";
            echo "</div>";
            echo "</div>";  // Close term-box
            echo "<div class='assessment-box'>";
            echo "<h3>Key Assessments</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Key_Assessments'>" . ($row["Key_Assessments"]) . "</p>";
            echo "</div>";
            echo "<div class='literacy-box'>";
            echo "<h3>Important Literacy and Numeracy</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Important_literacy_and_numeracy'>" . ($row["Important_literacy_and_numeracy"]) . "</p>";
            echo "</div>";
            echo "<div class='wider-skills-box'>";
            echo "<h3>Wider Skills</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='Wider_skills'>" . ($row["Wider_skills"]) . "</p>";
            echo "</div>";
            echo "<div class='help-box'>";
            echo "<h3>How You Can Help Your Child at Home</h3>";
            echo "<p class='editable' data-id='{$row["id"]}' data-field='How_you_can_help_your_child_at_home'>" . ($row["How_you_can_help_your_child_at_home"]) . "</p>";
            echo "</div>";
            echo "</div>";  // Close subject-box
        }

        $conn->close();
        ?>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Simulate click to make all sections editable and then blur to revert them
            setTimeout(() => {
                convertTextareasToParagraphs();
            }, 100);
        });
    </script>
</body>
</html>
