const express = require("express");

// creating the https module

const https = require("https");

// create body parser to get data whene user hit button

const bodyParser = require("body-parser");

const app = express();

//  app to use body Praser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json())
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res_to_browser) => {
  // to render the html page
  console.log(__dirname + "/index.html");
  res_to_browser.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res_to_browser) => {
  // console.log(req.body.cityName);
  // console.log("post recived ");
  // console.log("post request recived ");
  // creating the get request for api

  // const query = "bareilly";
  const query = req.body.cityName;
  const apiKey = "0fbca7349af8ca5975664cb3978884e3";
  const units = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    units;

  https.get(url, (response) => {
    console.log(response);
    console.log(response.statusCode);

    response.on("data", (data) => {
      // if we write in the belowe formate it will give data i  HEXA-DECIMAL CODE
      console.log(data);

      // USING JSON TO CONVERT IN JSON STRING
      const weatherData = JSON.parse(data);
      console.log(weatherData);

      // thier is a method JSON.stringify(data) which converts javaScript object into json formate var sohail="{school : xavier, rollno:23, house:"red"}" use it to see the fun

      // ============== taking out temperture  ============================

      const temp = weatherData.main.temp;
      console.log(temp);

      // ============= taking thr discription  =======

      const weatherDescription = weatherData.weather[0].description;
      console.log(weatherDescription);

      //==========taking out icon ===========================

      const icon = weatherData.weather[0].icon;

      const icon_Url = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      // in this way we can only sends 1 send respose
      //   ============================================ 1 respose =================================
      //   res_to_browser.send(
      //     "<h1>The temperture of BAREILLY IS " + temp + " degree celcius.</h1>"
      //   );

      // =========== to over came this we will use write methode

      res_to_browser.write(
        "<h1>The temperture of " +
          query +
          " IS " +
          temp +
          " degree celcius.</h1>"
      );
      res_to_browser.write(
        "<p>the weather is currently " + weatherDescription + " </p>"
      );
      res_to_browser.write("<img src=" + icon_Url + ">");
      res_to_browser.send();

      // we can send only one send request to broweser so we have to remove res.send("server is running.")
    });
  });

  // res.send("server is running.")
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
