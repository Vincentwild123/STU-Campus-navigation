var express = require("express");
var router = express.Router();
const fs = require("fs");
var axios = require("axios");
const utils = require("../utils/index");
let data = fs.readFileSync("./PointsData.json", "utf-8");
PointsData = JSON.parse(data);
/* GET home page. */
router.get("/", function (req, response, next) {
  let keyCount = [0, 0, 0, 0, 0];
  //解析起始终点数据
  let fromToData = JSON.parse(req.query.fromToObj);
  //取得最终路径,迭代请求
  let route = utils.tranPoints(fromToData.fromPoints, fromToData.toPoints);
  console.log("最终路径:", route);
  console.log("本次并发数：" + (route.length - 1));

  let axiosArray = [];
  for (let j = 0; j < route.length - 1; j++) {
    let start = PointsData[route[j] - 1];
    let end = PointsData[route[j + 1] - 1];
    let from = start.lat + "," + start.lng;
    let to = end.lat + "," + end.lng;
    let LBkey = utils.getRandomKey(keyCount, route.length - 1);
    console.log("本次查询的key:" + LBkey);
    let Myurl = `https://apis.map.qq.com/ws/direction/v1/walking/?from=${from}&to=${to}&key=${LBkey}`;
    axiosArray.push(axios(Myurl));
  }
  console.log("key被使用次数统计：" + keyCount);
  axios
    .all(axiosArray)
    .then((res) => {
      let results = [];
      res.forEach((re) => {
        results.push(re.data.result);
      });
      results = JSON.stringify(results);
      response.end(results);
    })
    .catch((err) => console.log(err));
});
module.exports = router;
