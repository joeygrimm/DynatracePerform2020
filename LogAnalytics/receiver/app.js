const http = require('http');

const hostname = '0.0.0.0';
const port = 8081;

var inv = {
  bacon: {qty:10, price:5},
  coffee: {qty:10, price:1},
  beer: {qty:10, price:2}
  };

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  let order = req.url.substring(1,req.url.length);
  switch(order) {
    case 'bacon':
    if(inv.bacon.qty>0) {
      res.statusCode = 200;
      res.write("1 bacon for you, that'll be $"+inv.bacon.price);
      inv.bacon.qty--;
    } else {
      res.statusCode = 404;
      res.write("sorry all out of "+order);
    }
    break;
    case 'coffee':
    if(inv.coffee.qty>0) {
      res.statusCode = 200;
      res.write("1 coffee for you, that'll be $"+inv.coffee.price);
      inv.coffee.qty--;
    } else {
      res.statusCode = 404;
      res.write("sorry all out of "+order);
    }
    break;
    case 'beer':
    if(inv.beer.qty>0) {
      res.statusCode = 200;
      res.write("1 beer for you, that'll be $"+inv.beer.price);
      inv.beer.qty--;
    } else {
      res.statusCode = 404;
      res.write("sorry all out of "+order);
    }
    break;
    default:
      res.statusCode = 400;
      res.write("we don't carry "+order+"...");
    break;
  }
  if(res.statusCode==200)
    console.log(JSON.stringify({'url': req.url,'status': res.statusCode, 'inv': inv}));
  if(res.statusCode>=400)
    console.error(JSON.stringify({'url': req.url,'status': res.statusCode, 'inv': inv}));
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
