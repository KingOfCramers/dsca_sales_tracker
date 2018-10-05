// Logging
const fs = require("fs");
var logger = fs.createWriteStream('log.txt', {
  flags: 'a'
});

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

// const DATE_RFC822_ZEROED = "ddd, DD MMM YYYY HH:mm:ss ZZ"
// const current_time = moment().format(DATE_RFC822_ZEROED);
const current_time_unix = moment().format("X");

parser.parseURL("http://www.dsca.mil/major-arms-sales/feed")
  .then((feed) => {
    logger.write("\n")
    logger.write(moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ"));
    logger.write("\n")

    feed.items.forEach((item, i) => {

      // Time parsing...
      const item_time_unix = moment(item.pubDate).format("X");
      const difference_unix = parseInt(current_time_unix) - parseInt(item_time_unix);
      const difference_in_minutes = difference_unix/60;

      // Content parsing...
      const cost = item.contentSnippet.slice(item.contentSnippet.match(/estimated cost of/).index + 18, item.contentSnippet.match(/illion/).index + 6);
      const recipient = item.title.slice(0, item.title.match(/–/).index - 1);
      const goods = item.title.slice(item.title.match(/–/).index + 2, item.title.length);
      var message = `NEW: #DSCA notifies Congress of possible ${cost} military sale to ${recipient}, of ${goods}`;

      if (message.length > 257) {
        message = `NEW: #DSCA notifies Congress of possible ${cost} military sale to ${recipient} ${item.link}`
      } else {
        message.concat(` ${item.link}`)
      };

      logger.write(difference_in_minutes.toString());
      logger.write("\n")

      if(difference_in_minutes < 11){
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
      };
    });
  })
  .catch((err) => console.log(err));