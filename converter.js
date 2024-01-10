//===================================================================
// Отримуємо поточну дату
// формат день-месяц-год
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1;
const year = currentDate.getFullYear();
const formattedDate = `${day}.${month}.${year}`;
document.querySelector('.weather__date').textContent = formattedDate;
//формат unix
let unixTimestamp = Math.floor(currentDate.getTime() / 1000);


//===================================================================
//перевести UNIX времени
function conversionTimeFormat(unixTime) {
    // Создание объекта Date с использованием значения UNIX времени
    const time = new Date(unixTime * 1000);

    // Получение значений часов, минут и секунд
    const hours = time.getHours();
    const minutes = time.getMinutes();
    // const seconds = time.getSeconds();

    // Преобразование часов в 12-часовой формат
    let hours12 = hours % 12;
    if (hours12 === 0) {
        hours12 = 12;
    }

    // Определение AM или PM
    const amPm = hours >= 12 ? 'PM' : 'AM';

    // Форматирование времени в 12-часовой формат
    return time12 = `${hours12}:${minutes} ${amPm}`;
}


//===================================================================
// визначити годину
function getHoursTime(unixTime) {
    const time = new Date(unixTime * 1000)
    const hours = time.getHours();
    let hours12 = hours % 12;
    if (hours12 === 0) {
        hours12 = 12;
    }
    const amPm = hours >= 12 ? 'PM' : 'AM';
    return time12 = `${hours12} ${amPm}`;
}


//===================================================================
// определить длину светового дня
function findLengthOfDaylight(sunrise, sunset) {
    const time = new Date((sunset - sunrise) * 1000);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const time24 = `${hours}:${minutes} hr`;
    return time24;
}

//===================================================================
//определение текущего времени в формате unix
function getTimeNowFormatUnix() {
    const currentTimeInMilliseconds = Date.now();
    // Делим значение на 1000, чтобы получить время в секундах (формат Unix)
    const currentTimeInSeconds = Math.floor(currentTimeInMilliseconds / 1000);
    return currentTimeInSeconds;
}

//===================================================================
//перевод дати из формата unix в формат месяц-число
function convertUnixToDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const formattedDay = day < 10 ? '0' + day : day;
    return month.toUpperCase() + ' ' + formattedDay;
}


//===================================================================
//визначити день тижня
function getDayOfWeek(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    return dayOfWeek.toUpperCase();
}



//===================================================================
//конвертер перевода направления ветра градуси - сторони світа
function convertWindDirection(degrees) {
    if (degrees === 0) {
        return " N";
    } else if (degrees > 0 && degrees < 45) {
        return " NNE";
    } else if (degrees === 45) {
        return ' NE';
    } else if (degrees > 45 && degrees < 90) {
        return " ENE";
    } else if (degrees === 90) {
        return ' E';
    } else if (degrees > 90 && degrees < 135) {
        return " ESE";
    } else if (degrees === 135) {
        return " SE";
    } else if (degrees > 135 && degrees < 180) {
        return " SSE";
    } else if (degrees === 180) {
        return " S";
    } else if (degrees > 180 && degrees < 225) {
        return " SSW";
    } else if (degrees === 225) {
        return " SW";
    } else if (degrees > 225 && degrees < 270) {
        return " WSW";
    } else if (degrees === 270) {
        return " W";
    } else if (degrees > 270 && degrees < 315) {
        return " WNW";
    } else if (degrees === 315) {
        return " NW";
    } else if (degrees > 315 && degrees < 360) {
        return " NNW";
    } else {
        return "Некорректное направление";
    }
}

//отримання дати  о 00:00 в unix форматі
function getUnixDateTime(unixTime) {
    const date = new Date(unixTime * 1000);
    date.setHours(0, 0, 0, 0);
    const unixCode = Math.floor(date.getTime() / 1000);
    return unixCode;
}
