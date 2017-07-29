// Code below was taken from https://www.html5rocks.com/en/tutorials/cors/#toc-making-a-cors-request

// Create the XHR object
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported
    xhr = null;
  }
  return xhr;
}