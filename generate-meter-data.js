const fs = require("fs");
const filename = "solar-analytics-data-91.csv";
const neatCsv = require("neat-csv");

const data = fs.readFileSync(filename);

neatCsv(data).then(dataset => {
  const request = require("request");
  const processedData = dataset.map((datum) => ({
    timestamp: new Date(datum.timestamp).toISOString(),
    power_consumed_kwh: parseFloat(datum.power_consumed_kwh) / 1000,
    meter_id: 'Your house'
  }));

  request.post(
    "http://localhost:5090/fn/MeterDataStorage/meterDataCreate",
    { body: JSON.stringify({ batchData: processedData }) },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      } else {
        console.log(error, body);
      }
    }
  );
});
