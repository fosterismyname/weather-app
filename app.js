// Requiring needed models
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const apiKey = '1c7a538edfbaef4613e2a65b2839423f';

// Sending the index.html to the user when he goes to the root of the server
app.get('/', function(req,res){

  res.sendFile(__dirname + '/index.html');
})

//When the user posts (sends) data to our server
app.post('/', function(req,res){
  // Tapping into the user's inputs through bodyParser
  cityName = req.body.cityName;
  units = req.body.units;
  // Creating a custom request url
  const url = 'https://api.openweathermap.org/data/2.5/weather?q='+ cityName + '&units=' + units + '&appid=' + apiKey;

  // Sending a custom request
  https.get(url, function(response){
  // When we get the response from the openweathermap's server:
    response.on('data', function(data){
      // Parsing data to JSON
      const weatherData = JSON.parse(data);
      // Tapping into the properties of the response from the OWM's server
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const imageURL = 'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png';
      // Writing all the data to res
      res.write("<h1>The current temperature in " + cityName + " is " + temp + " degrees</h1>");
      res.write("The weather is " + description);
      res.write("<img src=" + imageURL + ">");
      // Sending written data to user to see
      res.send();

    })
  })
})

app.listen(3000, function(){
  console.log("Server running");
})
