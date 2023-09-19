const userTab = document.querySelector("[data-userWeather]");

const  searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");

const searchForm =  document.querySelector("[data-searchForm]");

const loadingScreen  = document.querySelector("[loading-container]");

const userInfoContainer = document.querySelector(".user-info-container");




// initially variables needed

let currentTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

currentTab.classList.add("current-tab");

// ek kam or pending hai 
// agr pehle se hmare pass coordinates present honge to unko le lenge
getfromSessionStorage();


// switching of tabs is done while clicking on the tabs 


function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab"); 

        // condition to check on which tab we standing right now 
        if(!searchForm.classList.contains("active")){
            // kya seach from wala container is inivisible, if yes then make it visible 
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("avtive");
            searchForm.classList.add("active");
        }
        else{
            // me pehle search wale tag per tha , ab your weather tab visible krana hai 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab me your weather tab me aagya h toh wheather bhi visible krana hai  
            getfromSessionStorage();
        }    
    }
}

userTab.addEventListener("click", ()=>{
    // pass clickd as tab as input paramter
    switchTab(userTab);
})

switchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
}) 



// check if corrodinates are already present in session storage
function getfromSessionStorage(){
    const localCordinates = sessionStorage.getItem("user-coordinates");
    if(!localCordinates){
        // agr local coordinates nhi mile to mtlb coordinate nnhi pde hai
        // mtlb hmne location ka access nhii dia 
        // tlb hmnko location wali window show krni pdegi
        grantAccessContainer.classList.add("active");
    }
    // lekin ar coordinates pde hain 
    else{
        // JSON.parse method jo hai 
        // json string ko json object me convert krta hai 
        const coordinates = JSON.parse(loadingScreen);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinate){
    const {lat, lon} = coordinate  

    // make grantcontaier invisible
    grantAccessContainer.classList.remove("active");

    // make loader visible
    loadingScreen.classList.add("active");

    // API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
          );
        const data= await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    catch(err){
        //HW
        console.log("Error aa gya");
    }


}


function renderWeatherInfo(weatherInfo){
     // pehle hme sare element fetch krke lane pdenge 
     // mtlb jo jo data hme chahiey
     const cityName= document.querySelector("[data-cityName]");

     const countryIcon = document.querySelector("[data-countryIcon]");

     const desc  = document.querySelector("[data-weatherDesc]");

     const weatherIcon = document.querySelector("[data-weatherIcon]");

     const temp  = document.querySelector("[data-temp]");

     const windspeed  =  document.querySelector("[data-windspeed]");

     const humidity = document.querySelector("[data-humidity]");

     const  cloudiness= document.querySelector("[data-cloudiness]");

     // fetch value from weather   
     cityName.innerText = weatherInfo?.name;
  
     countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  
     desc.innerText = weatherInfo?.weather?.[0]?.description;
  
     weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  
     temp.innerText = weatherInfo?.main?.temp;
  
     windspeed.innertext = weatherInfo?.wind?.speed;
  
     humidity.innertext = weatherInfo?.main?.humidity;
  
     cloudiness.innerText = weatherInfo?.clouds?.al

}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //HW - show an alert for no gelolocation support available
    }
}

function showPosition(position) {

    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}



const searchInput  = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
    }
}














