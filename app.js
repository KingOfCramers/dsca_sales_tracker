// Logging
const { runLogger, rssLogger, t1 } = require("./logger");

// Mailer
const { transporter } = require("./mailer");
const config = require("./config");
const client = require("./twitter");

// For fetching file
var https = require('https');
const moment = require("moment");

// For parsing Rss feed
const Parser = require("rss-parser");
let parser = new Parser();
const current_time_unix = moment().format("X");


parser.parseURL("http://www.dsca.mil/major-arms-sales/feed")
  .then((feed) => {

    runLogger.write("\n")
      runLogger.write(moment().format("RUN: ddd, DD MMM YYYY HH:mm:ss ZZ"));
      runLogger.write("\n")

    feed.items.forEach((item, i) => {

      // Time parsing...
      const item_time_unix = moment(item.pubDate).format("X");
      const difference_unix = parseInt(current_time_unix) - parseInt(item_time_unix);
      const difference_in_minutes = difference_unix/60;
        rssLogger.write(`${i} : `); rssLogger.write(difference_in_minutes.toString()); rssLogger.write("\n");

      // Content parsing...
      const cost = item.contentSnippet.slice(item.contentSnippet.match(/estimated cost of/).index + 18, item.contentSnippet.match(/illion/).index + 6);
      const recipient = item.title.slice(0, item.title.match(/–/).index - 1);
      const goods = item.title.slice(item.title.match(/–/).index + 2, item.title.length);
      var message = `NEW: #DSCA notifies Congress of possible ${cost} military sale to ${recipient}, of ${goods}`;

      // Twitter formatting...
      if (message.length > 257) {
        message = `NEW: #DSCA notifies Congress of possible ${cost} military sale to ${recipient} ${item.link}`
        } else {
        message.concat(` ${item.link}`)
      };

      // Time checking...
      if(difference_in_minutes < 11){

        runLogger.write(`UPDATE FROM ${difference_in_minutes} minutes ago ---- ${message}`);
        runLogger.write("\n");

        // EMAIL...
        let HelperOptions = {
          from: 'DSCA sales <dsca.arms.sales@gmail.com>',
          to: config.recipient,
          subject: `ARMS SALE: ${item.title}`,
          html: `${item.content} \n\n ${item.link}`
        };

        transporter.sendMail(HelperOptions, (error, info) => {
          if(error){
            console.log(error);
          } else {
            // TWITTER...
              client.post('statuses/update', {status: message},  function(error, tweet, response) {
                      if(error) throw error;
              });
          }
        });
      }
    });

    const t2 = Date.now();
    runLogger.write("Script took " + (t2 - t1) + " milliseconds.");

  })
  .catch((err) => console.log(err));