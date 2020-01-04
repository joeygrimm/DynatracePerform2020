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
  menu.addItem('Run Host Report', 'fetchHosts');
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
  // insert two new sheets, oone for data and one for config
  spreadsheet.insertSheet('Data', 0);
  spreadsheet.insertSheet('Config', 1);
  // delete the old sheets
  for (var x = 0; x < sheets.length; x++) {
    spreadsheet.deleteSheet(sheets[x]);
  }
  // set up the config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  config_sheet.getRange(1, 1, 1, 5).setValues([['tenant id', 'api key', 'hostgroup', 'tags', 'show_candidates?']]);
  // build dropdown for show candidates
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['TRUE', 'FALSE'], true)
    .setAllowInvalid(false)
    .setHelpText('Please select true or false.')
    .build();
  config_sheet.getRange(2, 5).setDataValidation(rule)
}

function fetchHosts() {
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
  // host group
  var host_group = config_sheet.getRange(2, 3).getValue();
  // tags
  var tags = config_sheet.getRange(2, 4).getValue();
  // fetch monitoring candidates?
  var candidates = config_sheet.getRange(2, 5).getValue();
  
  // check host group and tag values. if they have data, then turn them into parameters to append to the url
  host_group = host_group == '' ? host_group : '&hostGroupName=' + host_group;
  tags = tags == '' ? tags : '&tag=' + tags.split(',').join('&tag=');
  
  // fetch the data
  var headers = { 'Authorization': 'Api-Token ' + api_key }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/v1/entity/infrastructure/hosts?showMonitoringCandidates=' + candidates + host_group + tags;
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers});
  result = JSON.parse(result);
  
  // let the user know if the recordset came back empty
  if (result.length < 1) {
    SpreadsheetApp.getUi().alert("ALERT!!! No matching hosts!");
  }
  
  // array to store the enabled fields. on the first run this will include everything
  var enabled_fields = [];
  
  // see if the list of fields exists on the config sheet. if it doesn't then write them there to allow for field selection by the user
  var chk_cell = config_sheet.getRange(4, 1).getValue();
  if (chk_cell == '') {
    // no fields yet, so write them to the sheet and turn them all to "enabled" (aka: put an "x" under them)
    enabled_fields = Object.keys(result[0]);
    config_sheet.getRange(4, 1, 1, enabled_fields.length).setValues([enabled_fields]);
    config_sheet.getRange(5, 1, 1, enabled_fields.length).setValue('x').setHorizontalAlignment('center');
  } else {
    // fields are already on the config sheet, so see which ones are enabled and populate enabled_fields
    enabled_fields = config_sheet.getRange(4, 1, 1, config_sheet.getLastColumn()).getValues()[0];
    var x_marks = config_sheet.getRange(5, 1, 1, config_sheet.getLastColumn()).getValues()[0];
    // loop through the x's and get rid of any fields in enabled_fields that don't have an x. we do this in reverse order so indexes don't adjust as we remove items
    for (var x = x_marks.length - 1; x > -1; x--) {
      if (x_marks[x] == ''){
        enabled_fields.splice(x, 1);
      }
    }
  }
  
  // build the data to be written to the sheet
  var data = [];
  for (var x = 0; x < result.length; x++) {
    // add a new blank array to our data array
    data[x] = [];
    // add the selected data. we're just looping through and writing stringified data, but you could add logic to properly format data that's returned as an object or array
    for (var y = 0; y < enabled_fields.length; y++) {
      // stringify non-text data and cap it at 50,000 characters so we don't get errors from Google Sheets due to max cell size
      data[x].push(result[x][enabled_fields[y]] instanceof Object ? JSON.stringify(result[x][enabled_fields[y]]).substring(0, 50000) : result[x][enabled_fields[y]]);
    }
  }
  
  // Add the headers to the beginning of the data array
  data.unshift(enabled_fields);
  
  // clear existing contents if they exist
  if (data_sheet.getLastRow() > 0 && data_sheet.getLastColumn() > 0){
    data_sheet.setColumnWidths(1, data_sheet.getLastColumn(), 100);
    data_sheet.getRange(1, 1, data_sheet.getLastRow(), data_sheet.getLastColumn()).clear();
  }
  // write the data to the sheet and make it look nice
  data_sheet.getRange(1, 1, data.length, data[0].length).setValues(data).applyRowBanding(SpreadsheetApp.BandingTheme.BLUE, true, false);
  data_sheet.autoResizeColumns(1, data_sheet.getLastColumn()); 
}
