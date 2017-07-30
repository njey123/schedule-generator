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

  $currCourseCodeIdx = -1;
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
    if (!(strcmp($lines[$line], '<TR><TD ALIGN="center">BME     </TD>'))) {
        $currCourseCodeIdx++;
        $dayTimeIdx = 0;
        $data[$currCourseCodeIdx]["courseCode"] = strip_tags($lines[$line + 1]);
    } else if (preg_match($dayTimeRegex, strip_tags($lines[$line]), $matches)) {
      $data[$currCourseCodeIdx]["time"][$dayTimeIdx] = $matches[1];
      $data[$currCourseCodeIdx]["startTimeHour"][$dayTimeIdx] = $matches[2];
      $data[$currCourseCodeIdx]["startTimeMinute"][$dayTimeIdx] = $matches[3];
      $data[$currCourseCodeIdx]["endTimeHour"][$dayTimeIdx] = $matches[4];
      $data[$currCourseCodeIdx]["endTimeMinute"][$dayTimeIdx] = $matches[5];
      $data[$currCourseCodeIdx]["days"][$dayTimeIdx] = $matches[count($matches) - 1];

      $dayTimeIdx++;
    } 
  }

  echo json_encode($data);

  curl_close($handle);
?>