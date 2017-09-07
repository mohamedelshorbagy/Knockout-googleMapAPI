// API KEY // AIzaSyAP-_EUR5FdxRir90VKWGm9wmW2uCG13No

var map;


// Axios Request


var  clientID = "WBF3Z545NYGBB305UVSSOF01NXKK44NYVQSBCTLA2RI3NBNU",
     clientSecret = "FVDG31MD4AC04M3ASLVBHSIC4YFGKHULSOYPAB2OAXWILZ31";



    var locationLists_2 = [
       { name: 'New York', latLng: { lat: 40.786998, lng: -73.975664 } , content: 'New York' },
       { name: 'San Francisco', latLng: { lat: 37.763061, lng: -122.431935 }, content: 'San Francisco' },
       { name: 'Los Angeles', latLng: { lat: 34.079078, lng: -118.242818 } , content: 'Los Angeles'},
       { name: 'Chicago' , latLng: {lat: 41.881832 , lng: -87.623177} , content:'Chicago' },
       { name:'Dallas' , latLng:{ lat: 33.940369 , lng: -84.692894} , content: 'Dallas' }
    ];







var koViewModel = function(map,locationList) {
  var self = this;

  self.googleMap = map;

  self.allPlaces = [];
    locationList.forEach(function(place) {
      self.allPlaces.push(new Place(place));
  });

  self.allPlaces.forEach(function(place) {
    var markerOptions = {
      map: self.googleMap,
      position: place.latLng,
      animation: google.maps.Animation.DROP,
    };

    place.marker = new google.maps.Marker(markerOptions);
    
    // FourSquares API
    // AXIOS Request
    let insideData = '';
    
axios.get('https://api.foursquare.com/v2/venues/search?ll='+ place.latLng.lat + ',' + place.latLng.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170101' + '&query=' + place.name).then( (result) => {
      

      // name 
      insideData += '<p class="text-center bold">'+result.data.response.venues[0].name + '</p>'; 
      // Phone
      insideData += '<p class="text-center"><a href="#">' + result.data.response.venues[0].contact.phone +'</a></p>';
      // Street
      insideData += '<p class="text-center">' + result.data.response.venues[0].location.formattedAddress[0] + '</p>';

      //URL 
      insideData += '<p class="text-center"><a href="'+ result.data.response.venues[0].url +'">' + result.data.response.venues[0].url  + '</a></p>';

  place.info = new google.maps.InfoWindow({
      content: insideData
  });
      
});


    

  place.marker.addListener('click' , function() {
    place.info.open(self.googleMap , place.marker);
    place.marker.setAnimation(google.maps.Animation.BOUNCE);

    setTimeout(function() {
      place.marker.setAnimation(null);

    }, 1500);

  });


  });

  



  // // Click in the Marker to Highlight it's Marker
  // self.clickMarker = function(place) {
  //     google.maps.event.trigger(place.marker, 'click');
  // }



  self.visiblePlaces = ko.observableArray();




  self.allPlaces.forEach(function(place) {
    self.visiblePlaces.push(place);
  });



  self.userInput = ko.observable('');


	this.listisFiltered = ko.computed( function() {
		var target = self.userInput().toLowerCase();
		if (!target) {
			return self.visiblePlaces();
		} else {
			return ko.utils.arrayFilter(self.visiblePlaces(), function(locationItem) {
				var string = locationItem.name.toLowerCase();
				var result = (string.search(target) >= 0);
				return result;
			});
		}
	}, self);




  self.filterMarkers = function() {
    var searchInput = self.userInput().toLowerCase();

    self.visiblePlaces.removeAll();

    self.allPlaces.forEach(function(place) {
      place.marker.setMap(null);

      if (place.name.toLowerCase().indexOf(searchInput) !== -1) {
        self.visiblePlaces.push(place);
      }
    });

    self.visiblePlaces().forEach(function(place) {
      place.marker.setMap(self.googleMap);
    });
  };


  // self.clickMarker = function(data) {
  //     google.maps.event.trigger(data.marker , 'click');
  // };



  function Place(dataObj) {
    this.name = dataObj.name;
    this.latLng = dataObj.latLng;
    this.marker = null;
    this.info = null;
    this.content = dataObj.content;


    this.clickMarker = function(place) {
      google.maps.event.trigger(place.marker , 'click');

    }
  }



  
};



function initMap() {
    var map =  new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.166294, lng: -96.389016 },
        zoom: 4
    });




google.maps.event.addDomListener(window, 'load', function(){

    var locationList = [
       { name: 'New York', latLng: { lat: 40.786998, lng: -73.975664 } , content: 'New York' },
       { name: 'San Francisco', latLng: { lat: 37.763061, lng: -122.431935 }, content: 'San Francisco' },
       { name: 'Los Angeles', latLng: { lat: 34.079078, lng: -118.242818 } , content: 'Los Angeles'},
       { name: 'Chicago' , latLng: {lat: 41.881832 , lng: -87.623177} , content:'Chicago' },
       { name:'Dallas' , latLng:{ lat: 33.940369 , lng: -84.692894} , content: 'Dallas' }
    ];
    var googleMap = map;
    ko.applyBindings(new koViewModel(googleMap,locationList));

});


}









