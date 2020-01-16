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
  menu.addItem('Submit Window', 'submitWindow');
  menu.addToUi();
}

function setupSheets() {
  // get all the sheets in the spreadsheet
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = spreadsheet.getSheets();
  // rename the existing sheet(s)
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
  config_sheet.getRange(1, 1, 1, 2).setValues([['tenant id', 'api key']]).setFontWeight('bold');
  config_sheet.getRange(4, 1, 11, 1)
    .setValues([['Window Type'], ['Start'], ['End'], ['Tag(s)'], ['Scope'], ['Title'], ['Description'], ['Suppression'], ['Recurrence'], [''], ['Duration (min)']])
    .setFontWeight('bold')
    .setVerticalAlignment('top');
  config_sheet.getRange(4, 1, 11, 2).applyRowBanding(SpreadsheetApp.BandingTheme.ORANGE, false, false);
  config_sheet.setColumnWidth(2, 350);
  // add dropdowns for window type, recurrence, suppression and scope
  config_sheet.getRange(4, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
    .requireValueInList(['PLANNED', 'UNPLANNED'])
    .build()
  );
  config_sheet.getRange(12, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
    .requireValueInList(['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY'])
    .build()
  );
  config_sheet.getRange(11, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
    .requireValueInList(['DETECT_PROBLEMS_AND_ALERT', 'DETECT_PROBLEMS_DONT_ALERT', 'DONT_DETECT_PROBLEMS'])
    .build()
  );
  config_sheet.getRange(8, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
    .requireValueInList(['APPLICATION', 'HOST', 'CUSTOM_DEVICE', 'PROCESS_GROUP', 'SERVICE'])
    .build()
  );
  // trigger to handle different recurrence types
  config_sheet.hideRows(13, 2);
  ScriptApp.newTrigger('handleRecurrence')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
  // set up date/time validation for start and end
  var valid_datetime = SpreadsheetApp.newDataValidation()
    .requireDate()
    .setAllowInvalid(false)
    .build();
  config_sheet.getRange(5, 2).setDataValidation(valid_datetime);
  config_sheet.getRange(6, 2).setDataValidation(valid_datetime);
  // apply wrapping for description and custom props
  config_sheet.getRange(10, 2).setWrap(true);
  config_sheet.getRange(11, 2).setWrap(true);
}

function handleRecurrence() {
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // coonfig sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // if the edit is to the cell containing the recurrence dropdown, then modify the form based on the selection
  if (SpreadsheetApp.getActiveRange().getA1Notation() == "B12"){
    switch (config_sheet.getRange(12, 2).getValue()){
      case 'ONCE':
        config_sheet.hideRows(13, 2);
        break;
      case 'DAILY':
        config_sheet.hideRows(13);
        config_sheet.showRows(14);
        break;
      case 'WEEKLY':
        config_sheet.showRows(13, 2);
        config_sheet.getRange(13, 1).setValue('Day of Week');
        config_sheet.getRange(13, 2).clearContent().clearDataValidations();
        config_sheet.getRange(13, 2).setDataValidation(
          SpreadsheetApp.newDataValidation()
          .requireValueInList(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'])
          .build()
        );
        break;
      case 'MONTHLY':
        config_sheet.showRows(13, 2);
        config_sheet.getRange(13, 1).setValue('Day of Month');
        config_sheet.getRange(13, 2).clearContent().clearDataValidations();
        var days = [];
        for (var x = 1; x < 32; x++) { days.push(x); }
        config_sheet.getRange(13, 2).setDataValidation(
          SpreadsheetApp.newDataValidation()
          .requireValueInList(days)
          .build()
        );
    }
  }
}

function formatDate(D) {
  // format date object
  var dy = D.getDate() < 10 ? 0 + D.getDate().toString() : D.getDate(); // day
  var mo = D.getMonth() + 1 < 10 ? 0 + (D.getMonth() + 1).toString() : D.getMonth() + 1; // month
  var yr = D.getFullYear(); // year
  var hr = D.getHours() < 10 ? 0 + D.getHours().toString() : D.getHours(); // hours
  var mn = D.getMinutes() < 10 ? 0 + D.getMinutes().toString() : D.getMinutes(); // minutes
  return yr + '-' + mo + '-' + dy + ' ' + hr + ':' + mn;
}

function submitWindow() {
  // sends maintenance window to Dynatrace
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  // ui
  var ui = SpreadsheetApp.getUi();
  // window data
  var window_data = config_sheet.getRange(4, 2, 11, 1).getValues();
  
  // build the payload
  var payload = {}
  payload.type = window_data[0][0];
  payload.name = window_data[5][0];
  payload.description = window_data[6][0];
  payload.suppression = window_data[7][0];
  payload.scope = {
    'entities': [],
    'matches': [{
      'type': window_data[4][0],
      'tags': []
    }]
  }

  // add tags to tag rule
  for (var x = 0; x < window_data[3][0].split(',').length; x++) {
    payload.scope.matches[0].tags.push({
      'context': 'CONTEXTLESS',
      'key': window_data[3][0].split(',')[x]
    });
  }
  
  // build the schedule object
  payload.schedule = {
    'recurrenceType': window_data[8][0],
    'zoneId': Session.getScriptTimeZone()
  }
  var start = new Date(window_data[1][0]);
  payload.schedule.start = formatDate(start);
  var end = new Date(window_data[2][0]);
  payload.schedule.end = formatDate(end);
  
  // for recerrence types other than ONCE build recurrence
  if (payload.schedule.recurrenceType != 'ONCE') {
    var starth = start.getHours();
    var startm = start.getMinutes();
    payload.schedule.recurrence = {
      'startTime': (starth < 10 ? 0 + starth.toString() : starth) + ':' + (startm < 10 ? 0 + startm.toString() : startm),
      'durationMinutes': window_data[10][0]
    }
  }
  // populate day of week or day of month when needed
  if (payload.schedule.recurrenceType == 'WEEKLY') {
    payload.schedule.recurrence.dayOfWeek = window_data[9][0];
  }
  if (payload.schedule.recurrenceType == 'MONTHLY') {
    payload.schedule.recurrence.dayOfMonth = window_data[9][0];
  }
  
  // send the request to Dynatrace
  var headers = { 'Authorization': 'Api-Token ' + api_key,
                  'Content-Type': 'application/json' }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/config/v1/maintenanceWindows';
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers, 'method': 'post', 'payload': JSON.stringify(payload)});
  Logger.log(JSON.parse(result));
  
  // let the user know we're good if we get a 201 back
  if (result.getResponseCode() == 201) {
    ui.alert('Maintenance window set successfully!');
  }
}
