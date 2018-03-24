function meterDataRead(callback) {
  var xhr = new XMLHttpRequest();
  var url = "/fn/MeterDataStorage/meterDataRead";
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

function processData(data) {
  const processedData = data.reduce((result, datum) => {
    const meterID = datum.meter_id;
    if (!result[meterID]) {
      result[meterID] = {
        totalEnergyKilowattHours: 0,
        numThirtyMinuteDataPoints: 0,
        data: []
      };
    }

    result[meterID].totalEnergyKilowattHours += datum.power_consumed_kwh;
    result[meterID].numThirtyMinuteDataPoints += 1;
    result[meterID].data.push(datum);
    return result;
  }, {});

  return Object.keys(processedData).reduce((result, meterID) => {
    const averageUsagePerDay =
      Math.abs(processedData[meterID].totalEnergyKilowattHours) /
      processedData[meterID].numThirtyMinuteDataPoints *
      48;

    const amplifiedUsagePerDay = averageUsagePerDay * 1000;
    result[meterID] = {
      averageUsagePerDay: averageUsagePerDay,
      averageSpendPerDay: averageUsagePerDay * 0.2,
      data: processedData[meterID].data
    };
    return result;
  }, {});
}
