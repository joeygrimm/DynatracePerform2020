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
  menu.addItem('Clear Data', 'clearData');
  menu.addItem('Fetch Dashboard', 'fetchDashboard');
  menu.addItem('Update Dashboard', 'updateDashboard');
  menu.addItem('Create Dashboard', 'createDashboard');
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
  // insert two new sheets, one for data and one for config
  spreadsheet.insertSheet('Data', 0);
  spreadsheet.insertSheet('Config', 1);
  // delete the old sheets
  for (var x = 0; x < sheets.length; x++) {
    spreadsheet.deleteSheet(sheets[x]);
  }
  // set up the config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  config_sheet.getRange(1, 1, 1, 3).setValues([['tenant id', 'api key', 'dashboard']]);
}

function clearData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var data_sheet = spreadsheet.getSheetByName('Data');
  spreadsheet.deleteSheet(data_sheet);
  spreadsheet.insertSheet('Data', 0).activate();
}

function fetchDashboard() {
  // clear the data sheet
  clearData();
  
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // data sheet
  var data_sheet = spreadsheet.getSheetByName('Data');
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  // dashboard id
  var dashboard = config_sheet.getRange(2, 3).getValue();
  
  // fetch the data
  var headers = { 'Authorization': 'Api-Token ' + api_key }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/config/v1/dashboards/' + dashboard;
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers});
  result = JSON.parse(result);
  
  // write the dashboard data to the sheet
  // sheet metadata
  var data = [['Name:', result.dashboardMetadata.name],
              ['Shared:', result.dashboardMetadata.shared]]
  data_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  // loop through tiles and prep for writing
  data = [];
  for (var x = 0; x < result.tiles.length; x++) {
    data.push([JSON.stringify(result.tiles[x])]);
  }
  
  // write the tiles to the sheet
  data_sheet.getRange(4, 1).setValue("Tiles:");
  data_sheet.getRange(4, 2, data.length, 1).setValues(data).setWrap(true);
  
  // clean up a bit
  data_sheet.getRange(2, 2).setHorizontalAlignment('left');
  data_sheet.setColumnWidths(2, 1, 800);
  data_sheet.autoResizeRows(4, data.length);
}

function updateDashboard() {
  // dashboard id
  var dashboard = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config').getRange(2, 3).getValue();
  // tenant
  var tenant = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config').getRange(2, 1).getValue();
  // url for API
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/config/v1/dashboards/' + dashboard;
  
  // call processDashboard to handle the API call
  processDashboard(url, 'put', dashboard);
}

function createDashboard() {
  // tenant
  var tenant = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config').getRange(2, 1).getValue();
  // url for API
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/config/v1/dashboards';
  
  // call processDashboard to handle the API call
  processDashboard(url, 'post');
}

function processDashboard(url, method, id) {
  // api key
  var api_key = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config').getRange(2, 2).getValue();
  // tenant
  var tenant = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config').getRange(2, 1).getValue();
  // data_sheet
  var data_sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Data');
  
  // collect the dashboard metadata
  var metadata = data_sheet.getRange(1, 2, 2, 1).getValues();
  var dashboardMetadata = {
      "name": metadata[0][0],
      "shared": metadata[1][0]
    };
  
  // create the array of tiles
  var tiles = [];
  var tile_data = data_sheet.getRange(4, 2, (data_sheet.getLastRow() - 3), 1).getValues();
  
  // loop through the tiles and JSON parse
  for (var x = 0; x < tile_data.length; x++) {
    tiles.push(JSON.parse(tile_data[x][0]));
  }
  
  // build the payload
  var payload = {
                  "dashboardMetadata": dashboardMetadata,
                  "tiles": tiles
                }
  // if id is set, it must be passed to update a tile
  if (id != null) {
    payload.id = id;
  }
  
  // fetch the data
  var headers = { 'Authorization': 'Api-Token ' + api_key, 'Content-Type': 'application/json' }
  var result = UrlFetchApp.fetch(url, {'headers': headers, 'method': method, 'payload': JSON.stringify(payload)});
  // if the id is not set, then we need to snag the id of the new dashboard. if it's set,then we already have it.
  if (id == null) {
    result = JSON.parse(result);
    Logger.log(result);
  }
  id = id == null ? result.id : id;
    
  // display link to dashboard
  var htmlOutput = HtmlService
    .createHtmlOutput('<a href="https://' + tenant + '.sprint.dynatracelabs.com/#dashboard;id=' + id + '" target="_blank">Check it out!</a>' +
                      '<p>It may take a few seconds for the dashboard to get creted, so if it fails to load, just wait a few seconds and try again.</p>')
    .setWidth(600)
    .setHeight(120);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'View Dashboard');
}
