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
        numFifteenMinuteDataPoints: 0,
        data: []
      };
    }

    const consumption = datum.power_consumed_kwh;

    result[meterID].totalEnergyKilowattHours += consumption;
    result[meterID].numFifteenMinuteDataPoints += 1;
    result[meterID].data.push(datum);
    return result;
  }, {});

  return Object.keys(processedData).reduce((result, meterID) => {
    const averageUsagePerDay =
      (Math.abs(processedData[meterID].totalEnergyKilowattHours) /
        processedData[meterID].numFifteenMinuteDataPoints) *
      (24 * (60 / 15));

    result[meterID] = {
      averageUsagePerDay: averageUsagePerDay.toFixed(2),
      averageSpendPerDay: (averageUsagePerDay * 0.2).toFixed(2),
      data: processedData[meterID].data
    };
    return result;
  }, {});
}
