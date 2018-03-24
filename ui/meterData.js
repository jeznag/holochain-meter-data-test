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

    const amplifiedConsumption =
      Math.abs(datum.power_consumed_kwh) * Math.random() * 200;
    // make the numbers a bit more similar
    const cappedConsumption = parseFloat((Math.max(
      Math.min(amplifiedConsumption, Math.random() * 80),
      Math.random() * 20
    )).toFixed(2));
    result[meterID].totalEnergyKilowattHours += cappedConsumption;
    result[meterID].numThirtyMinuteDataPoints += 1;
    result[meterID].data.push(
      Object.assign(datum, {
        power_consumed_kwh: cappedConsumption
      })
    );
    return result;
  }, {});

  return Object.keys(processedData).reduce((result, meterID) => {
    const averageUsagePerDay =
      Math.abs(processedData[meterID].totalEnergyKilowattHours) /
      processedData[meterID].numThirtyMinuteDataPoints *
      48;

    result[meterID] = {
      averageUsagePerDay: (averageUsagePerDay).toFixed(2),
      averageSpendPerDay: (averageUsagePerDay * 0.2).toFixed(2),
      data: processedData[meterID].data
    };
    return result;
  }, {});
}
