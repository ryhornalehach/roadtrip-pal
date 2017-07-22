let myCurrentLocation;
let map, infoWindow;
let getOrigin, getWaypoints;
// let waypoints;

fetch('http://localhost/api')
  .then(response => {
    if (response.ok) {
      return response;
    } else {
      let errorMessage = `${response.status} (${response.statusText})`,
          error = new Error(errorMessage);
      throw(error);
    }
  })
  .then(response => response.text())
  .then(body => {
    let bodyParsed = JSON.parse(body);
    getOrigin = bodyParsed[0][0][1]
    getWaypoints = bodyParsed[1]
    // getWaypoints.forEach ((waypoint) => {
    //   waypoints << {'location': waypoint, 'stopover': true }
    // })
    // debugger
    })
  .catch(error => console.error(`Error in fetch: ${error.message}`));

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
            // origin: myCurrentLocation,
            // destination: myCurrentLocation,
            origin: getOrigin,
            destination: getOrigin,
            travelMode: 'DRIVING',
            waypoints: [
              {
                // location: 'Montreal, QC, Canada',
                location: getWaypoints[0][1],
                stopover: true
              },{
                location: getWaypoints[1][1],
                stopover: true
              },{
                location: getWaypoints[2][1],
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
