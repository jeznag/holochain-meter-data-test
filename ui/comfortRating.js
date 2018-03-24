function comfortRatingCreate(dataToPost, callback) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/OccupantComfort/comfortRatingCreate";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  var data = JSON.stringify(dataToPost);
  xhr.send(data);
}

function comfortRatingsRead(callback) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/OccupantComfort/comfortRatingsRead";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  var data = JSON.stringify({});
  xhr.send(data);
}
