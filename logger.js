const t1 = Date.now();
const fs = require("fs");
const path = require("path");

const runPath = path.join(__dirname, 'logs', 'runs.txt');
const runLogger = fs.createWriteStream(runPath, {
  flags: 'a'
});
const rssLogs = path.join(__dirname, 'logs', 'rss.txt');
const rssLogger = fs.createWriteStream(rssLogs, {
  flags: 'a'
});

module.exports = {
  runLogger,
  rssLogger,
  t1
}