var express = require("express");
var router = express.Router();
const fs = require("fs");
/* GET home page. */
router.get("/", function (req, res, next) {
  fs.readFile("./index.html", "utf-8", function (err, data) {
    if (err) throw err;
    res.end(data);
  });
});
router.get("/getPointsData", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  fs.readFile("./pointsdata.json", "utf-8", function (err, data) {
    if (err) throw err;
    res.end(data);
  });
});
module.exports = router;
