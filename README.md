This repo contains code for testing query performance with large holochain datasets.

# Instructions

1. npm install

2. hcdev --no-nat-upnp web 5090

3. In another terminal, run `node generate-meter-data.js`

4. Wait > 10 seconds for meter data to populate (it will take 1.5hrs to commit all of the 270k data points)

5. Use Postman or similar to make a POST request with this payload:

```
{
	"meter_id": "1",
	"start_timestamp": "2017-05-09T14:00:00.000Z",
	"end_timestamp": "2017-09-02T14:00:00.000Z"
}
```

to this URL: `http://localhost:5090/fn/MeterDataStorage/meterDataRead`

6. Observe query performance. 

7. Wait a bit longer (allowing more meter data to be added) and try querying again.
