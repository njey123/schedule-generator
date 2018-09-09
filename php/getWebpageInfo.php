<?php
  $scheduleOfClassesURL = $_GET["scheduleOfClassesURL"];

  $handle = curl_init();
  curl_setopt($handle, CURLOPT_URL, $scheduleOfClassesURL);
  curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
  $html = curl_exec($handle);

  // Split array by newline
  $lines = explode("\n", $html);
  
  // Regular expression for time and day of courses
  $dayTimeRegex = "/((2[0-3]|[01][0-9]):([0-5][0-9])-(2[0-3]|[01][0-9]):([0-5][0-9]))([MTWhF]{0,6})/";
  // Regular expression for department, including HTML tags (this helps to find the course code)
  $deptRegex = "/([A-Z]{2,4})     /";

  $courseCodeIdx = -1;
  $data = array(
    array(
      "courseCode" => array(),
      "time" => array(),
      "startTimeHour" => array(),
      "startTimeMinute" => array(),
      "endTimeHour" => array(),
      "endTimeMinute" => array(),
      "days" => array()
    )
  );

  // Find course codes and corresponding time and day of courses
  for ($line = 0; $line < count($lines); $line++){
    if (preg_match($deptRegex, strip_tags($lines[$line]), $deptMatches)) {
      $courseCodeIdx++;
      $dayTimeIdx = 0;
      $data[$courseCodeIdx]["courseCode"] = strip_tags($lines[$line + 1]);
    } else if (preg_match($dayTimeRegex, strip_tags($lines[$line]), $matches)) {
      $data[$courseCodeIdx]["time"][$dayTimeIdx] = $matches[1];
      $data[$courseCodeIdx]["startTimeHour"][$dayTimeIdx] = $matches[2];
      $data[$courseCodeIdx]["startTimeMinute"][$dayTimeIdx] = $matches[3];
      $data[$courseCodeIdx]["endTimeHour"][$dayTimeIdx] = $matches[4];
      $data[$courseCodeIdx]["endTimeMinute"][$dayTimeIdx] = $matches[5];
      $data[$courseCodeIdx]["days"][$dayTimeIdx] = $matches[count($matches) - 1];

      $dayTimeIdx++;
    } 
  }

  echo json_encode($data);

  curl_close($handle);
?>