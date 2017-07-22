let myCurrentLocation; //declaring variable to store the coordinates
let map, infoWindow;

//starting the location checking
initMap = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myCurrentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

//using the timeout in order for the location to come first and then execute the code
      setTimeout ((x)=>{
        let initMap1 = () => {
          let directionsService = new google.maps.DirectionsService;
          let directionsDisplay = new google.maps.DirectionsRenderer;
          let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 10,
            center: {lat: 42.244, lng: -70.921}
          });
          directionsDisplay.setMap(map);
          calculateAndDisplayRoute(directionsService, directionsDisplay);

        }
        let outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';

        let calculateAndDisplayRoute = (directionsService, directionsDisplay) => {
          directionsService.route({
            origin: myCurrentLocation,
            destination: myCurrentLocation,
            travelMode: 'DRIVING',
            waypoints: [
              {
                location: 'Montreal, QC, Canada',
                stopover: true
              },{
                location: 'Quebec, QC, Canada',
                stopover: true
              },{
                location: 'Bar Harbor, ME',
                stopover: true
              }],
            optimizeWaypoints: true
          }, function(response, status) {
            if (status === 'OK') {
              // debugger;
              ///////////////////////////////////////////


              let results = response.routes[0].legs;
              for (var j = 0; j < results.length; j++) {

                outputDiv.innerHTML += `STEP ${j+1}: <strong>From:</strong>` + results[j].start_address + ' <strong>to</strong> ' + results[j].end_address +
                    '; <strong>Distance:</strong> ' + results[j].distance.text + ' <strong>in</strong> ' +
                    results[j].duration.text + '<br>';
              }





              /////////////////////////////////////////////
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });
        }

        initMap1();

      }, 0);


    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

//declaring the error handling function
let handleLocationError = (browserHasGeolocation, infoWindow, pos) => {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}
