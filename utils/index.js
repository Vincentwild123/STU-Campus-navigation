const fs = require("fs");
const keys = [
  "D56BZ-YTB3P-ESFD3-LBI6U-DX62H-A2BTX",
  "6YLBZ-SRXKO-6BTW6-SQMZZ-DZI3J-3YBPE",
  "QU4BZ-V3X3X-IFB47-ZVM7B-YD6C6-FNF3E",
  "3VTBZ-OWWWJ-KYHFU-K754F-4FCUV-4OBXF",
  "QVEBZ-KV5K6-TW3SC-MSRR3-6NIO6-VXF4A",
];
let tempDataContainer = fs.readFileSync("./data.json", "utf-8");
const MyData = JSON.parse(tempDataContainer);
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    default:
      return 0;
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
  return route;
}
function getRandomKey(keyCount, sum) {
  let keyindex = randomNum(0, keys.length - 1);
  while (keyCount[keyindex] > sum / 5) {
    keyindex = randomNum(0, keys.length - 1);
  }
  keyCount[keyindex]++;
  return keys[keyindex];
}
module.exports = { getRandomKey, randomNum, tranPoints };
