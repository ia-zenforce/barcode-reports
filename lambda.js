var axios = require("axios");
var async = require("async");
var moment = require("moment");
const server = "https://zenforce.zennerslab.com/api";
const barcodeEntryUrl = `${server}/barcode_sync`;
const manualEntryUrl = `${server}/manual_sync`;
const returnsUrl = `${server}/returns_sync`;

const date = moment()
  .subtract(1, "days")
  .format("YYYY-MM-DD");

var params = { company_id: 144, sendTo: "" };

exports.handler = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  async.series(
    [
      function(cb) {
        axios
          .post(barcodeEntryUrl, params)
          .then(res => cb(null, params))
          .catch(err => cb(err));
      },
      function(cb) {
        axios
          .post(manualEntryUrl, params)
          .then(res => cb(null, params))
          .catch(err => cb(err));
      },
      function(cb) {
        axios
          .post(returnsUrl, params)
          .then(res => cb(null, params))
          .catch(err => cb(err));
      }
    ],
    function(err, result) {
      if (err) {
        callback(err);
      }

      context.succeed(params);
    }
  );
};
