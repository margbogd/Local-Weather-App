var fTemp = "";
var locationQuery = "";
var key = "66df3a4e65720ae041757d3fbe6e0e35"; //api key

if("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    locationQuery = "lat=" + lat + "&lon=" + lon + "&appid=" + key;
    getWeather();
    return false;
  });
  } else {
  alert("Please allow location access");
}
// toggle temperature between fahrenheit and celsius
$(".temp").click(function() {
  if($("#tempScale").text() === "C") {
    $("#tempValue").html(fTemp);
    $("#tempScale").html("F");
  }
  else {
    var cTemp = Math.floor(((fTemp - 32) / 1.8) + 0.5);
    $("#tempValue").html(cTemp);
    $("#tempScale").html("C");
  }
});
$(".btn-primary").click(function() {
  var location = $("#locationInput").val();
  
  if($.isNumeric(location)) {
    locationQuery = "zip=" + location + ",us";
  }
  else {
    locationQuery = "q=" + location;
  }
  
  getWeather();
  $("#locationInput").val("");
  return false;
});

// make API call and adds data to html
function getWeather() {
    $.getJSON("https://api.openweathermap.org/data/2.5/weather?" + locationQuery + "&units=imperial&appid=" + key, function(json) {
    $.each(json, function(key, value) {
      switch(key) {
        case "weather":
          $.each(value[0], displayWeather);
          break;
        case "main":
          $.each(value, displayTemp);
          break;
        case "sys":
          $.each(value, displayCountry);
          break;
        case "name":
          $("#city").html(value + ", ");
      }
    });
  });    
}

// display the name of the current weather (ex. Rain, Clouds, etc.) and change the icon to match
function displayWeather(weatherKey, weatherValue) {
  if(weatherKey == "main") {
    var weatherStatus = weatherValue.toLowerCase();

    $(".status").html(weatherValue);
    switch(weatherStatus) {
      case "clouds":
        $(".weatherImage").html('<i class="wi wi-cloudy"></i>');
        break;
      case "thunderstorm":
        $(".weatherImage").html('<i class="wi wi-thunderstorm"></i>');
        break;
      case "drizzle":
      case "rain":
        $(".weatherImage").html('<i class="wi wi-rain"></i>');
        break;
      case "snow":
        $(".weatherImage").html('<i class="wi wi-snow"></i>');
        break;
      case "extreme":
        $(".weatherImage").html('<i class="wi wi-meteor"></i>');
        break;
      case "smoke":
        $(".weatherImage").html('<i class="wi wi-smoke"></i>');
        break;
      default:
        $(".weatherImage").html('<i class="wi wi-day-sunny"></i>');
    }
  }
}

// display the fahrenheit temperature, rounded to the nearest whole degree
function displayTemp(mainKey, mainValue) {
  if(mainKey == "temp") {
    $(".temp").html("<span id='tempValue'>" + Math.floor(mainValue + 0.5) + "</span>&deg;<a id='tempScale' href='#tempScale'>F</a>");
    fTemp = $("#tempValue").text();
  }
}

// display the country code
function displayCountry(sysKey, sysValue) {
  if(sysKey == "country") {
    $("#country").html(sysValue);
  }
}