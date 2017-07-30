function main() {
  // Boolean used to determine if description for course list is already on the page
  var isDescOnPage = false;
  // Boolean used to determine if invalid URL message is already on the page
  var isInvalidURLMessageOnPage = false;
  // Boolean used to determine if schedule is already on the page
  var isScheduleOnPage = false;
  // Contains data from Schedule of Classes URL
  var data = [];
  
  // Schedule of Classes URL
  document.getElementById('scheduleOfClassesLinkInput').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    var scheduleOfClassesURL = ($("input[name=scheduleOfClassesLink]").val()).trim();
    var scheduleOfClassesSubstr = scheduleOfClassesURL.substring(0, 26);

    // If Enter pressed but input is empty or not from the Schedule of Classes website
    if (keyCode == '13' && (scheduleOfClassesURL.length === 0 || scheduleOfClassesSubstr !== "https://info.uwaterloo.ca/")) {
      addInvalidURLMessage();
      return false;

    // Else if Enter is pressed, get info from URL
    } else if (keyCode == '13') {
      
      var inputData = { 
        scheduleOfClassesURL: scheduleOfClassesURL
      };

      var promise = $.getJSON("php/getURLInfo.php", inputData);
      
      promise.done(function(response) { 
        data = response;
      });

      removeInvalidURLMessage();
      createScheduleLayout();

      return false;
    }
  }

  // Add a course when user presses Enter
  document.getElementById('courseItemInput').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    var scheduleOfClassesURL = ($("input[name=scheduleOfClassesLink]").val()).trim();
    var scheduleOfClassesSubstr = scheduleOfClassesURL.substring(0, 26);

    // If Enter key is pressed and valid URL is entered
    if (keyCode == '13' && scheduleOfClassesURL.length !== 0 && scheduleOfClassesSubstr === "https://info.uwaterloo.ca/") {
      var courseToAdd = ($('input[name=courseItem]').val()).trim();
  
      // If course input is empty
      if (courseToAdd.length === 0) {
        return false;
      } else {
        for(var i = 0; i < data.length; i++) {
          if (courseToAdd === data[i]["courseCode"]) {
            $(".courseList").append('<div class="item">' + "• " + courseToAdd + '</div>');
  
            var element = document.getElementById("courseListID");
            var numberOfChildren = element.getElementsByTagName('*').length;
      
            if (numberOfChildren === 1 && !isDescOnPage) {
              // Display small description that is placed above list of courses
              $(".courseList").prepend('<p class="descForCourseList">Displaying course timings for the following courses (click a course to remove it): </p>');
              isDescOnPage = true;
            }
          }
        }
        return false;
      }
    } else if(keyCode == '13') {
      return false;
    }
  }

  // Remove a course when user clicks the course
  $(document).on('click', '.item', function() {
    $(this).remove();

    var element = document.getElementById("courseListID");
    var numberOfChildren = element.getElementsByTagName('*').length;

    if ((numberOfChildren - 1) === 0) {
      // Display small description that is placed above list of courses
      $(".descForCourseList").remove();
      isDescOnPage = false;
    }
  });

  // // Parse HTML from Schedule of Classes webpage
  // function parseHTML(response) {
  //   var lines = response.split('\n');
  //   var courseCodeLines = [];
  //   var courseCodeIdx = 0;
// 
  //   for (var line = 0; line < lines.length; line++){
  //     // Find course codes
  //     if (lines[line] === '<TR><TD ALIGN="center">BME     </TD>') {
  //       // console.log(lines[line + 1]);
  //       courseCodeLines[courseCodeIdx] = lines[line];
  //       courseCodeIdx++;
  //     } 
  //   }
  // }

  // Notify user of invalid URL
  function addInvalidURLMessage() {
    if (isScheduleOnPage) {
      $(".scheduleLayout").remove();
      isScheduleOnPage = false;
    }
    if (!isInvalidURLMessageOnPage) {
      $(".schedule").append('<p class="invalidURL">Error: Invalid URL entered.<br />Please re-enter the URL.</p>');
      isInvalidURLMessageOnPage = true;
    }
  }

  // Remove invalid URL message if present and if valid URL
  function removeInvalidURLMessage() {
    if (isInvalidURLMessageOnPage) {
      $(".invalidURL").remove();
      isInvalidURLMessageOnPage = false;
    }
  }

  // Create and display schedule
  function createScheduleLayout() {
    if (!isScheduleOnPage) {
      var scheduleLayout = '<table class="scheduleLayout"> <thead><tr><th>Time</th> <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th></tr></thead>';
      scheduleLayout += "<tbody>";
  
      for (var i = 8; i < 12; i++) {
        scheduleLayout += '<tr><td>' + i + ':00AM</td><td></td><td></td><td></td><td></td><td></td></tr>';
        scheduleLayout += '<tr><td>' + i + ':30AM</td><td></td><td></td><td></td><td></td><td></td></tr>';
      }
  
      scheduleLayout += '<tr><td>12:00PM</td><td></td><td></td><td></td><td></td><td></td></tr>';
      scheduleLayout += '<tr><td>12:30PM</td><td></td><td></td><td></td><td></td><td></td></tr>';
  
      for (var i = 1; i < 12; i++) {
        scheduleLayout += '<tr><td>' + i + ':00PM</td><td></td><td></td><td></td><td></td><td></td></tr>';
        scheduleLayout += '<tr><td>' + i + ':30PM</td><td></td><td></td><td></td><td></td><td></td></tr>';
      }
      
      scheduleLayout += "</tbody>";
      scheduleLayout += "</table>";
  
      $(".schedule").append(scheduleLayout);
  
      isScheduleOnPage = true;
    }
  }
}

$(document).ready(main);