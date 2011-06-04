var http = require('http'),
    sys = require('sys'),
    url = require('url'),
    events = require('events');

/*
 * Forward request to the given url. Once request is made, data are directly streamed
 * to the response object which is closed once the full response is red from target
 * request.
 *
 * @param {url.URL}             URL object containing target information.
 * @param {String}              HTTP request method to be used for the request.
 * @param {Array}               Array of key/value pairs to be sent as headers along with request.
 * @param {http.ServerResponse} Response to which request results will be written to.
 */
var Forwarder = module.exports = function() {}
 
sys.inherits(Forwarder, events.EventEmitter);
 
Forwarder.prototype.send = function(turl, method, headers, data, response) {
  var self = this;
  
  var options = {
    host: turl.hostname,
    port: turl.port,
    path: turl.pathname,
    method: method,
    headers: headers || {}
  };
  
  var body = "";
  
  console.log("%s", options.path);
  
  var req = http.request(options, function(res) {
    console.log("%s %s %s", res.statusCode, method, options.path);
    console.log(data);
//    console.dir(res.headers);
    
    res.setEncoding('utf8');
    if(res.statusCode == 302) {
      console.log("Redirect %s", res.headers.location);
      headers['cookie'] = res.headers['set-cookie'];
      headers['content-length'] = '0';
      self.send(url.parse(res.headers.location), method, headers, '', response);
      return;
    }

    res.on('data', function (chunk) {
      response.write(chunk);
      body += chunk;
    });
    
    res.on('end', function(chunk) {
      body += chunk ? chunk : '';
      self.emit('response', req.method, url.format(turl), res, body);
      response.headers = res.headers;
      response.end(chunk);
    })
  });

  if(data) {
    req.write(data, 'utf8');
  }
  // write data to request body
  req.end();
}