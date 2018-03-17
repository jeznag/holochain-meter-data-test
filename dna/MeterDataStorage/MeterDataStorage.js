"use strict";

// -----------------------------------------------------------------
//  Exposed functions with custom logic https://developer.holochain.org/API_reference
// -----------------------------------------------------------------

function meterDataCreate(meterDatum) {
  debug(
    "receiving create " + (meterDatum.batchData && meterDatum.batchData.length)
  );
  if (meterDatum.batchData) {
    var startTime = new Date();
    meterDatum.batchData.forEach(function(datum) {
      return commit("meter_data", datum);
    });

    var duration = new Date() - startTime;
    debug("finished committing!" + duration);
    return { status: "Complete!" };
  } else {
    return commit("meter_data", meterDatum);
  }
}

function performQuery(type, queryOptions) {
  var startTime = new Date();

  var result = query(queryOptions);

  debug(type + " - duration: " + (new Date() - startTime));
  return result;
}

function meterDataRead(queryData) {
  debug("receiving read " + JSON.stringify(queryData));
  var startTimeForRequest = new Date();

  var meterID = queryData.meter_id;
  var startTimeStamp = queryData.start_timestamp;
  var endTimeStamp = queryData.end_timestamp;

  var allDataForMeter = performQuery('constraints', {
    Return: { Entries: true },
    Constrain: {
      EntryTypes: ["meter_data"],
      Contains: JSON.stringify({
        meter_id: meterID
      })
    }
  });
  performQuery('hashes', {
    Return: { Hashes: true },
    Constrain: {
      EntryTypes: ["meter_data"],
      Contains: JSON.stringify({
        meter_id: meterID
      })
    }
  });
  performQuery('no constraint', {
    Return: { Hashes: true },
    Constrain: {
      EntryTypes: ["meter_data"]
    }
  });
  performQuery('everything', {
    Return: { Hashes: true }
  });

  var queryFinishedTimeStamp = new Date();
  var queryDuration = queryFinishedTimeStamp - startTimeForRequest;
  debug("Query took " + queryDuration + " ms");

  debug("all data" + allDataForMeter.length);

  var endTimeStampDate = new Date(endTimeStamp);
  var startTimeStampDate = new Date(startTimeStamp);
  var queryResult = allDataForMeter.filter(function(datum) {
    var dateVersionOfTimeStamp = new Date(datum.timestamp);
    var withinTimeRange =
      dateVersionOfTimeStamp <= endTimeStampDate &&
      dateVersionOfTimeStamp >= startTimeStampDate;

    if (!withinTimeRange) {
      debug(
        dateVersionOfTimeStamp +
          " " +
          (dateVersionOfTimeStamp <= endTimeStampDate) +
          (dateVersionOfTimeStamp >= startTimeStampDate)
      );
    }
    return withinTimeRange;
  });

  var processingTimeStamp = new Date();
  var processingDuration = processingTimeStamp - queryFinishedTimeStamp;
  debug("Processing took " + processingDuration + " ms");
  debug("Total duration" + (processingTimeStamp - startTimeForRequest) + "ms");
  debug("Found " + queryResult.length);
  return queryResult;
}

function meter_Create(params) {
  // your custom code here
  return {};
}

function meter_Read(params) {
  // your custom code here
  return {};
}

// -----------------------------------------------------------------
//  The Genesis Function https://developer.holochain.org/genesis
// -----------------------------------------------------------------

/**
 * Called only when your source chain is generated
 * @return {boolean} success
 */
function genesis() {
  return true;
}

// -----------------------------------------------------------------
//  Validation functions for every change to the local chain or DHT
// -----------------------------------------------------------------

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {*} entry - the entry data to be set
 * @param {object} header - header for the entry containing properties EntryLink, Time, and Type
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateCommit(entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "meter_data":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successful if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return false;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {*} entry - the entry data to be set
 * @param {object} header - header for the entry containing properties EntryLink, Time, and Type
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validatePut(entryName, entry, header, pkg, sources) {
  switch (entryName) {
    case "meter_data":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return true;
    default:
      // invalid entry name
      return false;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {*} entry - the entry data to be set
 * @param {object} header - header for the entry containing properties EntryLink, Time, and Type
 * @param {string} replaces - the hash for the entry being updated
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateMod(entryName, entry, header, replaces, pkg, sources) {
  switch (entryName) {
    case "meter_data":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return false;
    default:
      // invalid entry name
      return false;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {string} hash - the hash of the entry to remove
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateDel(entryName, hash, pkg, sources) {
  switch (entryName) {
    case "meter_data":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return false;
    default:
      // invalid entry name
      return false;
  }
}

/**
 * Called to validate any changes to the local chain or DHT
 * @param {string} entryName - the type of entry
 * @param {string} hash - the hash of the base entry being linked
 * @param {?} hash - ?
 * @param {*} pkg - the extra data provided by the validate[X]Pkg methods
 * @param {object} sources - an array of strings containing the keys of any authors of this entry
 * @return {boolean} is valid?
 */
function validateLink(entryName, baseHash, links, pkg, sources) {
  switch (entryName) {
    case "meter_data":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successfull if this returns true, so watch out!
      return false;
    default:
      // invalid entry name
      return false;
  }
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validatePutPkg(entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateModPkg(entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateDelPkg(entryName) {
  return null;
}

/**
 * Called to get the data needed to validate
 * @param {string} entryName - the name of entry to validate
 * @return {*} the data required for validation
 */
function validateLinkPkg(entryName) {
  return null;
}
