let map;
function initMap () {
  let myLocation = {lat: 42.244, lng: -70.921}
  myMap = new google.maps.Map(document.getElementById('map'), {
    center: myLocation,
    zoom: 15
  });
  var marker = new google.maps.Marker({
    position: myLocation,
    map: myMap
  });

}
