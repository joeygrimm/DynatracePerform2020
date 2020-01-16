/*
********************************************************
*                                                      *
*  This script requires Google Apps Script associated  *
*  with a Google Sheet in order to function.           *
*                                                      *
********************************************************
*/

// build menu and add to ui
function onOpen(e) {
  var ui = SpreadsheetApp.getUi(); // Reference to the SpreadsheetApp UI
  var menu = ui.createMenu('Dynatrace');
  menu.addItem('Setup', 'setupSheets');
  menu.addItem('Define Metric', 'defineMetric');
  menu.addItem('Start Device', 'startDevice');
  menu.addItem('Stop Device', 'stopDevice');
  menu.addToUi();
}

function setupSheets() {
  // get all the sheets in the spreadsheet
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  // rename the existing sheets
  for (var x = 0; x < sheets.length; x++) {
    sheets[x].setName('delete' + x);
  }
  // insert new sheet for config
  spreadsheet.insertSheet('Config', 0);
  // delete the old sheets
  for (var x = 0; x < sheets.length; x++) {
    spreadsheet.deleteSheet(sheets[x]);
  }
  // set up the config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  config_sheet.getRange(1, 1, 1, 3).setValues([['tenant id', 'api key', 'metric']]).setFontWeight('bold');
  config_sheet.getRange(4, 1, 1, 9).setValues([['#', 'Name', 'Hostname', 'IP Address', 'Icon', 'Properties', 'Tags', 'MinMetric', 'MaxMetric']]).setFontWeight('bold');
  config_sheet.getRange(5, 1, 5, 1).setValues([[1],[2],[3],[4],[5]]);
  config_sheet.getRange(4, 1, 6, 9).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREEN, true, false)
}

// triggers don't let you send parameters, so create wrapper functions that call sendDevice with a device_id parameter as a work around
function device1() {
  sendDevice(1);
}

function device2() {
  sendDevice(2);
}

function device3() {
  sendDevice(3);
}

function device4() {
  sendDevice(4);
}

function device5() {
  sendDevice(5);
}

function defineMetric() {
  // calls Dynatrace API to create custom metric to be measured
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  // metric
  var metric = config_sheet.getRange(2, 3).getValue();
  
  // create the metric
  var headers = { 'Authorization': 'Api-Token ' + api_key,
                  'Content-Type': 'application/json' }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/v1/timeseries/custom:' + metric;
  var payload = { 'displayName': metric,
                  'types': ['custom'] }
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers, 'method': 'put', 'payload': JSON.stringify(payload), 'muteHttpExceptions': true});
  
  // alert the user and show response
  var ui = SpreadsheetApp.getUi();
  var message = result.getResponseCode() == 201 ? 'Metric Created!' : 'FAIL :(';
  ui.alert(message, result, ui.ButtonSet.OK);
}

function startDevice() {
  // uses triggers to schedule sending of random metrics every minute to simulate a custom device
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // ui object
  var ui = SpreadsheetApp.getUi();
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  // metric
  var metric = config_sheet.getRange(2, 3).getValue();
  
  // ask the user which device
  var device_id = ui.prompt('Which device? (1-5)').getResponseText();
  if (device_id < 0 || device_id > 5) {
    ui.alert('Please choose a device number between 1 and 5');
    return;
  }
  
  // clear out any old triggers
  var triggers = ScriptApp.getProjectTriggers();
  for (var x = 0; x < triggers.length; x++) {
    if (triggers[x].getHandlerFunction() == 'device' + device_id) {
      // delete trigger if it matches
      ScriptApp.deleteTrigger(triggers[x]);
    }
  }
  
  // send data
  sendDevice(device_id);
  
  // create trigger to send every minute
  ScriptApp.newTrigger('device' + device_id)
    .timeBased()
    .everyMinutes(1)
    .create();
  
  // tell the user we're all set
  ui.alert('Device ' + device_id + ' is now sending data every minute.');
}

function sendDevice(device_id) {
  // send metric and custom device data to Dynatrace
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  // metric
  var metric = config_sheet.getRange(2, 3).getValue();
  // device data
  var device_info = config_sheet.getRange(device_id + 4, 2, 1, 9).getValues();
  
  // build the porperties object
  var props = {}
  var tmp_props = device_info[0][4].split(',');
  for (var x = 0; x < tmp_props.length; x++) {
    var t = tmp_props[x].split(':');
    props[t[0]] = t[1];
  }
  
  // build the timestamp and metric value (random based on the high and low values for the device)
  var timestamp = new Date().getTime();
  var value = Math.floor(Math.random() * (device_info[0][7] - device_info[0][6])) + device_info[0][6];
  
  // send the metric
  var headers = { 'Authorization': 'Api-Token ' + api_key,
                  'Content-Type': 'application/json' }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/v1/entity/infrastructure/custom/' + device_info[0][1]; // device_info[0][1] contains the hostname
  var payload = { 'displayName': device_info[0][0],
                 'hostNames': [device_info[0][1]],
                 'ipAddresses': [device_info[0][2]],
                 'favicon': device_info[0][3],
                 'type': 'custom',
                 'properties': props,
                 'tags': device_info[0][5].split(','),
                 'series': [
                   {
                     'timeseriesId': 'custom:' + metric,
                     'dataPoints': [
                       [timestamp, value]
                     ]}
                 ]
                }
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers, 'method': 'post', 'payload': JSON.stringify(payload), 'muteHttpExceptions': true});
  Logger.log(JSON.parse(result));
}

function stopDevice() {
  // removes the trigger for a specified device to stop sending data to Dynatrace
  // ask the user for the device to stop
  // ask the user which device
  var ui = SpreadsheetApp.getUi();
  var device_id = ui.prompt('Which device? (1-5)').getResponseText();
  if (device_id < 0 || device_id > 5) {
    ui.alert('Please choose a device number between 1 and 5');
    return;
  }
  
  // grab all the triggers and delete any for the specified device
  var triggers = ScriptApp.getProjectTriggers();
  for (var x = 0; x < triggers.length; x++) {
    if (triggers[x].getHandlerFunction() == 'device' + device_id) {
      // delete trigger if it matches
      ScriptApp.deleteTrigger(triggers[x]);
    }
  }
  
  // tell the user it's stopped
  ui.alert('Device ' + device_id + ' has been stopped.');
}
