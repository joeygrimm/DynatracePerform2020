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
  menu.addItem('Send Event', 'sendEvent');
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
  config_sheet.getRange(4, 1, 8, 1)
    .setValues([['Event Type'], ['Start'], ['End'], ['Tag(s)'], ['Scope'], ['Title'], ['Description'], ['Custom Props']])
    .setFontWeight('bold')
    .setVerticalAlignment('top');
  config_sheet.getRange(4, 1, 8, 2).applyRowBanding(SpreadsheetApp.BandingTheme.INDIGO, false, false);
  config_sheet.setColumnWidth(2, 350);
  // add dropdowns for event type and scope
  config_sheet.getRange(4, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
    .requireValueInList(['AVAILABILITY_EVENT', 'CUSTOM_DEPLOYMENT'])
    .build()
  );
  config_sheet.getRange(8, 2).setDataValidation(
    SpreadsheetApp.newDataValidation()
    .requireValueInList(['APPLICATION', 'HOST', 'PROCESS_GROUP', 'SERVICE'])
    .build()
  );
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

function sendEvent() {
  // sends sample deployment and availability events to Dynatrace
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
  // event data
  var event_data = config_sheet.getRange(4, 2, 8, 1).getValues();
  
  
}
