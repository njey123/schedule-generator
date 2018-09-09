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

      var promise = $.getJSON("php/getWebpageInfo.php", inputData);
      
      promise.done(function(response) { 
        data = response;
        console.log(data);
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
      // If course input is not empty, check if it is valid
      } else {
        for(var i = 0; i < data.length; i++) {
          // If valid course
          if (courseToAdd === data[i]["courseCode"]) {
            // List course on homepage
            $(".courseList").append('<div class="item">' + "• " + courseToAdd + '</div>');
  
            var element = document.getElementById("courseListID");
            var numberOfChildren = element.getElementsByTagName('*').length;
      
            if (numberOfChildren === 1 && !isDescOnPage) {
              // Display small description that is placed above list of courses
              $(".courseList").prepend('<p class="descForCourseList">Displaying course timings for the following courses (click a course to remove it): </p>');
              isDescOnPage = true;
            }

            addCourseToSchedule(i);
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
    var courseCode = $(this).html();
    courseCode = (courseCode.substring(courseCode.length-4, courseCode.length)).trim();
    $('.' + courseCode).removeClass("schedule-highlighted");
    $(this).remove();

    var element = document.getElementById("courseListID");
    var numberOfChildren = element.getElementsByTagName('*').length;

    if ((numberOfChildren - 1) === 0) {
      // Display small description that is placed above list of courses
      $(".descForCourseList").remove();
      isDescOnPage = false;
    }
  });

  // Notify user of invalid URL
  function addInvalidURLMessage() {
    if(isDescOnPage) {
      $(".item").remove();
      $(".descForCourseList").remove();
      isDescOnPage = false;
    }
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

  // Create and display a schedule layout
  function createScheduleLayout() {
    // If there is no schedule on the page, create a schedule
    if (!isScheduleOnPage) {
      var scheduleLayout = '<table class="scheduleLayout"> <thead><tr><th>Time</th> <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th></tr></thead>';
      scheduleLayout += "<tbody>";
  
      for (var i = 8; i < 10; i++) {
        scheduleLayout += '<tr><td>' + i + ':00AM</td><td id="s0' + i + '00AM-M"></td><td id="s0' + i + '00AM-T"></td><td id="s0' + i + '00AM-W"></td><td id="s0' + i + '00AM-Th"></td><td id="s0' + i + '00AM-F"></td></tr>';
        scheduleLayout += '<tr><td>' + i + ':30AM</td><td id="s0' + i + '30AM-M"></td><td id="s0' + i + '30AM-T"></td><td id="s0' + i + '30AM-W"></td><td id="s0' + i + '30AM-Th"></td><td id="s0' + i + '30AM-F"></td></tr>';
      }

      for (var i = 10; i < 12; i++) {
        scheduleLayout += '<tr><td>' + i + ':00AM</td><td id="s' + i + '00AM-M"></td><td id="s' + i + '00AM-T"></td><td id="s' + i + '00AM-W"></td><td id="s' + i + '00AM-Th"></td><td id="s' + i + '00AM-F"></td></tr>';
        scheduleLayout += '<tr><td>' + i + ':30AM</td><td id="s' + i + '30AM-M"></td><td id="s' + i + '30AM-T"></td><td id="s' + i + '30AM-W"></td><td id="s' + i + '30AM-Th"></td><td id="s' + i + '30AM-F"></td></tr>';
      }
  
      scheduleLayout += '<tr><td>12:00PM</td><td id="s12:00PM-M"></td><td id="s12:00PM-T"></td><td id="s12:00PM-W"></td><td id="s12:00PM-Th"></td><td id="s12:00PM-F"></td></tr>';
      scheduleLayout += '<tr><td>12:30PM</td><td id="s12:30PM-M"></td><td id="s12:30PM-T"></td><td id="s12:30PM-W"></td><td id="s12:30PM-Th"></td><td id="s12:30PM-F"></td></tr>';
  
      for (var i = 1; i < 10; i++) {
        scheduleLayout += '<tr><td>' + i + ':00PM</td><td id="s0' + i + '00PM-M"></td><td id="s0' + i + '00PM-T"></td><td id="s0' + i + '00PM-W"></td><td id="s0' + i + '00PM-Th"></td><td id="s0' + i + '00PM-F"></td></tr>';
        scheduleLayout += '<tr><td>' + i + ':30PM</td><td id="s0' + i + '30PM-M"></td><td id="s0' + i + '30PM-T"></td><td id="s0' + i + '30PM-W"></td><td id="s0' + i + '30PM-Th"></td><td id="s0' + i + '30PM-F"></td></tr>';
      }

      for (var i = 10; i < 12; i++) {
        scheduleLayout += '<tr><td>' + i + ':00PM</td><td id="s' + i + '00PM-M"></td><td id="s' + i + '00PM-T"></td><td id="s' + i + '00PM-W"></td><td id="s' + i + '00PM-Th"></td><td id="s' + i + '00PM-F"></td></tr>';
        scheduleLayout += '<tr><td>' + i + ':30PM</td><td id="s' + i + '30PM-M"></td><td id="s' + i + '30PM-T"></td><td id="s' + i + '30PM-W"></td><td id="s' + i + '30PM-Th"></td><td id="s' + i + '30PM-F"></td></tr>';
      }
      
      scheduleLayout += "</tbody>";
      scheduleLayout += "</table>";
  
      $(".schedule").append(scheduleLayout);
  
      isScheduleOnPage = true;
    // If there is a schedule on the page, remove it and create a new one
    } else if (isScheduleOnPage) {
      $(".scheduleLayout").remove();
      $(".courseList").empty();

      isScheduleOnPage = false;
      isDescOnPage = false;
      
      createScheduleLayout();
    }
  }

  // Add course with specific course code to the schedule layout
  function addCourseToSchedule(courseCodeIdx) {
    for (var i = 0; i < data[courseCodeIdx]["time"].length; i++) {
      var courseCode = data[courseCodeIdx]["courseCode"];
      var time = data[courseCodeIdx]["time"][i];
      var startTimeHour = data[courseCodeIdx]["startTimeHour"][i];
      var startTimeMinute = data[courseCodeIdx]["startTimeMinute"][i];
      var endTimeHour = data[courseCodeIdx]["endTimeHour"][i];
      var endTimeMinute = data[courseCodeIdx]["endTimeMinute"][i];
      var days = data[courseCodeIdx]["days"][i];

      if (days.length !== 1 && days.trim() !== "Th") {
        // For each day the course is taught
        for(var dayIdx = 0; dayIdx < days.length; dayIdx++) {
          var currHour = startTimeHour;
          var currMinute = startTimeMinute;

          // Morning class
          if (parseInt(startTimeHour) > 7 && parseInt(startTimeHour) < 12) {
            $('#s' + startTimeHour + startTimeMinute + 'AM-' + days[dayIdx]).addClass("schedule-highlighted");
            $('#s' + startTimeHour + startTimeMinute + 'AM-' + days[dayIdx]).addClass(courseCode);
          // Afternoon or evening class
          } else {
            $('#s' + startTimeHour + startTimeMinute + 'PM-' + days[dayIdx]).addClass("schedule-highlighted");
            $('#s' + startTimeHour + startTimeMinute + 'PM-' + days[dayIdx]).addClass(courseCode); 
          }
        }
      } else {
        var currHour = startTimeHour;
        var currMinute = startTimeMinute;

        // Morning class
        if (parseInt(startTimeHour) > 7 && parseInt(startTimeHour) < 12) {
          $('#s' + startTimeHour + startTimeMinute + 'AM-' + days).addClass("schedule-highlighted");
          $('#s' + startTimeHour + startTimeMinute + 'AM-' + days).addClass(courseCode);

          // Fill schedule depending on time of course
          while((parseInt(currHour) + 1 <= endTimeHour && parseInt(currMinute) + 30 !== parseInt(endTimeMinute) + 10) || (parseInt(currHour) + 2 <= endTimeHour && parseInt(currMinute) + 60 !== parseInt(endTimeMinute) + 10)) {
            if(parseInt(currMinute) === 30) {
              temp = parseInt(currHour) + 1;
               if(parseInt(temp) < 10) {
                 temp = "0" + temp;
               }

              $('#s' + temp + '00AM-' + days).addClass("schedule-highlighted");
              $('#s' + temp + '00AM-' + days).addClass(courseCode);
              currMinute = 0;

            } else {
              currHour++;
              if(parseInt(currHour) < 10) {
                currHour = "0" + currHour;
              }

              $('#s' + currHour + '30AM-' + days).addClass("schedule-highlighted");
              $('#s' + currHour + '30AM-' + days).addClass(courseCode);
              currMinute = 30;
            }
          }
        // Afternoon or evening class
        } else {
          $('#s' + startTimeHour + startTimeMinute + 'PM-' + days).addClass("schedule-highlighted");
          $('#s' + startTimeHour + startTimeMinute + 'PM-' + days).addClass(courseCode); 
        }
      }
    }
  }
}

$(document).ready(main);