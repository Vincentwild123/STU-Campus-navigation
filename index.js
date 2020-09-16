const axios = require("axios");
const http = require("http");
const url = require("url");
const fs = require("fs");
const keys = [
  "D56BZ-YTB3P-ESFD3-LBI6U-DX62H-A2BTX",
  "6YLBZ-SRXKO-6BTW6-SQMZZ-DZI3J-3YBPE",
  "QU4BZ-V3X3X-IFB47-ZVM7B-YD6C6-FNF3E",
  "3VTBZ-OWWWJ-KYHFU-K754F-4FCUV-4OBXF",
  "QVEBZ-KV5K6-TW3SC-MSRR3-6NIO6-VXF4A",
];
// let DUrl = `https://apis.map.qq.com/ws/direction/v1/driving/?from=${Config.from}&to=${Config.to}&waypoints=39.111,116.112;39.112,116.113&output=json&key=${Config.key}`;
// let WUrl = `https://apis.map.qq.com/ws/direction/v1/walking/?from=${Config.from}&to=${Config.to}&key=${Config.key}`;
// let BUrl = `https://apis.map.qq.com/ws/direction/v1/bicycling/?from=${Config.from}&to=${Config.to}&key=${Config.key}`;
// let TUrl = `https://apis.map.qq.com/ws/direction/v1/transit/?from=${Config.from}&to=${Config.to}&key=${Config.key}`;
let MyData;
let PointsData;
fs.readFile("./PointsData.json", "utf-8", function (err, data) {
  if (err) throw err;
  else {
    console.log("地点坐标数据加载完毕");
    PointsData = JSON.parse(data);
  }
});
fs.readFile("./data.json", "utf-8", function (err, data) {
  if (err) throw err;
  else {
    console.log("路线数据加载完毕");
    MyData = JSON.parse(data);
  }
});

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
//将起点数组和终点数组转换为路线
function tranPoints(startPointsArr, endPointsArr) {
  let startIndex = [];
  startIndex.push(startPointsArr[0].index);
  let endIndexs = [];
  endPointsArr.forEach((point) => {
    endIndexs.push(point.index);
  });
  let pointsIndex = startIndex.concat(endIndexs);
  let route = [];
  for (let i = 0; i < pointsIndex.length - 1; i++) {
    let from = pointsIndex[i];
    let to = pointsIndex[i + 1];
    let pointRoute = MyData[from - 1].path[to + ""];
    if (i > 0) pointRoute.shift();
    route = route.concat(pointRoute);
  }
  console.log("最终路径：" + route);
  return route;
}
let keyCount = [0, 0, 0, 0, 0];
function getRandomKey(sum) {
  let keyindex = randomNum(0, keys.length - 1);

  while (keyCount[keyindex] > sum / 5) {
    keyindex = randomNum(0, keys.length - 1);
  }
  keyCount[keyindex]++;
  return keys[keyindex];
}
http
  .createServer(function (req, response) {
    console.log("时间：" + new Date());
    keyCount = [0, 0, 0, 0, 0];
    var parseObj = url.parse(req.url, true);
    let params = parseObj.query;

    //解析起始终点数据
    let fromToData = JSON.parse(params.fromToObj);
    //取得最终路径,迭代请求
    let route = tranPoints(fromToData.fromPoints, fromToData.toPoints);

    //得到起点，途径点数据数组，准备查询最短路径

    //设置允许跨域的域名，*代表允许任意域名跨域
    response.setHeader("Access-Control-Allow-Origin", "*");
    //跨域允许的header类型
    response.setHeader(
      "Access-Control-Allow-Headers",
      "Content-type,Content-Length,Authorization,Accept,X-Requested-Width"
    );
    //跨域允许的请求方式
    response.setHeader(
      "Access-Control-Allow-Methods",
      "PUT,POST,GET,DELETE,OPTIONS"
    );
    response.writeHead(200, { "Content-Type": "application/json" });

    //迭代请求
    let axiosArray = [];
    console.log("本次并发数：" + (route.length - 1));
    for (let j = 0; j < route.length - 1; j++) {
      let start = PointsData[route[j] - 1];
      let end = PointsData[route[j + 1] - 1];
      let from = start.lat + "," + start.lng;
      let to = end.lat + "," + end.lng;
      let LBkey = getRandomKey(route.length - 1);

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
  })
  .listen(8888);
console.info("Server run in port 8888");
