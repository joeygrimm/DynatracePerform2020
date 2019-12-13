/*
********************************************************
*                                                      *
*  This script requires Office Script Lab and Excel    *
*                                                      *
********************************************************
*/

$("#run_simple").click(() => tryCatch(run_simple));
$("#run_usql").click(() => tryCatch(run_usql));

function run_simple() {
  return Excel.run(async function(context) {
    // Store some config in variables
    // reference to data sheet
    var data_sheet = context.workbook.worksheets.getItem("Data");
    // reference to config sheet
    var config_sheet = context.workbook.worksheets.getItem("Config");
    // tenant
    var tenant = config_sheet.getCell(1, 0).load("values");
    // api key
    var api_key = config_sheet.getCell(1, 1).load("values");
    // path
    var path = config_sheet.getCell(1, 2).load("values");

    return context.sync().then(async function() {
      // fetch the data
      var url = "https://" + tenant.values + ".live.dynatrace.com" + path.values;
      var headers = { headers: { Authorization: "Api-Token " + api_key.values } };
      try {
        var result = await webRequest(url, headers);
      } catch (error) {
        console.error(error);
      }

      // build the output
      var data = [];
      // determine if the results are tucked away in a property or just at the root of the response
      var r = result;
      if (!Array.isArray(result)) {
        // find the array. just snagging the first instance of an array. can certainly be improved upon
        var k = Object.keys(result);
        // some APIs return the data in a result object. see if that's the case and move down a level if it is
        if (k.indexOf("result") > -1) {
          r = result.result;
          k = Object.keys(result);
        }
        for (var x = 0; x < k.length; x++) {
          if (Array.isArray(result[k[x]])) {
            r = result[k[x]];
            break;
          }
        }
      }

      // add the headers
      var keys = Object.keys(r[0]);
      data.push(keys);
      // loop through the results and build the rows
      for (var x = 0; x < r.length; x++) {
        var tmp = [];
        for (var y = 0; y < keys.length; y++) {
          // make objects prettier
          var tmp_value =
            r[x][keys[y]] instanceof Object ? JSON.stringify(r[x][keys[y]]).substring(0, 50000) : r[x][keys[y]];
          tmp.push(tmp_value);
        }
        data.push(tmp);
      }

      // clear any existing data and write the new
      data_sheet.getRange().clear("All");
      data_sheet.getRangeByIndexes(0, 0, data.length, data[0].length).values = data;

      console.log("All set!");
    });
  });
}

function run_usql() {
  return Excel.run(async function(context) {
    // Store some config in variables
    // reference to data sheet
    var data_sheet = context.workbook.worksheets.getItem("Data");
    // reference to config sheet
    var config_sheet = context.workbook.worksheets.getItem("Config");
    // tenant
    var tenant = config_sheet.getCell(1, 0).load("values");
    // api key
    var api_key = config_sheet.getCell(1, 1).load("values");
    // query
    var usql_query = config_sheet.getCell(1, 2).load("values");
    // start and end
    var start_string = config_sheet.getCell(1, 3).load("values");
    var end_string = config_sheet.getCell(1, 4).load("values");

    return context.sync().then(async function() {
      // fetch the data
      var start = new Date((start_string.values - (25567 + 1)) * 86400 * 1000).getTime();
      var end = new Date((end_string.values - (25567 + 1)) * 86400 * 1000).getTime();
      var url =
        "https://" +
        tenant.values +
        ".live.dynatrace.com/api/v1/userSessionQueryLanguage/table?startTimestamp=" +
        start +
        "&endTimestamp=" +
        end +
        "&query=" +
        encodeURIComponent(usql_query.values);
      var headers = { headers: { Authorization: "Api-Token " + api_key.values } };
      try {
        var result = await webRequest(url, headers);
      } catch (error) {
        console.error(error);
      }

      // build the output
      // multi-dimentional array to write data to sheet. Each array in the array represents a row, and each element a column
      // EXAMPLE: The array [[a,b,c][1,2,3][4,5,6]] would produce the following sheet
      // a | b | c
      // 1 | 2 | 3
      // 4 | 5 | 6
      var data = [];
      
      // loop through the data and add to the array making adjustments for any arrays in the data
      for (var x = 0; x < result.values.length; x++) {
        data[x] = [];
        for (var y = 0; y < result.values[x].length; y++){
          if (Array.isArray(result.values[x][y])){
            data[x].push(result.values[x][y].join(' | '));
          } else {
            data[x].push(result.values[x][y]);
          }
        }
      }

      // add the headers to the data array
      data.unshift(result.columnNames);

      // clear any existing data and write the new
      data_sheet.getRange().clear("All");
      data_sheet.getRangeByIndexes(0, 0, data.length, data[0].length).values = data;

      console.log("All set!");
    });
  });
}

async function webRequest(url, headers) {
  const response = await fetch(url, headers);
  return await response.json();
}

/** Default helper for invoking an action and handling errors. */
function tryCatch(callback) {
  Promise.resolve()
    .then(callback)
    .catch(function(error) {
      // Note: In a production add-in, you'd want to notify the user through your add-in's UI.
      console.error(error);
    });
}
