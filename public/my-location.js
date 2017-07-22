// Note: If you see the error "The Geolocation service failed.",
// it means you probably did not give permission for the browser to locate you.
let map, infoWindow;
initMap = () => {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.3488, lng: -70.9555},
    zoom: 11
  });
  infoWindow = new google.maps.InfoWindow;

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      debugger;
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

let handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
