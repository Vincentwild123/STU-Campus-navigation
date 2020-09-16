const http = require("http");
const fs = require("fs");
const url = require("url");
http
  .createServer(function (req, res) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.setHeader("Access-Control-Allow-Origin", "*");
    //跨域允许的header类型
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-type,Content-Length,Authorization,Accept,X-Requested-Width"
    );
    //跨域允许的请求方式
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT,POST,GET,DELETE,OPTIONS"
    );

    //获取请求URL信息
    let UrlObj = url.parse(req.url);
    let route = UrlObj.pathname;
    console.log("请求路径:" + route);

    if (route === "/")
      fs.readFile("./index.html", "utf-8", function (err, data) {
        if (err) throw err;
        else res.end(data);
      });
    else if (route === "/getPointsData") {
      res.setHeader("Content-Type", "application/json");
      fs.readFile("./PointsData.json", "utf-8", function (err, data) {
        if (err) throw err;
        else res.end(data);
      });
    } else if (route === "/style.css") {
      res.setHeader("Content-Type", "text/css");
      fs.readFile("./style.css", "utf-8", function (err, data) {
        if (err) throw err;
        else res.end(data);
      });
    } else if (route === "/favicon.icon") {
      console.log("取图片");
      res.setHeader("Content-Type","image/png");
      let stream = fs.createReadStream("."+route);
      let responseData = []; //存储文件流
      if (stream) {
        //判断状态
        stream.on("data", function (chunk) {
          responseData.push(chunk); 
        });
        stream.on("end", function () {
          let finalData = Buffer.concat(responseData);
          res.write(finalData);
          res.end();
        });
      }
    } else res.end("<h1>404 NOT Find</h1>");
  })
  .listen(3000);
console.log("Server run in port 3000 for html");
