let myCurrentLocation;
let map, infoWindow;
let getOrigin, getWaypoints, allWaypoints;
let totalDistance = 0;
let totalDuration = 0;
let allWaypointsObjects = [];

class TotalTime {
  constructor(duration) {
    this.duration = duration;
  }
  hours() {
    if (this.duration < 3600) {
      return `${(this.duration / 60 ).toFixed(0)} mins`
    } else {
      let hours = Math.trunc(this.duration / 3600);
      let minutes = this.duration % 3600;
      return `${hours} hours ${(minutes /60).toFixed(0)} mins`
    }
  }
}

fetch('/api')
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
    getWaypoints.forEach ((point) => {
      if (point[1].trim() != '') {
        allWaypointsObjects.push({ 'location': point[1], 'stopover': true })
      }
    })
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
      if (getOrigin.trim() == '') {
        getOrigin = myCurrentLocation;
      }

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
            origin: getOrigin,
            destination: getOrigin,
            travelMode: 'DRIVING',
            waypoints: allWaypointsObjects,
            optimizeWaypoints: true
          }, function(response, status) {
            if (status === 'OK') {
              let results = response.routes[0].legs;
              for (var j = 0; j < results.length; j++) {
                totalDistance += results[j].distance.value;
                totalDuration += results[j].duration.value;
              outputDiv.innerHTML += `
                <div class="row small-12">
                  <div class="card">
                    <div class="card-divider">
                      PART ${j+1}:
                    </div>
                    <div class="card-section">
                      <p><strong>From:</strong> ${results[j].start_address} <strong>to</strong> ${results[j].end_address}</p>
                      <p><strong>Distance:</strong> ${results[j].distance.text}, <strong>duration:</strong> ${results[j].duration.text}</p>
                    </div>
                  </div>
                </div>
                `
              }
              totalDurationString = new TotalTime(totalDuration);
              outputDiv.innerHTML += `
                <div class="row small-12">
                  <div class="card">
                    <div class="card-divider">
                      <strong>Summary of the trip:</strong>
                    </div>
                    <div class="card-section">
                      <p><strong>Total distance:</strong> ${(totalDistance / 1609.34).toFixed(1)} miles</p>
                      <p><strong>Total duration:</strong> ${totalDurationString.hours()}</p>
                    </div>
                  </div>
                </div>
                `
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
