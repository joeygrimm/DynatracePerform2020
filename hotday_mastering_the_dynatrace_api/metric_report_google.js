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
  menu.addItem('Fetch Metrics List', 'fetchAllMetrics');
  menu.addItem('Fetch Metric Datapoints', 'fetchDatapoints');
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
  config_sheet.getRange(1, 1, 1, 6).setValues([['tenant id', 'api key', 'metric', 'from', 'to', 'resolution']]);
  // add data validation for the from and to fields
  config_sheet.getRange(2, 4, 1, 2).setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build());
  // add drop down for resolution
  config_sheet.getRange(2, 6).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['5m', '30m', '1h', '6h', '1d']).build());
}

function clearData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var data_sheet = spreadsheet.getSheetByName('Data');
  spreadsheet.deleteSheet(data_sheet);
  spreadsheet.insertSheet('Data', 0).activate();
}

function formatDate(d) {
  // turn a date object into a human readable datetime
  var month = d.getMonth() + 1; // JS months start at 0 so add 1
  month = month < 10 ? '0' + month : month; // handle leading zeros
  var day = d.getDate();
  day = day < 10 ? '0' + day : day; // handle leading zeros
  var year = d.getFullYear();
  var hour = d.getHours();
  hour = hour < 10 ? '0' + hour : hour; // handle leading zeros
  var minute = d.getMinutes();
  minute = minute < 10 ? '0' + minute : minute; // handle leading zeros
  return month + '/' + day + '/' + year + ' ' + hour + ':' + minute;
}

function fetchAllMetrics() {
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  
  // clear existing data by creating a new data sheet
  clearData();
  
  // fetch the data
  var headers = { 'Authorization': 'Api-Token ' + api_key }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/v2/metrics';
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers});
  result = JSON.parse(result);
  
  // organize data for writing to the sheet
  var data = [["METRIC KEY", "DESCRIPTION"]];
  for (var x = 0; x < result.metrics.length; x++){
    data.push([result.metrics[x].metricId, result.metrics[x].displayName]);
  }
  
  // write the data to the sheet
  var data_sheet = spreadsheet.getSheetByName('Data');
  data_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  
  // format a bit
  data_sheet.getRange(1, 1, 1, data[0].length).setFontWeight('bold');
  data_sheet.autoResizeColumns(1, data[0].length);
}

function fetchDatapoints() {
  // Store some config in variables
  // spreadsheet object
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // config sheet
  var config_sheet = spreadsheet.getSheetByName('Config');
  // tenant
  var tenant = config_sheet.getRange(2, 1).getValue();
  // api key
  var api_key = config_sheet.getRange(2, 2).getValue();
  
  // determine the metric to use
  // first check the field on the config sheet.
  var metric = config_sheet.getRange(2, 3).getValue();
  // if that's empty, check the selected cell
  metric = metric == '' ? spreadsheet.getActiveCell().getValue() : metric;
  // fail if that neither option works. We use a simple check here for anything, but this could be improved with regex validation
  if (metric == '') {
    // alert the user
    SpreadsheetApp.getUi().alert('Please supply a metric either by adding it to the Config sheet or selecting it in the metrics list!');
    // end execution;
    return;
  }
  
  // handle dates if they've been set
  var start = new Date(config_sheet.getRange(2, 4).getValue()).getTime();
  start = start == '' ? '' : '&start=' + start;
  var end = new Date(config_sheet.getRange(2, 5).getValue()).getTime();
  end = end == '' ? '' : '&end=' + end;
  
  // handle resolution
  var resolution = '?resolution=' + config_sheet.getRange(2, 6).getValue();
  
  // clear existing data by creating a new data sheet
  clearData();
  var data_sheet = spreadsheet.getSheetByName('Data');
  
  // fetch the data
  var headers = { 'Authorization': 'Api-Token ' + api_key }
  var url = 'https://' + tenant + '.sprint.dynatracelabs.com/api/v2/metrics/series/' + metric + resolution + start + end;
  var result = UrlFetchApp.fetch(encodeURI(url), {'headers': headers});
  result = JSON.parse(result);
  
  // set up the data for writing to the sheet
  var data = [], headers = [''];
  // add the labels for timestamps
  for (var x = 0; x < result.metrics[metric].series[0].values.length; x++) {
    var d = new Date(result.metrics[metric].series[0].values[x].timestamp);
    headers.push(formatDate(d));
  }
  data.push(headers);
  // add the data points
  for (var x = 0; x < result.metrics[metric].series.length; x++) {
    var line = [result.metrics[metric].series[x].dimensions[0]];
    for (var y = 0; y < result.metrics[metric].series[x].values.length; y++) {
      line.push(result.metrics[metric].series[x].values[y].value);
    }
    data.push(line);
  }
  
  // write the data to the sheet and format it nicely
  data_sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  // bold the headers
  data_sheet.getRange(1, 1, 1, data[0].length).setFontWeight('bold');
  data_sheet.getRange(1, 1, data.length, 1).setFontWeight('bold');
  // band the data
  data_sheet.getRange(2, 2, data.length - 1, data[0].length - 1).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
  // fit the columns
  data_sheet.autoResizeColumns(1, data[0].length);
  
  // build chart of data
  var chart = data_sheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(data_sheet.getRange(1, 1, data.length, data[0].length))
    .setPosition(data.length + 2, 1, 25, 0)
    .setNumHeaders(1)
    .setTransposeRowsAndColumns(true)
    .setOption('width', 1500)
    .setOption('height', 600)
    .build();
  data_sheet.insertChart(chart);
}
