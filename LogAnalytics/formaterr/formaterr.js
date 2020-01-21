const http = require('http');
var moment = require('moment');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const hostname = '0.0.0.0';
const port = 8080;
const logfile = "/home/dtu.training/Perform2020/LogAnalytics/logs/formaterr.log";
var fd = fs.openSync(logfile, 'a');

//var ts = {'format': "ddd MMM DD HH:mm:ss.SSSSS YYYY",'string':""};
var ts = {'format': "YYYYMMDD.HHMMSS",'string':""};


const server = http.createServer((req, res) => {
  //display & update tsformat from HTTP
  res.setHeader('Content-Type', 'text/html');
  let myURL = url.parse(req.url);
  let Qs = querystring.parse(myURL.query);
  if(myURL.pathname='ts') {
    if(Qs.submit=="Update" && typeof(Qs.tsformat)=="string") ts.format = Qs.tsformat;
    if(Qs.submit=="Roll Log") rollLog();
    let html = "<html><head><title>Set TS format</title></head><body><form method=GET action='/ts'>" +
        "<input name=tsformat value='" + ts.format +"' style='width:200px;'><input type=submit name=submit value='Update'></form>" +
        "<form method=GET action='/ts'><input type=submit name=submit value='Roll Log'></form><p>For date format specs, see: " +
        "<a target=_blank href='https://momentjs.com/docs/#/displaying/format/'>moment().format()</a></body></html>";
    res.statusCode = 200;
    res.write(html);
  }
  console.log(JSON.stringify({'url': req.url,'status': res.statusCode}));
  res.end();
});

server.listen(port, hostname, () => {
  //listen on http
  console.log(`Server running at http://${hostname}:${port}/`);
});

//log something every 5s
setInterval(logSomething, 5000, ts);


function logSomething(ts) {
  //log something using the provided format
  ts.string = moment().format(ts.format);
  fs.appendFile(fd, `${ts.string} - something, format:${ts.format}\n`, (err) => {
    if (err) throw err;
  });
}

function rollLog() {
  fs.closeSync(fd);
  fs.renameSync(logfile,logfile+".bak");
  fd = fs.openSync(logfile, 'a');
}
