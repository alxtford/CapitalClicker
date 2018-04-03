var output;
var latitude;
var longitude;

function geoFindMe() {

  if (!navigator.geolocation){
    output = "Geolocation is not supported by your browser";
    console.log("Geolocation is not supported by your browser");
    return;
  }

  function success(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log("Latitude is " + latitude + "° <br>Longitude is " + longitude + "°");

    socket.emit("shopsFind", latitude, longitude);
    console.log(position.coords);
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  console.log("Locating…");

  navigator.geolocation.getCurrentPosition(success, error);
}
