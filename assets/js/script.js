// API key
const key = "82b2d5f016cf34e6e2c6f965bcac3efe";

// get lat and lon of the searched city and call showWeather()
function showInfo(placeName) {

    let lonData, latData;
    let queryURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + placeName + '&limit=1&appid=' + key;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
        .then(function (response) {
            //get lat & lon of city
            lonData = response[0].lon;
            latData = response[0].lat;
            console.log(lonData + '  ' + latData);
        })
        .then(function () {
            showWeather(placeName, latData, lonData);
        });

}

// function to show current weather and 5 day forecast of the searched city
function showWeather(placeName, lat, lon) {
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&" + "lon=" + lon + "&units=metric&appid=" + key;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $('#today').empty();
        $('#forecast').empty();

        // Display current weather's temp, wind and humidity
        const todayCardDiv = $('<div>').addClass('card col-12 text-left py-2');
        let todayDate = moment().format("DD/MM/YYYY");
        let todayIcon = response.list[0].weather[0].icon;
        let todayIconUrl = 'https://openweathermap.org/img/wn/' + todayIcon + '.png';
        const date1 = $('<h3>').text(placeName + ' (' + todayDate + ')');
        const icon1 = $('<img>').attr('src', todayIconUrl).addClass('weatherIcon');
        date1.append(icon1);
        const tempDiv = $('<p>').text("Temperature: " + response.list[0].main.temp + " °C");
        const humidityDiv = $('<p>').text("Humidity: " + response.list[0].main.humidity + " %");
        const windDiv = $('<p>').text("Wind: " + response.list[0].wind.speed + " KPH");
        todayCardDiv.append(date1, tempDiv, humidityDiv, windDiv);
        $('#today').append(todayCardDiv)

        const daysTitleDiv = $('<div>').addClass('col-12');
        const daysTitle = $('<h4>').text("5 Days Weather Forecast");
        daysTitleDiv.append(daysTitle);
        $('#forecast').append(daysTitleDiv);

        let date = response.list[0].dt;
        let dateToday = moment.unix(date).format("DD/MM/YYYY");

        for (let i = 1; i < 40; i++) {
            let date = response.list[i].dt;
            dateNext = moment.unix(date).format("DD/MM/YYYY");

            if (dateToday !== dateNext) {
                dateToday = dateNext;
                let temp = response.list[i].main.temp;
                let wind = response.list[i].wind.speed;
                let humidity = response.list[i].main.humidity;
                let icon = response.list[i].weather[0].icon;
                let iconUrl = 'https://openweathermap.org/img/wn/' + icon + '.png';

                //Create cards for each day
                const cardsDiv = $('<div>').addClass('card col m-2 text-white bg-info text-left py-2');
                const dates = $('<h5>').text(dateToday);
                const icons = $('<img>').attr('src', iconUrl).addClass('weatherIcon');
                const temps = $('<p>').text('Temp: ' + temp + ' °C');
                const humidities = $('<p>').text('Humidity: ' + humidity + '%');
                cardsDiv.append(dates, icons, temps, humidities);
                $('#forecast').append(cardsDiv);

            }
        }
    })
}

// function to record the search history
function recordSearch(cityName) {
    //This is the function to record the search history.
    let cityArray = JSON.parse(localStorage.getItem('cityHistory'));


    if (cityArray === null) { //No search history
        cityArray = [];
        cityArray.unshift(cityName);
        localStorage.setItem('cityHistory', JSON.stringify(cityArray));
        const history = $('<button>').text(cityName);
        history.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
        $('#search-history').prepend(history);

    } else if (cityArray.includes(cityName)) { //exist city
        console.log(('This city is in the history'));
    } else { //add city to prev history
        console.log(('This is a new city'));
        cityArray.unshift(cityName);
        localStorage.setItem('cityHistory', JSON.stringify(cityArray));
        const history = $('<button>').text(cityName);
        history.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
        $('#search-history').prepend(history);
    }
}

// function to initialize the webpage
function initPage() {
    let cityArray = JSON.parse(localStorage.getItem('cityHistory'));
    if (cityArray != null) {
        // console.log('City array is not empty');
        cityArray.forEach(cityName => {
            const history = $('<button>').text(cityName);
            history.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
            $('#search-history').append(history);
        })
        // show the latest search result
        showInfo(cityArray[0]);
    }
}

// The page can only be manipulated until the document is 'reday'.
$(document).ready(function () {
    // initialize the webpage when it's loaded
    initPage();

    // event listener for the search form 
    $('#search-form').on('click', 'button', function (event) {
        // Prevent the refresh when hit the 'search' button.
        event.preventDefault();
        // console.log('The button was clicked');

        // Get the city name from the input element
        let cityName = $('#search-input').val().trim();
        // console.log(typeof(cityName));

        if (cityName != '') {
            showInfo(cityName);
            recordSearch(cityName);
            $('#search-input').val('');
        }
    })

    // event listener for the history buttons
    $('#search-history').on('click', 'button', function (event) {
        event.preventDefault();
        cityName = event.target.innerText.trim();

        showInfo(cityName);
        $('#search-input').val('');
    })

});


