

//===================================================================
// відкриття вкладок
function openTab(evt, tabName) {
    // Получаем все элементы с классом "tab-content" и скрываем их
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // Получаем все кнопки с классом "tab" и удаляем класс "active"
    const tabs = document.getElementsByClassName("active");
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].className = tabs[i].className.replace(" active", "");
    }

    // Отображаем содержимое выбранной вкладки и добавляем класс "active" к кнопке
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
// По умолчанию открываем первую вкладку при загрузке страницы
document.getElementById("tab1").style.display = "block";


//===================================================================
// ключ від openweathermap
const api_key = 'e2dafe891a017ff3bc6e3d3755cb4ae2';

//ключ api google
const api_google_key = 'AIzaSyCz8a-zeI2X4JwQI_SPjAtn5cSJz9Luk2I';



//===================================================================
// отримання парамерів довготи та ширини 
if ("geolocation" in navigator) {
    // Отримати геолокацію користувача
    navigator.geolocation.getCurrentPosition(function (position, latitude, longitude) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        if (latitude, longitude) {
            findCityByCoordinates(latitude, longitude);
            getWeatherByCoordinates(latitude, longitude) //отримання поточної погоди +48 годин
        } else {
            inputCityName();
        }

    }, function (error) {
        console.error('Помилка отримання геолокації:', error.message);
    });
} else {
    console.log('Геолокація не підтримується в цьому браузері.');
}



//===================================================================
//отримуємо дані погоди по координатам
function getWeatherByCoordinates(latitude, longitude) {
    const url = 'https://api.openweathermap.org/data/3.0/onecall?lat=' + latitude + '&lon=' + longitude + '&appid=' + api_key + '&units=metric';


    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Обработка полученных данных погоды
            outputСurrentWeatherTab1(data);
            outputOfTheHourlyWeatherTab1(data);
            creationTab2(data);

        })
        .catch(function (error) {
            console.error('Ошибка получения данных погоды:', error);
        });
}

//===================================================================
//визначити координати міста
function getCoordinatsByCityName(cityName) {

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${api_google_key}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const latitude = data.results[0].geometry.location.lat;
                const longitude = data.results[0].geometry.location.lng;
                getWeatherByCoordinates(latitude, longitude);

            } else {
                console.log("Не вдалося знайти координати для місця:", cityName);
            }
        })
        .catch(error => {
            console.log("Сталася помилка під час запиту:", error);
        });
}

//===================================================================
// получить название города по координатам
function findCityByCoordinates(latitude, longitude) {
    // Формируем URL запроса к API карт <link>Google</link>
    const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + api_google_key;

    // Отправляем GET-запрос к API
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Проверяем, что получили успешный ответ
            if (data.status === 'OK') {
                // Извлекаем название города из полученных данных
                const city = data.results[0].address_components[2].long_name;
                const country = data.results[0].address_components[5].long_name;
                const inputElement = document.getElementById('inputCity');
                inputElement.placeholder = city + ', ' + country;

            } else {
                console.log('Не удалось найти город по указанным координатам.');
            }
        })
        .catch(function (error) {
            console.log('Произошла ошибка при выполнении запроса: ' + error);
        });
}


//ввод города в инпут
function inputCityName() {
    const inputElement = document.getElementById("inputCity");
    const cityName = inputElement.value;

    if (cityName) {
        getCoordinatsByCityName(cityName);
        inputElement.placeholder = cityName;
    } else {
        console.log("Введіть назву міста");
    }
}

const searchButton = document.getElementById("searchBtn");
searchButton.addEventListener("click", inputCityName);

const cityInput = document.getElementById("inputCity");
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        inputCityName();
    }
});


// ПЕРША ВКЛАДКА
//===================================================================
//поточна інформація//////////////////////////////
function outputСurrentWeatherTab1(data) {
    //Добавляем иконку погоды
    document.querySelector('.weather__icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png">`;

    //погодніе условия
    document.querySelector('.weather__description').textContent = data.current.weather[0].main;

    //температура
    document.querySelector('.weather__temp').innerHTML = Math.round(data.current.temp) + ' &deg; ' + 'C';

    //ощущение температурі
    document.querySelector('.weather__feels').innerHTML = 'Real Feel ' + Math.round(data.current.feels_like) + '&deg;';

    //додаємо схід сонця
    document.querySelector('.sunrise').textContent = conversionTimeFormat(data.current.sunrise);

    //додаємо захід сонця
    document.querySelector('.sunset').textContent = conversionTimeFormat(data.current.sunset);

    //додаємо довжину світлового дня
    document.querySelector('.duration').textContent = findLengthOfDaylight(data.current.sunrise, data.current.sunset);

}


//===================================================================
//збираємо масив погодинна інформація////////////////////////////
function outputOfTheHourlyWeatherTab1(data) {
    let arrayHourlyTable = [
        ['TODAY'],
        [''],
        ['Forecast'],
        ['Temp (°C)'],
        ['Reeal Feel'],
        ['Wind (km/h)'],
        ['unix']
    ];

    //наповнення масиву arrayHourlyTable


    for (let i = 0; i < 24; i++) {
        if (convertUnixToDate(data.current.dt) === convertUnixToDate(data.hourly[i].dt)) {
            arrayHourlyTable[0].push(getHoursTime(data.hourly[i].dt));
            arrayHourlyTable[1].push(data.hourly[i].weather[0].icon);
            arrayHourlyTable[2].push(data.hourly[i].weather[0].main);
            arrayHourlyTable[3].push(Math.round(data.hourly[i].temp) + '°');
            arrayHourlyTable[4].push(Math.round(data.hourly[i].feels_like) + '°');
            arrayHourlyTable[5].push(Math.round(data.hourly[i].wind_speed * 3.6) + convertWindDirection(data.hourly[i].wind_deg));
            arrayHourlyTable[6].push(data.hourly[i].dt)
        }
    }
    if (getDayOfWeek(data.current.dt) !== getDayOfWeek(unixTimestamp)) {
        arrayHourlyTable[0][0].push(getDayOfWeek(data.current.dt))
    }

    buildTable('hourlyTable', arrayHourlyTable);
}


//===================================================================
// будування таблиці погодинних значень
function buildTable(tableId, arr) {
    // Получаем ссылку на таблицу
    const table = document.getElementById(tableId);
    let rows = table.getElementsByTagName('tr');

    for (let i = rows.length - 1; i >= 0; i--) {
        rows[i].remove();
    }
    // Перебираем массив данных и создаем строки и ячейки
    for (let i = 0; i < arr.length - 1; i++) {
        let row = document.createElement("tr"); // Создаем новую строку

        for (let j = 0; j < arr[i].length; j++) {
            let cell = document.createElement("td"); // Создаем новую ячейку
            cell.textContent = arr[i][j]; // Устанавливаем текст ячейки из массива данных
            // Присваиваем название класса каждой ячейке
            cell.classList.add(tableId + i + j);
            row.appendChild(cell); // Добавляем ячейку в строку
        }

        table.appendChild(row); // Добавляем строку в таблицу
    }

    //     //Добавляем иконку погоды
    for (let i = 1; i < arr[0].length; i++) {
        let cell = '1' + i;
        let iconCell = document.querySelector('.' + tableId + cell);
        iconCell.innerHTML = `<img src="https://openweathermap.org/img/wn/${arr[1][i]}@2x.png">`;

    }
}


//ДРУГА ВКЛАДКА
//===================================================================
//створення клонів блоків 5 дней
const originalDiv = document.querySelector(".forecast1");
for (let i = 1; i < 5; i++) {
    const clonedDiv = originalDiv.cloneNode(true);
    clonedDiv.classList.remove('forecast1');
    clonedDiv.classList.add(`forecast${6 - i}`)
    originalDiv.insertAdjacentElement("afterend", clonedDiv);
}
//встановлення другому дню класу active
document.querySelector('.forecast2').classList.add('active_forecast')


function creationTab2(data) {
    // наполнение даніми дни недели

    for (let i = 1; i < 6; i++) {
        let parentElement = document.querySelector('.forecast' + i);
        let forecastWeekdayElement = parentElement.querySelector('.forecast_weekday');
        let forecastDateElement = parentElement.querySelector('.forecast_date');
        parentElement.setAttribute('id', data.daily[i - 1].dt);
        let forecastIconElement = parentElement.querySelector('.forecast_icon');
        let forecastTempElement = parentElement.querySelector('.forecast_temp');
        let forecastMainElement = parentElement.querySelector('.forecast_main');

        if (i === 1) {
            forecastWeekdayElement.textContent = 'TODAY';
        } else {
            forecastWeekdayElement.textContent = getDayOfWeek(data.daily[i - 1].dt).slice(0, 3);
        }
        forecastDateElement.textContent = convertUnixToDate(data.daily[i - 1].dt);
        forecastIconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.daily[i - 1].weather[0].icon}@2x.png">`;
        forecastTempElement.textContent = Math.round(data.daily[i - 1].temp.day) + '°C';
        forecastMainElement.textContent = data.daily[i - 1].weather[0].main;
    }
    // збір масиву з першого запита на 48  годин 
    let arr = {};

    for (let i = 0; i < 5; i++) {
        const day = `day${i + 1}`;

        arr[day] = [
            [getDayOfWeek(data.daily[i].dt)],
            [''],
            ['Forecast'],
            ['Temp (°C)'],
            ['Reeal Feel'],
            ['Wind (km/h)'],
            ['unix']
        ];

        for (let j = 0; j < data.hourly.length; j++) {

            if (arr[day][0][0] === getDayOfWeek(data.hourly[j].dt)) {
                arr[day][0].push(getHoursTime(data.hourly[j].dt));
                arr[day][1].push(data.hourly[j].weather[0].icon);
                arr[day][2].push(data.hourly[j].weather[0].main);
                arr[day][3].push(Math.round(data.hourly[j].temp) + '°');
                arr[day][4].push(Math.round(data.hourly[j].feels_like) + '°');
                arr[day][5].push(Math.round(data.hourly[j].wind_speed * 3.6) + convertWindDirection(data.hourly[j].wind_deg));
                arr[day][6].push(data.hourly[j].dt);
            }
        }
        if (arr[day][6].length < 25) {
            let forecastElement = document.querySelector('.forecast' + (i + 1));
            let forecastId = forecastElement.getAttribute('id');
            let dateTimeUnix = getUnixDateTime(Number(forecastId));

            let newItems = [];
            for (let k = 0; k < 24; k++) {
                let unixTime = dateTimeUnix + 3600 * k;

                let isDuplicate = arr[day][6].some((item) => {
                    return item === unixTime
                });
                if (!isDuplicate) {
                    newItems.push(unixTime);
                }
            }
            arr[day][6] = arr[day][6].concat(newItems)
        }


    }

    const sortedSubarray = arr.day1[6].slice(1).sort();
    arr.day1[6] = [arr.day1[6][0], ...sortedSubarray];
    arr.day1[0][0] = 'TODAY';

    buildTable('hourlyTableForecast', arr.day2);




    let activeForecast = document.querySelectorAll('.block_forecast');

    activeForecast.forEach(function (item) {

        item.addEventListener('click', function (event) {
            activeForecast.forEach(div => {
                div.classList.remove('active_forecast');
            })
            event.currentTarget.className += " active_forecast";
            let active = document.querySelector('.active_forecast');
            let activeAttribute = active ? active.getAttribute('id') : null;

            for (let key in arr) {

                if (arr.hasOwnProperty(key)) {
                    let element = arr[key];
                    let item = element[6];

                    for (let i = 0; i < item.length; i++) {

                        if (Number(activeAttribute) === item[i] && element[0].length === 25) {
                            buildTable('hourlyTableForecast', element);
                        }
                        if (Number(activeAttribute) === item[i] && key === 'day1') {
                            buildTable('hourlyTableForecast', element);
                        }
                        if (Number(activeAttribute) === item[i] && (key === 'day3' || key === 'day4' || key === 'day5')) {
                            getHoursTimeWeather(data, arr[key]);

                        }

                    }
                }

            }

        })
    })

}




//внесення даних про погоду почасово до масиву
function getHoursTimeWeather(dataTime, arr) {

    const latitude = dataTime.lat;
    const longitude = dataTime.lon;

    for (let j = 0; j < 25; j++) {
        if (!arr[0][j]) {


            const url = 'https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=' + latitude + '&lon=' + longitude + '&dt=' + arr[6][j] + '&appid=' + api_key + '&units=metric';

            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {

                    arr[0].push(getHoursTime(data.data[0].dt));
                    arr[1].push(data.data[0].weather[0].icon);
                    arr[2].push(data.data[0].weather[0].main);
                    arr[3].push(Math.round(data.data[0].temp) + '°');
                    arr[4].push(Math.round(data.data[0].feels_like) + '°');
                    arr[5].push(Math.round(data.data[0].wind_speed * 3.6) + convertWindDirection(data.data[0].wind_deg));
                })
                .catch(function (error) {
                    console.error('Ошибка получения данных погоды:', error);
                });
        }
    }
}

