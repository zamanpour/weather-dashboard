// API key
const key = "82b2d5f016cf34e6e2c6f965bcac3efe";

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
        const dateEl = $('<h3>').text(placeName + ' (' + todayDate + ')');
        const iconEl = $('<img>').attr('src', todayIconUrl).addClass('weatherIcon');
        dateEl.append(iconEl);
        const tempDiv = $('<p>').text("Temperature: " + response.list[0].main.temp + " °C");
        const humidityDiv = $('<p>').text("Humidity: " + response.list[0].main.humidity + " %");
        const windDiv = $('<p>').text("Wind: " + response.list[0].wind.speed + " KPH");
        todayCardDiv.append(dateEl, tempDiv, humidityDiv, windDiv);
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
                const dateEl = $('<h5>').text(dateToday);
                const iconEl = $('<img>').attr('src', iconUrl).addClass('weatherIcon');
                const tempEl = $('<p>').text('Temp: ' + temp + ' °C');
                const humidityEl = $('<p>').text('Humidity: ' + humidity + '%');
                cardsDiv.append(dateEl, iconEl, tempEl, humidityEl);
                $('#forecast').append(cardsDiv);

            }
        }
    })
}

// function to record the search history
function recordSearch(cityName) {
    //This is the function to record the search history.
    let cityArr = JSON.parse(localStorage.getItem('cityHistory'));


    if (cityArr === null) { //No search history
        cityArr = [];
        cityArr.unshift(cityName);
        localStorage.setItem('cityHistory', JSON.stringify(cityArr));
        const historyEl = $('<button>').text(cityName);
        historyEl.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
        $('#search-history').prepend(historyEl);

    } else if (cityArr.includes(cityName)) { //exist city
        console.log(('This city is in the search history'));
    } else { //add city to prev history
        console.log(('This is a new city'));
        cityArr.unshift(cityName);
        localStorage.setItem('cityHistory', JSON.stringify(cityArr));
        const historyEl = $('<button>').text(cityName);
        historyEl.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
        $('#search-history').prepend(historyEl);
    }
}

var invalidSearch = false;
// function to show the informations of the searched city
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
    if (!invalidSearch) {

    }

}

//function show related news
function updatePage(NYTData) {
    // Get from the form the number of results to display
    // API doesn't have a "limit" parameter, so we have to do this ourselves
    var numArticles = 5;

    // Loop through and build elements for the defined number of articles
    for (var i = 0; i < numArticles; i++) {
        // Get specific article info for current index
        var article = NYTData.response.docs[i];

        // Increase the articleCount (track article # - starting at 1)
        var articleCount = i + 1;

        // Create the  list group to contain the articles and add the article content for each
        var $articleList = $("<ul>");
        $articleList.addClass("list-group");

        // Add the newly created element to the DOM
        $("#news").append($articleList);

        // If the article has a headline, log and append to $articleList
        var headline = article.headline;
        var $articleListItem = $("<li class='list-group-item articleHeadline'>");

        if (headline && headline.main) {
            //console.log(headline.main);
            $articleListItem.append(
                "<a href='" + article.web_url + "' target='_blank'><h2> " +
                headline.main +
                "</h2></a>"
            );
        }

        // Log section, and append to document if exists
        var section = article.section_name;
        //console.log(article.section_name);
        if (section) {
            $articleListItem.append("<h3>Section: " + section + "</h3>");
        }

        // Log published date, and append to document if exists
        var pubDate = article.pub_date;

        console.log(moment(pubDate).format('DD/MM/YYYY, HH:MM A'));
        //console.log(article.pub_date);
        if (pubDate) {
            $articleListItem.append("<h4>Publication Time: " + moment(pubDate).format('DD/MM/YYYY, HH:MM A') + "</h4>");
        }


        // Append the article
        $articleList.append($articleListItem);
    }
}

// function to initialize the webpage
function initPage() {
    let cityArr = JSON.parse(localStorage.getItem('cityHistory'));
    // console.log(cityArr);
    if (cityArr != null) {
        // console.log('City array is not empty');
        cityArr.forEach(cityName => {
            const historyEl = $('<button>').text(cityName);
            historyEl.attr({ type: 'button', class: 'btn btn-secondary btn-lg btn-block' });
            $('#search-history').append(historyEl);
        })
        // show the latest search result
        showInfo(cityArr[0]);
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
        // console.log(event.target.innerText);
        cityName = event.target.innerText.trim();

        showInfo(cityName);
        $('#search-input').val('');
    })

});


