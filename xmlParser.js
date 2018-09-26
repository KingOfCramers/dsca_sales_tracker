// Mailer
const { transporter } = require("./mailer");
const config = require("./config");

// For fetching file
var https = require('https');
const moment = require("moment");

// For parsing Rss feed
const Parser = require("rss-parser");
let parser = new Parser();

const DATE_RFC822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";
const DATE_RFC822_ZEROED = "ddd, DD MMM YYYY HH:mm:ss +0000"
const current_time = moment().format(DATE_RFC822_ZEROED);
const current_time_unix = moment(current_time).format("X");

parser.parseURL("http://www.dsca.mil/major-arms-sales/feed")
  .then((feed) => {

    feed.items.forEach((item, i) => {

      const item_time_unix = moment(item.pubDate).format("X");
      const difference_unix = parseInt(current_time_unix) - parseInt(item_time_unix);
      const difference_in_minutes = difference_unix/60;
      console.log(difference_in_minutes);

      if(difference_in_minutes < 11){
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
            console.log("Email Sent.");
          }
        })
      }
    });
  })
  .catch((err) => console.log(err));