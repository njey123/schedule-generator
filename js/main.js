function main() {
  // Boolean used to determine if description for course list is already on the page
  var isDescOnPage = false;

  // Add a course when user presses Enter
  document.getElementById('courseInput').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    var courseToAdd = ($('input[name=courseItem]').val()).trim();

    // If Enter pressed but course input is empty
    if (keyCode == '13' && courseToAdd.length === 0) {
      return false;
    // Else if Enter is pressed
    } else if (keyCode == '13') {
      $(".courseList").append('<div class="item">' + "• " + courseToAdd + '</div>');

      var element = document.getElementById("courseListID");
      var numberOfChildren = element.getElementsByTagName('*').length;

      if (numberOfChildren === 1 && !isDescOnPage) {
        // Display small description that is placed above list of courses
        $(".courseList").prepend('<p class="descForCourseList">Displaying course timings for: </p>');
        isDescOnPage = true;
      }

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
}

$(document).ready(main);