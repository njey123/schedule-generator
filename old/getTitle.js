// Helper method to parse the title tag from the response
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}