import React,{useState,useEffect} from 'react'
let APIkey='a1e712f92da3c2ea165707eacb75763e';//this is the key to access the API
import searchIcon from './images/searchIcon.png';
import drizzleIcon from './images/drizzle.avif';
import clearIcon from './images/clear.png';
import clearNightIcon from './images/01n.png';
import cloudIcon from './images/cloud.jpg';
import humidity from './images/humidity.png';
import rainIcon from './images/rain.jpg';
import snowIcon from './images/snow.jpeg';
import wind from './images/wind.png';
import './App.css';
//main APP

const App = () => {

    // weather Icons

    const weatherIcon={
      "01d":clearIcon,
      "01n":clearNightIcon,
      "02d":cloudIcon,
      "02n":cloudIcon,
      "03d":drizzleIcon,
      "03n":drizzleIcon,
      "04d":drizzleIcon,
      "04n":drizzleIcon,
      "09d":rainIcon,
      "09n":rainIcon,
      "010d":rainIcon,
      "010n":rainIcon,
      "013d":snowIcon,
      "013n":snowIcon
    }

  //this state handles dynamic image based on weather
  let [icon,setIcon]=useState("");
  let [cityText,setCityText]=useState('VILLUPURAM');
  let[city,setCity]=useState("");
  let[celcius,setCelcius]=useState(12);
  let[country,setcountry]=useState("INDIA");
  let[lat,setLat]=useState(11.5);
  let[long,setLong]=useState(78.15);
  let[humid,setHumid]=useState(31);
  let[windData,setWindData]=useState(1.5);
  let[cityNotFound,setCityNotFound]=useState(false);

  //setting default value to the city name while it's initial loading
  useEffect(()=>{
                  setCity("VILLUPURAM");
                  search();
               }
    ,[]);

  // in this function handling user input {city name}
  let handleInput = (e) =>{
    setCityText(e.target.value);
  }
 


  //asynchronous function to handle API and submit the city name and API key to API
  let search = async()=>{
    //city is th euser input
      let url=`https://api.openweathermap.org/data/2.5/weather?q=${cityText}&appid=${APIkey}&units=Metric`;
      try{
            let res=await fetch(url);
            //console.log("from try block:" ,res);
            let data=await res.json();
            
            // handling the city not found data
            if(data.cod==="404"){
               setCityNotFound(true);
               console.log("city Not Found");
               return;
            }else{
              setCityNotFound(false);//this data handle city not found statte
              setCity(data.name);
              setCelcius(data.main.temp);
              setcountry(data.sys.country);
              setLat(data.coord.lat);
              setLong(data.coord.lon);
              setHumid(data.main.humidity);
              setWindData(data.wind.speed);
              //containg icon details from API
              let iconDeatilsCode = data.weather[0].icon;
              setIcon(weatherIcon[iconDeatilsCode] || clearIcon);
            }
            //console.log("from try block:" ,data);
      }catch(error){
         console.error(error.message);
      }finally{
         console.log("finally")
      }
  }

//when we trigger the search function(API holding function)
//user press the enter key after entering city name//event goes to input box(holding city value)
 const handleKeyDown =(e)=>{
      if(e.key==='Enter'){
        search();
      }
       //and also the search function triggered when user click the search Icon i did in inline function
      //the search function (API LINK HOLDING FUNCTION) called when the user press the enter key while focusing on input field
 }

  return (
    <div className='container'>
        <main className='appContainer'>
           <div className="searchBoxContainer">
              <input type="text" className='searchInput' onChange={handleInput} value={cityText} onKeyDown={handleKeyDown}/>
              <img src={searchIcon} alt="search-icon" className='searchIcon' onClick={()=>search()}/>
           </div>
           <WeatherDetails
            city={city} celcius={celcius} country={country}
            lat={lat} long={long} humid={humid} windData={windData}
            foundCity={cityNotFound} icon={icon}
           />
        </main>  
    </div> 
  )
}

export default App

//weather Detail Component
 const WeatherDetails = ({city,celcius,country,lat,long,humid,windData,foundCity,icon}) =>{
  return(
    foundCity===true?<div className="cityNotFound">city Not Found</div>:<div className='weatherDetailsContainer'>
        <section className="cityWaeatherInfo">
             <img src={icon || clearIcon} alt="image"/>
             <span className='celcius'>{celcius} C</span>
             <span className='cityName'>{city}</span>
             <span className='countryName'>{country}</span>
        </section>
        <section className="coordinates">
            <div className='lat'>
               <span>Lattitude</span>
               <span>{lat}</span>
            </div>
            <div className='long'>
               <span>Longitude</span>
               <span>{long}</span>
            </div>
        </section>

        <section className='windHumidity'>
            <div className='humidity'>
                <img src={humidity}/>
                <span>{humid}%</span> 
                <span>Humidity</span>
            </div>
            <div className='wind'>
                <img src={wind}/>
                <span>{windData}Km/h</span> 
                <span>Wind Speed</span>
            </div>
        </section>
    </div>
  )
}
