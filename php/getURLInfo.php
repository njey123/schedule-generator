<?php
    $scheduleOfClassesURL = $_GET["scheduleOfClassesURL"];

    $handle = curl_init();
    curl_setopt($handle, CURLOPT_URL, $scheduleOfClassesURL);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    $html = curl_exec($handle);

    echo json_encode($html);

    curl_close($handle);
?>