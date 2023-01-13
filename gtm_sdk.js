const logToConsole = require('logToConsole');

const getTimestampMillis = require('getTimestampMillis');
const JSON = require('JSON');
const sendPixel = require('sendPixel');
const localStorage = require('localStorage');
const Math = require('Math');
const generateRandom = require('generateRandom');
const callInWindow = require('callInWindow');

// enable logs if users gave permission
const log = data.logsEnabled ? logToConsole : (() => {});

// ===========================================================================
// Device ID logic
// ===========================================================================
let deviceID = localStorage.getItem('cly_id');
const time = getTimestampMillis();

/**
*  Generate random UUID value
*  @return {String} random UUID value
*/
function generateUUID() {
  // Generate a random hexadecimal string of length 8
  let a = Math.floor(generateRandom(0,2147483647) * Math.pow(16, 8)).toString(16);

  // Pad the string with leading zeros
  while (a.length < 8) {
    a += '0';
  }

  // Generate a random hexadecimal string of length 4
  let b = Math.floor(generateRandom(0,2147483647) * Math.pow(16, 4)).toString(16);

  // Pad the string with leading zeros
  while (b.length < 4) {
    b += '0';
  }

  // Generate a random hexadecimal string of length 4
  let c = Math.floor(generateRandom(0,2147483647) * Math.pow(16, 4)).toString(16);

  // Pad the string with leading zeros
  while (c.length < 4) {
    c += '0';
  }

  // Generate a random hexadecimal string of length 4
  let d = Math.floor(generateRandom(0,2147483647) * Math.pow(16, 4)).toString(16);

  // Pad the string with leading zeros
  while (d.length < 4) {
    d += '0';
  }

  // Generate a random hexadecimal string of length 12
  let e = Math.floor(generateRandom(0,2147483647) * Math.pow(16, 12)).toString(16);

  // Pad the string with leading zeros
  while (e.length < 12) {
    e += '0';
  }

  // Concatenate the hexadecimal strings
  let uuid = a + b + c + d + e;

  // Insert hyphens at the specified positions
  uuid = uuid.substring(0, 8) + '-' + uuid.substring(8, 4) + '-' + uuid.substring(12, 4) + '-' + uuid.substring(16, 4) + '-' + uuid.substring(20, 12);

  return uuid;
}

if (!deviceID) {
  deviceID = generateUUID();
}

// ===========================================================================
// Process user provided information
// ===========================================================================
// TODO: check if url has back slash at the end and remove it
// TODO: Device ID generator
// TODO: Device ID checking function

const url = data.serverUrl;
const appKey = data.appKey;


// form the event
const event = {};
event.key = data.eventName;
event.count = data.count;
event.sum = data.sum;
event.segmentation = {};
const segKey = data.paramTable1[0].key;
const segVal = data.paramTable1[0].value;
event.segmentation[segKey] = segVal;
event.timestamp = time;

// send event to queue
const eventQ = [];
eventQ.push(event);

// ===========================================================================
// Form the URL for the get request
// ===========================================================================
const endPoint = url + '/i?';
const load = JSON.stringify(eventQ); // stringify the event queue
const eventInfo = 'events=' + load;
const sdkNameInfo = '&sdk_name=tag_manager';
const deviceIdInfo = '&device_id=' + deviceID;
const appKeyInfo = '&app_key=' + appKey;
const payload = endPoint + eventInfo + appKeyInfo + deviceIdInfo + sdkNameInfo;

log('Given data:', data);
log('URL:', payload);


// ===========================================================================
// Get request
// ===========================================================================

const onSuccess = () => {
  log('Event send');
  data.gtmOnSuccess();
};

const onFailure = () => {
  log('Event was not send');
  data.gtmOnFailure();
};

// send the request
sendPixel(payload.toString(), onSuccess, onFailure);