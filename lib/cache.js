/*
 * Cache module.
 */
var Cache = module.exports = function() {
  var self = this;
  self.data = {};
}

Cache.prototype.hit = function(url, method) {
  var self = this;
  
  return self.data[url+method];
}

Cache.prototype.set = function(method, url, body) {
  console.log("%s %s", method, url);
  
  var self = this;
  self.data[method + url] = body;
}