const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const routes = require("./app/routes");
const dotenv = require("dotenv");
const app = express();
const fs = require("fs");
const http = require("http").Server(app);
const io = (module.exports.io = require("socket.io")(http));
const socketManager = require("./socketManager");

dotenv.config();
const port = process.env.PORT || 8080; // DO NOT REMOVE THIS LINE!!!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Demo middleware to play with error handling
app.use((req, res, next) => {
  const startTime = Date.now();
  console.log("Request Time: " + startTime);
  console.log(`${req.method} ${req.path}`);
  // Request returns 500, default handler returns error
  // as html with stack trace in dev, does not terminate server process.
  //throw new Error("Bazinga!");
  next();
  // Request returns 500, default handler returns error as html showing stack trace,
  // and terminates server process with error ERR_HTTP_HEADERS_SENT.
  //next(new Error("Bazonga!"));
  const endTime = Date.now();
  console.log(
    "Response Time: " + endTime + " Elapsed: " + (endTime - startTime)
  );
  // Request goes through, error is written to log.
  //throw new Error("Bazunga!");
});

app.use("/node-api/server.js/schedule", (req, res, next) => {
  fs.readFile("data/schedule.json", (err, data) => {
    if (err) {
      // If err, then
      next(err);
    } else {
      res.type("json").send(data);
    }
  });
});

app.use("/node-api/server.js/", routes);

io.on("connection", socketManager);

app.use((req, res) => {
  res.status(404).send("<h2>The path is not valid</h2>");
});

http.listen(port, () => {
  console.log(`listening on port ${port}`);
});
