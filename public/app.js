// set empty global variables latitude and longitute
let lat;
let lon;

//set map
const myMap = L.map('map');

//async function to get user location, businesses, and business type in one map
async function userCoord(){
    const location = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
    
    //consoling the user location details and coordinates
    console.log(location);
    console.log([location.coords.latitude, location.coords.longitude]);
    
    //get user lat and lon coords
    lat = location.coords.latitude
    lon = location.coords.longitude
        //creates map based on user coords
    myMap.setView([lat, lon],15);
    
    //creates user coords marker
    const marker = L.marker([lat, lon])
    marker.addTo(myMap).bindPopup('<p1><b>You are Here!</b></p1>').openPopup()
    
    //addes map layer to show user coords
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: '5',
}).addTo(myMap);

    //function for fetching foursquare apis for each business type
    async function getBusiness(business, lat, lon){
        lat = location.coords.latitude
        lon = location.coords.longitude
        
        const options = {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            Authorization: 'fsq35zIGhjUIlGNUtuahxQDMjlSdAq+0+u3/Izm005mKnTE='
            }
        };

        //fetching data with dyanmic link based on business, lat, and lon
        let response = await fetch(`https://api.foursquare.com/v3/places/search?query=${business}&ll=${lat}%2C${lon}&limit=10`, options)     
        let data = await response.text();
        let parsedData = JSON.parse(data);
        let businesses = parsedData.results;
        
        //logs businesses in the area
        console.log(businesses);
        
        //adding markers for each business
        businesses.forEach(business => {
            let businessLat = business.geocodes.main.latitude;
            let businesslon = business.geocodes.main.longitude;
            let businessName = business.name;
            // console.log(element.geocodes.main)
            let businessCoords = [businessLat, businesslon]
            
            const marker = L.marker(businessCoords)
            marker.addTo(myMap).bindPopup(businessName).openPopup()
        });
    }
    
    //function to get business type when selected in dropdown menu and to call getBusiness function
    function getSelection(){
        let selection = document.querySelectorAll('#business-selections')
        //cycles through each value in selection options
        selection.forEach(element => {
            let businessArray = ["coffee", "restaurant", "hotel", "market"]
            //if coffee is selected in dropdown, calls getBusiness() for coffee
            if(element.value === businessArray[0]){
                getBusiness(businessArray[0])
            }
            //if restaurant is selected in dropdown, calls getBusiness() for coffee
            if(element.value === businessArray[1]){
                getBusiness(businessArray[1])
            }
            //if hotel is selected in dropdown, calls getBusiness() for coffee
            if(element.value === businessArray[2]){
                getBusiness(businessArray[2])
            }
            //if market is selected in dropdown, calls getBusiness() for coffee
            if(element.value === businessArray[3]){
                getBusiness(businessArray[3])
            }
            //logs which element is showing when selected in dropdown
            console.log(element.value)
        })
    }
    //calling selections for dropdown business selection
    getSelection()
};
//calling all the functions and coords in userCoord function
userCoord();