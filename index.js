//Site Controls start 

var forecastDisplay = document.getElementsByClassName('forecast-display')[0] //Show after search
var scrollControls = document.getElementsByClassName('fas') //Show after search
var card = document.getElementsByClassName('card') 

function scrollList(){
    var scrollDir = event.currentTarget.id;
    if(scrollDir === 'right'){
        forecastDisplay.scrollLeft += card[0].offsetWidth + 50;
    }else{
        forecastDisplay.scrollLeft -= card[0].offsetWidth + 50;
    }
}

for(let i = 0; i < scrollControls.length;i++){
    scrollControls[i].addEventListener('click', scrollList)
}
var countryDisplay = document.getElementsByTagName('h1')[0];
var townDisplay = document.getElementsByTagName('h2')[0];

function headerDisplay(parish="",country,city){
    countryDisplay.innerHTML = country;
    townDisplay.innerHTML = city
}
var swtich = document.getElementById('compswitch');
// identify an element to observe
elementToObserve = townDisplay;

// create a new instance of 'MutationObserver' named 'observer', 
// passing it a callback function
observer = new MutationObserver(function(mutations, observer) {
    if(townDisplay.innerHTML === compare.one.place || townDisplay.innerHTML === compare.two.place){
        document.getElementById('compswitch').className = "switch active"
    }else{
        document.getElementById('compswitch').className = "switch"
    }
});

// call 'observe' on that MutationObserver instance, 
// passing it the element to observe, and the options object
observer.observe(elementToObserve, {characterData: false, childList: true, attributes: false});
//Site controls end


//Set weather

//Display search
var showafterSearch = [forecastDisplay,document.getElementsByClassName('controls')[0]]
function optimize(){
    showafterSearch[0].style.display = 'flex'
    showafterSearch[1].style.display = 'flex'
    searchCondition=[]

}

let autocomplete;
function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('searchLoc'),{
            types: ['(cities)'],
            componentRestrictions:{
                'country':['JM','CU','TT']
            },
            fields:['name']
        });
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        var search = place;
        geoCoder(search.name);
    })
}

var geoURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=[ADDRESS]&key=AIzaSyCDOPgg9FOiL8R738zxz2G5tw6g2zN88uI'
function geoCoder(address){
    var georequest = geoURL.replace('[ADDRESS]',address);
    var lat =0;
    var lng =0
    fetch(georequest).then(res => res.json())
    .then(data => {
        var geoResults = data.results[0];
         lat = geoResults.geometry.location.lat;
         lng = geoResults.geometry.location.lng;
         headerDisplay(geoResults.address_components[1].long_name,geoResults.address_components[2].long_name,geoResults.address_components[0].long_name) // parish - country - city 
        getWeather(lat,lng);
    })
}


//weather api
var weatherData; //Stores call from api [is an array]
var weatherURL = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude=minutely,hourly&units=metric&appid=fc773c11a14c1db967c5fbe0308a4680'

function getWeather(var1,var2){
    var weatherReq = weatherURL.replace('{lat}',var1).replace('{lon}',var2);
    fetch(weatherReq).then(response => response.json())
    .then(data => {
        weatherData = data.daily;
        if(display.children.length < 7){
            while(display.children.length < 7){
                createCard(weatherData)
            }
        }else{
            for(let i = 0; i < display.children.length; i ++){
                alterCard(weatherData,i)
            }
        }
    })

    return weatherData;
}
//convert 

function convertTime(unix){
    const date = new Date(unix *1000);
    var day = date.getDay();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    if(minutes < 10){
        minutes = "0"+ minutes
    }
    if(parseInt(hours) > 12){
       hours = parseInt(hours) - 12
    }
    var time = [day,hours,minutes]
    return time;
}

//create and set card

var iconURL = 'http://openweathermap.org/img/wn/{insert}@2x.png';
var dayofWeek = ['Sunday', 'Monday', 'Tuesday','Wednesday','Thursday', 'Friday','Saturday'];
var weatherInfo = ['humidity', 'wind_speed', 'pressure', 'sunrise', 'sunset' ];

var display = document.getElementsByClassName('forecast-display')[0];
var castCard = document.getElementsByClassName('forecastCard');

function createCard(obj){
    var cardCopy = castCard[0].cloneNode(true);
    display.appendChild(cardCopy);
    for(let i = 0; i < display.children.length; i++){
        alterCard(obj,i);
    }
    optimize()
   

}

function alterCard(data,num){
    var forecastCard = forecastDisplay.children[num];
    var forecastKids = forecastCard.children;

     //h6 
        var ind_day = convertTime(data[num].dt);
        forecastKids[0].innerHTML = dayofWeek[ind_day[0]]
    // h6 end
    // card start
    var card = forecastKids[1];
    //Change Icon start
        var newIcon = data[num].weather[0].icon.replace('d','n')
        card.style.backgroundImage = 'url("'+ iconURL.replace('{insert}',newIcon) + '")'
    //Change Icon end
    var cardKids = card.children
    // card header start
        var card_head = cardKids[0].children;
        card_head[1].innerHTML = data[num].temp.max + "/"+ "<br>" + data[num].temp.min;
        card_head[2].innerHTML = data[num].weather[0].description;
        searchCondition.push(data[num].weather[0].description) // To control background image
        card_head[2].id = "daydesc"
    //card header end
    //card body start
        var card_body = cardKids[1].children;
        for(let i = 0; i < card_body.length;i++){
            var input_var = card_body[i].children
                    //Set Values Start
                    switch(i){
                        case 0:
                            var humid_val = data[num].humidity;
                            input_var[1].innerHTML = humid_val +"%";
                            break
                        case 1:
                            var speed_val = (data[num].wind_speed * 3.6).toFixed(1)
                            var wind_dir = data[num].wind_deg;
                            var wind_dirStr = ''
                                switch(wind_dir){
                                    case wind_dir  > 0 && wind_dir < 90:
                                        wind_dirStr = "NN#";
                                        break
                                    case wind_dir === 90:
                                        wind_dirStr = "NE";
                                        break
                                    case wind_dir > 90 && wind_dir <180:
                                        wind_dirStr = "SSE";
                                        break
                                    case wind_dir === 180:
                                        wind_dirStr = "S";
                                        break
                                    case wind_dir > 180 && wind_dir < 270:
                                        wind_dirStr = "SSW"
                                        break
                                    case wind_dir === 270:
                                        wind_dirStr = "W";
                                        break
                                    case wind_dir  > 270 &&  wind_dir < 360:
                                        wind_dirStr = "NNW";
                                        break
                                    case wind_dir === 0:
                                        wind_dirStr = "N"
                                    }
                                    input_var[1].innerHTML = wind_dirStr + " " + speed_val+"m/s";
                            break
                        case 2:
                            var pressure_val = data[i].pressure / 1000;
                                input_var[1].innerHTML = pressure_val + " " + "bar"
                            break;
                        case 3:
                            var sunrise_time = convertTime(data[num].sunrise);
                            input_var[1].innerHTML = sunrise_time[1] + ":" + sunrise_time[2] + " a.m. ";
                            break
                        case 4:
                            var sunset_time = convertTime(data[num].sunset);
                            input_var[1].innerHTML = sunset_time[1] + ":" +sunrise_time[2] + " p.m. ";
                            break
                    }
                    
                    
                    //Set values end                
        }
    //card body end
}
//Overall Conditions
var searchCondition = [] // helps control background image
function windowState(){

}
//Overall Conditions End

var currentPlaceId = '' //Place id of most recent search;
var compare = {
    "full":false,
    "current":0,
    "scroll_day":0,
    "place_ID1":"",
    "place_ID2":"",
    "days":[],
    "one":{
        "place":"",
        "card":{
            "humidity":[],
            "pressure":[],
            "temp":[],
            "wind":[],
            "sunrise":[],
            "sunset":[],
            "cond":[],
            "icons":[]
        }
    },
    "two":{
        "place":"",
        "card":{
            "humidity":[],
            "pressure":[],
            "temp":[],
            "wind":[],
            "sunrise":[],
            "sunset":[],
            "cond":[],
            "icons":[]
        }    
    }
    
}
function createComparison(num){ //num changed on trigger based on number of elements in dom   
    for(let i = 0; i < castCard.length; i ++){
        var day = castCard[i].getElementsByTagName('h6')[0].innerHTML
        compare.days.push(day);
        //background url
        var element = castCard[i].children[1]
        var background = window.getComputedStyle(element,false);
        var back_style = background.backgroundImage.replace('url("',"").replace('")',"").replace('http','https');

        //Card head
        var card_head = castCard[i].children[1].children[0];
        var temp = card_head.getElementsByTagName('h3')[0].innerHTML.replace("<br>"," ");
        var cond = card_head.getElementsByTagName('span')[0].innerHTML;
        //Card body
        var card_body = castCard[i].children[1].children[1];
        var humidity = card_body.children[0].getElementsByTagName('h4')[0].innerHTML;
        var speed = card_body.children[1].getElementsByTagName('h4')[0].innerHTML;
        var pressure = card_body.children[2].getElementsByTagName('h4')[0].innerHTML;
        var sunrise = card_body.children[3].getElementsByTagName('h4')[0].innerHTML;
        var sunset = card_body.children[4].getElementsByTagName('h4')[0].innerHTML;
        var values = [humidity,pressure,temp,speed,sunrise,sunset,cond,back_style];

        if(num === "one"){
            for(let j=0; j < space_one_keys.length;j++){
                space_one_keys[j].push(values[j])
            }

                compare.one.place= document.getElementsByTagName('h2')[0].innerHTML;
                document.getElementById('spotone-place').innerHTML = compare.one.place;
                createCompareCards("one")
            }else{
                for(let k=0; k < space_one_keys.length;k++){
                    space_two_keys[k].push(values[k])
                }
                compare.two.place=document.getElementsByTagName('h2')[0].innerHTML;
                document.getElementById('spottwo-place').innerHTML = compare.two.place
                createCompareCards("two")
            }
    }
    if(num === 'one'){
        space_one.removeChild(space_one.lastChild)
    }else{
        space_two.removeChild(space_two.lastChild)
 
    }

}

var compareCard = document.getElementsByClassName('compare-card');
var space_one =  document.getElementsByClassName('space-one')[0];
var space_two = document.getElementsByClassName('space-two')[0];
var space_one_cards = space_one.children;
var space_two_cards = space_two.children;
var space_one_keys =   [compare.one.card.humidity, compare.one.card.pressure,compare.one.card.temp,compare.one.card.wind,compare.one.card.sunrise,compare.one.card.sunset,
    compare.one.card.icons,compare.one.card.cond,compare.one.card.icons ]
var space_two_keys =   [compare.two.card.humidity, compare.two.card.pressure,compare.two.card.temp,compare.two.card.wind,compare.two.card.sunrise,compare.two.card.sunset,
    compare.two.card.icons,compare.two.card.cond, compare.one.card.icons]


function createCompareCards(num){
    compCardClone = compareCard[0].cloneNode(true);
    if(num==="one"){
        space_one.appendChild(compCardClone);
       for(let i = 0 ; i < space_one.children.length; i ++){
        compCardClone.style.background = "url('" +compare.one.card.icons[i]+ "')"
        var infoSpace = space_one_cards[i].getElementsByTagName('h4');
        var suntime = space_one_cards[i].getElementsByTagName('span')
        infoSpace[0].innerHTML = compare.one.card.temp[i];
        infoSpace[1].innerHTML = compare.one.card.humidity[i];
        infoSpace[2].innerHTML = compare.one.card.wind[i];
        infoSpace[3].innerHTML = compare.one.card.pressure[i]
        suntime[0].innerHTML = compare.one.card.sunrise[i];
        suntime[1].innerHTML = compare.one.card.sunset[i];
       }      
    }else{
        space_two.appendChild(compCardClone);
        for(let i = 0 ; i < space_two.children.length; i ++){
            compCardClone.style.background = 'url("' + compare.two.card.icons[i] + '")'
            var infoSpace2= space_two_cards[i].getElementsByTagName('h4');
            var suntime2 = space_two_cards[i].getElementsByTagName('span')
            infoSpace2[0].innerHTML = compare.two.card.temp[i];
            infoSpace2[1].innerHTML = compare.two.card.humidity[i];
            infoSpace2[2].innerHTML = compare.two.card.wind[i];
            infoSpace2[3].innerHTML = compare.two.card.pressure[i]
            suntime2[0].innerHTML = compare.two.card.sunrise[i];
            suntime2[1].innerHTML = compare.two.card.sunset[i];
           }
    }
}
var compdayDisp = document.getElementById('comp-scroll-day');
function setscrollDay(){
    compdayDisp.innerHTML = compare.days[compare.scroll_day]
}
function clearCompare(){
    let i = 0;
    while(i < 6){
        space_one.removeChild(space_one.lastElementChild);
        if(compare.current > 1){
            space_two.removeChild(space_two.lastElementChild);
        }
          i++
    }
    compare.current = 0;
    compare.full = false;
    compare.scroll_day = 0;
    compare.days = []; 
    let j = 0;
    while(j < space_two_cards.length){
        space_two_cards[j] = [];
        space_one_cards[j]=[];
        j++
    }
}


function main(){
    var $input = $('#searchLoc');
    var $loadAnim = $('.load-anim');
    var $compare = $('.compare');
    var $openCompare = $('.open-tab');
    var $switch = $('.switch');
    var $spot = $('.spot');
    var $scrollRight = $('#right-compare');
    var $scrollLeft = $('#left-compare');
    var $space_one = $('.space-one');
    var $space_two = $('.space-two');
    var $scrlDay = $('#comp-scroll-day')


    $scrollRight.on('click', ()=>{
        var currentScrl = $spot.scrollTop()
        $spot.scrollTop(currentScrl+=300);
        if(compare.scroll_day < 6){
            compare.scroll_day = compare.scroll_day + 1;
            setscrollDay();
        }
    })
    $scrollLeft.on('click', ()=>{
        var currentScrl = $spot.scrollTop()
        $spot.scrollTop(currentScrl-=300);
        if(compare.scroll_day > 0){
            compare.scroll_day = compare.scroll_day - 1;
            setscrollDay()
        }
    });


    $spot.bind('wheel',()=>{
        return false
    }).bind('touchmove',()=>{
        return false
    })

    $openCompare.on('click', ()=>{
        $compare.toggleClass('open');
        compare.scroll_day = 0;
        setscrollDay()
        $spot.scrollTop(0)
    });

    $('#close-compare').on('click', ()=>{
        $compare.removeClass('open')
    })

    $switch.on('click', ()=>{ // Creates compare cards 
        if(compare.current === 0 && compare.full=== false){
            $switch.toggleClass('active');
            $('.compare').addClass('open')
            createComparison("one");
            $space_one.removeClass('empty');
            $('.space-one-empty').addClass('empty')
            $('.compare-slider').removeClass('empty');
            $('.clear').removeClass('empty')
            compare.current = 1
        }else if ((compare.current === 1 && compare.full === false) && compare.one.place !== townDisplay.innerHTML){
            $switch.toggleClass('active');
            createComparison("two");
            compare.current = 2;
            $space_two.removeClass('empty');
            $('.space-two-empty').addClass('empty')
            compare.full=true
        }else{
            $compare.toggleClass('open');

        }
    })

    $('.clear').on('click',()=>{ //Clears compare cards 
            clearCompare();
            $space_one.addClass('empty');
            $('.space-one-empty').removeClass('empty')
            $('.compare-slider').addClass('empty');
            $('.clear').addClass('empty');
            $space_two.addClass('empty');
            $('.space-two-empty').removeClass('empty');
            $('#spottwo-place').html('');
            $('#spotone-place').html('');
            $switch.removeClass('active')         

    })

    $loadAnim.hide()

    $input.on('focus', ()=>{
        $loadAnim.show()
        $('.forecast-display').hide();
        $compare.removeClass('open')
    }).on('blur',()=>{
        $loadAnim.hide()
        if(forecastDisplay.children.length > 1){
            $('.forecast-display').show()
        }       
    })
    $('.main').on('click', ()=>{
        $compare.removeClass('open')
    })
}

//XANO
function postXano(weather){
    fetch("https://x8ki-letl-twmt.n7.xano.io/api:pdY3roUA/comparing",{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(weather)
    }).then(res => console.log(res)).catch(error => alert(error))
}

$(document).ready(main)
