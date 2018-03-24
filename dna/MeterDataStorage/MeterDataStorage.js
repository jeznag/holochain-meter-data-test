"use strict";

function anchor(anchorType, anchorText) {
  var anchorHash = JSON.parse(
    call(
      "anchors",
      "anchor",
      JSON.stringify({
        anchorType: anchorType,
        anchorText: anchorText
      })
    )
  );
  return anchorHash;
}

// -----------------------------------------------------------------
//  Exposed functions with custom logic https://developer.holochain.org/API_reference
// -----------------------------------------------------------------

function meterDataCreate(meterDatum) {
  debug(
    "receiving create " + (meterDatum.batchData && meterDatum.batchData.length)
  );
  if (meterDatum.batchData) {
    var startTime = new Date();
    var hasPrinted = false;
    meterDatum.batchData.forEach(function(datum) {
      var meterID = datum.meter_id;
      var anchorHash = anchor("meter", meterID);
      if (meterID === "1" && !hasPrinted) {
        debug("YOYOYO creating anchor");
        debug(anchorHash);
        hasPrinted = true;
      }
      var dataHash = commit("meter_data", datum);
      var linkHash = commit("meter_to_meter_data_link", {
        Links: [
          {
            Base: anchorHash,
            Link: dataHash,
            Tag: "meter_data"
          }
        ]
      });
      return dataHash;
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
  return performQuery("no constraint", {
    Return: { Entries: true },
    Constrain: {
      EntryTypes: ["meter_data"]
    }
  });
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
    case "meter_to_meter_data_link":
      // be sure to consider many edge cases for validating
      // do not just flip this to true without considering what that means
      // the action will ONLY be successful if this returns true, so watch out!
      return true;
    default:
      debug(arguments);
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
