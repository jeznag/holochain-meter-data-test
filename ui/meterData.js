function meterDataCreate(powerConsumed, meterID, timeStamp, callback) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/MeterData/meterDataCreate";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  var data = JSON.stringify({
    power_consumed_kwh: powerConsumed,
    meter_id: meterID,
    timestamp: timeStamp
  });
  xhr.send(data);
}

function meterDataRead(hash, callback) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/MeterData/meterDataCreate";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  var data = JSON.stringify({ hash: hash });
  xhr.send(data);
}
