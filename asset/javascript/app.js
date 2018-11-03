//****************************************************//
//****************************************************//

//*************** Google GeoLocation API which ask user to know the current latitude and longitude *************//
function initMapCord(){
    if(!(localStorage.getItem("userLat")&&localStorage.getItem("userLong"))){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position){
                // This defines the local storage variables 
                localStorage.setItem("userLat", position.coords.latitude);
                localStorage.setItem("userLong", position.coords.longitude);
            });
        }
    }
}

//****************** Code is run from here once the document is ready and loaded ******************//

$(document).ready(function() {

//********************** Object to hold the favorite restaurant or food chains ******************************//
    var restaurantButton = {
        topics: ['mcdonalds',
                'burger king',
                'wendys',
                'arbys',
                'olive garden',
                'papa johns',
            ],

        buttonGenerator: function() {
            $('#buttonGroup').empty();
            for (i = 0; i < this.topics.length; i++) {
                var bttn = $('<button />', {
                    "class": 'abstract btn waves-effect',
                    "data-value": this.topics[i],
                    text: this.topics[i]
                });
                $('#buttonGroup').append(bttn);
            }
        }
    };
    restaurantButton.buttonGenerator();
    
    //****************** Stores the my favorite buttons to local storage *******************//
    saveToLocalStorage();
    function saveToLocalStorage(){
        if(localStorage.getItem("favRest")){
            var getRest = localStorage.getItem("favRest");
            restaurantButton.topics = getRest.split(",").splice(0);
            restaurantButton.buttonGenerator();
        }
        else{
            localStorage.setItem("favRest", restaurantButton.topics);
        }        
    }
    
    //********* On click of submit Ajax call to Zomato API to get restaurant details *************//    
    $(document).on("click", "#submitSearch", function(e){
        e.preventDefault();
        
        $(".menu-display").empty();
        //******** API call which searches for specific restaurant in specific city entered by user ********//
        if($("#searchByName").val() && $("#location").val()){
            console.log("specific restaurant in a specfic city");

            var restaurantName = ($("#searchByName").val()).toLowerCase();
            var city = $("#location").val();
            var currentLat = localStorage.getItem("userLat");
            var currentLong = localStorage.getItem("userLong");
    
            var query = "https://developers.zomato.com/api/v2.1/locations?apikey=23c62f98e8626382f65fe3b8fb2ba93f&query="+city;
            console.log(query);
    
            $.ajax({
                url: query,
                method: "GET"
            }).then(function(result){
                console.log(result);

                var searchLat = result.location_suggestions[0].latitude;
                var searchLong = result.location_suggestions[0].longitude;

                console.log(searchLat);
                console.log(searchLong);
                
                var queryDetail = "https://developers.zomato.com/api/v2.1/search?apikey=23c62f98e8626382f65fe3b8fb2ba93f&start=0&count=20"+"&lat="+searchLat+"&lon="+searchLong;
                console.log(queryDetail);

                $.ajax({
                    url: queryDetail,
                    method: "GET"
                }).then(function(result){
                    console.log(result);
                    for(var j=0; j<result.restaurants.length; j++){
                        
                        if(restaurantName===(result.restaurants[j].restaurant.name).toLowerCase()){
                            console.log("restaurant found");
                            var itemDiv = $("<div class= card search-snippet-card search-card>");
                            
                            var itemCont = $("<div class= content>");
                            
                            var restName = $("<h1 class=restName>");
                            restName.text(result.restaurants[j].restaurant.name);
                            itemCont.append(restName);
                            
                            var restAddress = $("<h2 class = restAddress>");
                            restAddress.prepend(result.restaurants[j].restaurant.location.address);
                            itemCont.append(restAddress);
                            
                            var url = result.restaurants[j].restaurant.menu_url;
                            var restUrl = $("<a href="+'"'+url+'"'+"><h3>Click to see Menu</h3></a>");
                            itemCont.append(restUrl);
                        
                            
                            var addFavRest = $("<button id=addFav class=btn btn-outline-success data-value="+JSON.stringify(result.restaurants[j].restaurant.name)+"><h4>Add to My Favorites</h4></button>")

                            // addFavRest.attr("data-value", result.restaurants[j].restaurant.name);
                            itemCont.append(addFavRest);
                            
                            itemDiv.append(itemCont);
                            $(".menu-display").append(itemDiv);
                        }
                    }
                });
            })
        }
        //******** API call which searches for restaurant based on the city entered ********//
        else if($("#location").val()){
            console.log("Restaurant by city");

            var city = $("#location").val();
    
            var query = "https://developers.zomato.com/api/v2.1/locations?apikey=23c62f98e8626382f65fe3b8fb2ba93f&query="+city;
            console.log(query);
    
            $.ajax({
                url: query,
                method: "GET"
            }).then(function(result){
                console.log(result);
    
                var searchLat;
                var searchLong;
    
                searchCity = result.location_suggestions[0].city_name;
                searchLat = result.location_suggestions[0].latitude;
                searchLong = result.location_suggestions[0].longitude;
                
                var queryDetail = "https://developers.zomato.com/api/v2.1/search?apikey=23c62f98e8626382f65fe3b8fb2ba93f&start=0&count=20"+"&lat="+searchLat+"&lon="+searchLong;
                console.log(queryDetail);
    
                $.ajax({
                    url: queryDetail,
                    method: "GET"
                }).then(function(result){
                    console.log(result);
                    for(var j=0; j<result.restaurants.length; j++){
                        console.log(result.restaurants[j]);
            
                        var itemDiv = $("<div class= card search-snippet-card search-card>");
                        
                        var itemCont = $("<div class= content>");
                        
                        var restName = $("<h1 class=restName>");
                        restName.text(result.restaurants[j].restaurant.name);
                        itemCont.append(restName);
                        
                        var restAddress = $("<h2 class = restAddress>");
                        restAddress.text(result.restaurants[j].restaurant.location.address);
                        itemCont.append(restAddress);
                        
                        var url = result.restaurants[j].restaurant.menu_url;
                        var restUrl = $("<a href="+'"'+url+'"'+"><h3>Click to see Menu</h3></a>");
                        itemCont.append(restUrl);                        
                        
                        var addFavRest = $("<button id=addFav class=btn btn-outline-success data-value="+JSON.stringify(result.restaurants[j].restaurant.name)+"><h4>Add to My Favorites</h4></button>")
                        itemCont.append(addFavRest);
                        
                        itemDiv.append(itemCont);
                        $(".menu-display").append(itemDiv);
                    }
                });
            });        
        }

        //******** API call which searches specific restaurant entered by user based on current location *********// 
        else if($("#searchByName").val()){
            console.log("Restaurant by Name");

            var restaurantName = ($("#searchByName").val()).toLowerCase();
            var currentLat = localStorage.getItem("userLat");
            var currentLong = localStorage.getItem("userLong");
            
            var queryDetail = "https://developers.zomato.com/api/v2.1/search?apikey=23c62f98e8626382f65fe3b8fb2ba93f&start=0&count=20"+"&lat="+currentLat+"&lon="+currentLong;
            console.log(queryDetail);

            $.ajax({
                url: queryDetail,
                method: "GET"
            }).then(function(result){
                console.log(result);
                for(var j=0; j<result.restaurants.length; j++){
                    
                    if(restaurantName===(result.restaurants[j].restaurant.name).toLowerCase()){
                        console.log("restaurant found");
                        var itemDiv = $("<div class= card search-snippet-card search-card>");
                        
                        var itemCont = $("<div class= content>");
                        
                        var restName = $("<h1 class=restName>");
                        restName.text(result.restaurants[j].restaurant.name);
                        itemCont.append(restName);
                        
                        var restAddress = $("<h2 class = restAddress>");
                        restAddress.prepend(result.restaurants[j].restaurant.location.address);
                        itemCont.append(restAddress);
                        
                        var url = result.restaurants[j].restaurant.menu_url;
                        var restUrl = $("<a href="+'"'+url+'"'+"><h3>Click to see Menu</h3></a>");
                        itemCont.append(restUrl);
                       
                        
                        var addFavRest = $("<button id=addFav class=btn btn-outline-success data-value="+JSON.stringify(result.restaurants[j].restaurant.name)+"><h4>Add to My Favorites</h4></button>")
                        itemCont.append(addFavRest);
                        
                        itemDiv.append(itemCont);
                        $(".menu-display").append(itemDiv);
                    }
                }
            });
        }            
    });

    //********** On click function to add the selected restaurant to My Favorites list and generate button **********//
    $(document).on("click", "#addFav", function(){
        console.log(this);
        console.log($(this).attr("data-value"));
        newFav = $(this).attr("data-value").toLowerCase();
        if(localStorage.getItem("favRest")) {           
            restaurantButton.topics.push(newFav);
            var storeFav = localStorage.getItem("favRest");
            storeFav = storeFav+","+newFav;
            localStorage.setItem("favRest", storeFav);
            $("#addRestaurant").val('');
            saveToLocalStorage();
        }
        
    })

    //************* On click function for favorite restaurant buttons on my Favorite page ******************//
    $(document).on("click", ".abstract", function() {

        var favRestaurant = $(this).attr("data-value");
        console.log("my fav place: "+favRestaurant);

        //************** Googl GeoLocation API to display specfic places in 10 miles radius of current location ***********/
        var map;
        var infowindow;

        initMap();

        function initMap() {
            
            lat = localStorage.getItem("userLat");
            long = localStorage.getItem("userLong");
            var currentLocation = new google.maps.LatLng(lat, long);
            
            //**************** Centers the map based on you currenct location ****************//
            map = new google.maps.Map(document.getElementById('map'), {
                center: currentLocation,
                zoom: 12
            });
            
            //********* Searches for nearby places for the button clicked ****************//
            console.log("my fav place: "+favRestaurant);
            infowindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: currentLocation,
                radius: 16094,
                name: [favRestaurant]
            }, callback);
        };

        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    console.log(results[i]);
                    createMarker(results[i]);

                    //********** gets the location details such as address, phone-number, ratings etc ***********//
                    var request = {
                        placeId: results[i].place_id
                    };
                    service = new google.maps.places.PlacesService(map);
                    // console.log("request is :"+request.placeId);
                    service.getDetails({placeId:results[i].place_id}, callback);

                    function callback(place, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        createMarker(place);
                        console.log((place));
                    }
                    }
                }
            }
        }
        
        //************* Create Markers for the places ************************//
        function createMarker(place) {
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            
            //************** Displays details on click on the marker for the place ***************//
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent("<div><strong>"+place.name+"</strong><br><b>Address: </b>"+place.formatted_address+"<br><b>Number: </b>"+place.formatted_phone_number+"<br><b>Hours: </b>"+place.opening_hours.weekday_text+"<br><b>Ratings</b>: "+place.rating+"</div>");
                infowindow.open(map, this);
            });
        }
        
    });

    //********** Adds the typed restaurant name to My Favorites List ***************/
    $("#sendGet").on("click", function(event) {
        event.preventDefault();
        var newTopic = $("#addRestaurant").val().toLowerCase().trim();
        // console.log(newTopic);

        if (localStorage.getItem("favRest")) {           
            restaurantButton.topics.push(newTopic);
            var storeFav = localStorage.getItem("favRest");
            storeFav = storeFav+","+newTopic;
            localStorage.setItem("favRest", storeFav);
            $("#addRestaurant").val('');
            saveToLocalStorage();
        }

    });

    //************* Deletes the typed restaurant name from the My Favorites List  **************/
    $("#deleteBtn").on("click", function(event) {
        event.preventDefault();
        var deleteTopic = $("#addRestaurant").val().toLowerCase().trim();
        // console.log(deleteTopic);

        if(localStorage.getItem("favRest")){
            for(var i=0; i<restaurantButton.topics.length; i++){
                if(deleteTopic == restaurantButton.topics[i]){
                    restaurantButton.topics.splice(i,1);
                    restaurantButton.buttonGenerator();
                    var deleteFav = restaurantButton.topics;
                    localStorage.setItem("favRest", deleteFav)
                }
            }
        }
    });

});