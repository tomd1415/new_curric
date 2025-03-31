<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $Knowledge_and_skills_autumn_Term_1 = $_POST['Knowledge_and_skills_autumn_Term_1'];
    $Knowledge_and_skills_autumn_Term_2 = $_POST['Knowledge_and_skills_autumn_Term_2'];
    $Knowledge_and_skills_spring_Term_1 = $_POST['Knowledge_and_skills_spring_Term_1'];
    $Knowledge_and_skills_spring_Term_2 = $_POST['Knowledge_and_skills_spring_Term_2'];
    $Knowledge_and_skills_summer_Term_1 = $_POST['Knowledge_and_skills_summer_Term_1'];
    $Knowledge_and_skills_summer_Term_2 = $_POST['Knowledge_and_skills_summer_Term_2'];
    $Key_Assessments = $_POST['Key_Assessments'];
    $Important_literacy_and_numeracy = $_POST['Important_literacy_and_numeracy'];
    $Wider_skills = $_POST['Wider_skills'];
    $How_you_can_help_your_child_at_home = $_POST['How_you_can_help_your_child_at_home'];

    $sql = "UPDATE Curriculum SET 
            Knowledge_and_skills_autumn_Term_1=?, 
            Knowledge_and_skills_autumn_Term_2=?, 
            Knowledge_and_skills_spring_Term_1=?, 
            Knowledge_and_skills_spring_Term_2=?, 
            Knowledge_and_skills_summer_Term_1=?, 
            Knowledge_and_skills_summer_Term_2=?, 
            Key_Assessments=?, 
            Important_literacy_and_numeracy=?, 
            Wider_skills=?, 
            How_you_can_help_your_child_at_home=?
            WHERE id=?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssssssi', 
        $Knowledge_and_skills_autumn_Term_1, 
        $Knowledge_and_skills_autumn_Term_2, 
        $Knowledge_and_skills_spring_Term_1, 
        $Knowledge_and_skills_spring_Term_2, 
        $Knowledge_and_skills_summer_Term_1, 
        $Knowledge_and_skills_summer_Term_2, 
        $Key_Assessments, 
        $Important_literacy_and_numeracy, 
        $Wider_skills, 
        $How_you_can_help_your_child_at_home, 
        $id
    );

    if ($stmt->execute()) {
        echo "Record updated successfully";
    } else {
        echo "Error updating record: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}

header("Location: detailed.php");
exit();
?>

