// this calendar works perfectly from 1300 to 1500
class JalaliDate {
  // List of leap years
  static leapYearsSet = new Set([
    1300, 1304, 1308, 1313, 1317, 1321, 1325, 1329, 1333, 1337, 1341, 1346,
    1350, 1354, 1358, 1362, 1366, 1370, 1375, 1379, 1383, 1387, 1391, 1395,
    1399, 1403, 1408, 1412, 1416, 1420, 1424, 1428, 1432, 1436, 1441, 1445,
    1449, 1453, 1457, 1461, 1465, 1469, 1473, 1478, 1482, 1486, 1490, 1494,
    1498,
  ]);
  static monthNames = {
    1: 'فروردین',
    2: 'اردیبهشت',
    3: 'خرداد',
    4: 'تیر',
    5: 'مرداد',
    6: 'شهریور',
    7: 'مهر',
    8: 'آبان',
    9: 'آذر',
    10: 'دی',
    11: 'بهمن',
    12: 'اسفند',
  };

  get dateString() {
    //*****************************************************
    if (this._day == undefined || this._month || this._year) {
      return 'no date found';
    }
    return this._year + '/' + this._month + '/' + this._day;
  }

  set dateString(date) {
    date = date.split('/');
    this._day = date[date[0] < 40 ? 0 : 2] * 1;
    this._month = date[1] * 1;
    this._year = date[date[2] > 40 ? 2 : 0] * 1;
  }

  get day() {
    return this._day;
  }
  set day(x) {
    this._day = x;
  }
  get month() {
    return this._month;
  }
  set month(x) {
    this._month = x;
  }
  get year() {
    return this._year;
  }
  set year(x) {
    this._year = x;
  }

  monthLength() {
    if (this._month <= 6 && this._month >= 1) {
      return 31;
    }
    if (this._month <= 11 && this._month >= 7) {
      return 30;
    }
    if (this._month == 12 && JalaliDate.isLeapYear(this._year)) {
      return 30;
    }
    return 29;
  }

  monthName() {
    return JalaliDate.monthNames[this._month];
  }

  nextMonth() {
    if (this.month == 12) {
      this.year += 1;
      this.month = 1;
    } else {
      this.month += 1;
    }
  }

  prevMonth() {
    if (this.month == 1) {
      this.year -= 1;
      this.month = 12;
    } else {
      this.month -= 1;
    }
  }

  weekday() {
    let d = 1;
    for (let i = 1300; i < this._year; i++) {
      d += JalaliDate.isLeapYear(i) ? 2 : 1;
    }
    for (let i = 1; i < this._month; i++) {
      if (i >= 1 && i <= 6) {
        d += 31;
      }
      if (i >= 7 && i <= 11) {
        d += 30;
      }
      if (i == 12 && JalaliDate.isLeapYear(this._year)) {
        d += 30;
      }
      if (i == 12 && !JalaliDate.isLeapYear(this._year)) {
        d += 29;
      }
    }
    d += this._day;
    return d % 7;
  }

  static isLeapYear(year) {
    return JalaliDate.leapYearsSet.has(year);
  }
}

window.addEventListener('load', function () {
  // Get table
  const tb = document.querySelectorAll('.parent-of-date-picker');
  for (let i = 0; i < tb.length; i++) {
    // cancel click
    // tb[i].addEventListener('click', function (e) {e.preventDefault() });
    // get date picker
    const datePicker = tb[i].querySelector('.date-picker');
    // Get table cells
    const td = tb[i].querySelectorAll(
      '.date-picker > div:last-child > div > div'
    );
    // get status bar
    const stat = tb[i].querySelectorAll('.status div')[1];
    // Initialize today obj
    const todayDateString = tb[i].getAttribute('data-today');
    const today = new JalaliDate();
    today.dateString = todayDateString;
    // Initialize showedMonth obj
    const showedMonth = new JalaliDate();
    showedMonth.dateString = todayDateString;
    showedMonth.day = 1;
    // Initialize choosedDate obj
    const choosedDate = new JalaliDate();
    choosedDate.dateString = '0/0/0';
    // Initialize allowed dates
    allowedDates = new Set(tb[i].getAttribute('data-allowed-dates').split(' '));
    function isAllowedDate(date) {
      return allowedDates.has(date);
    }
    // before and after
    const afterButton = tb[i]
      .querySelector('.next-month')
      .addEventListener('click', () => {
        showedMonth.nextMonth();
        updateShowedMonth();
      });
    const beforeButton = tb[i]
      .querySelector('.prev-month')
      .addEventListener('click', () => {
        showedMonth.prevMonth();
        updateShowedMonth();
      });

    // grab date field
    const dateField = tb[i].querySelector('input');

    dateField.addEventListener('focus', () => {
      datePicker.classList.add('on');
      updateShowedMonth();
    });
    
    // disappearing mechanism
    let isOutside = true;
    dateField.addEventListener('mouseleave', () => {isOutside = true});
    dateField.addEventListener('mouseenter', () => {isOutside = false});
    datePicker.addEventListener('mouseleave', () => {isOutside = true});
    datePicker.addEventListener('mouseenter', () => {isOutside = false});
    document.body.onclick = () => {
      if (isOutside) {
        datePicker.classList.remove('on');
      }
    };


    function updateShowedMonth() {
      stat.innerHTML = showedMonth.year + ' ' + showedMonth.monthName();
      let dayCounter = 1;
      td.forEach((td, i) => {
        td.classList.remove('allowed');
        td.classList.remove('today');
        td.innerHTML = '';
        if (
          i >= showedMonth.weekday() &&
          dayCounter <= showedMonth.monthLength()
        ) {
          td.innerHTML = dayCounter;
          // add today class
          if (
            dayCounter == today.day &&
            showedMonth.month == today.month &&
            showedMonth.year == today.year
          ) {
            td.classList.add('today');
          }
          // add allowed class
          if (
            allowedDates.has(
              showedMonth.year + '/' + showedMonth.month + '/' + dayCounter
            )
          ) {
            td.classList.add('allowed');
            td.addEventListener('click', function (e) {
              dateField.value =
                showedMonth.year + '-' + showedMonth.month + '-' + td.innerHTML;
              if (td.parentElement.parentElement.querySelector('.choosed')) {
                td.parentElement.parentElement
                  .querySelector('.choosed')
                  .classList.remove('choosed');
              }
              td.classList.add('choosed');
              setTimeout(function () {
                datePicker.classList.remove('on');
              }, 200);
            });
          }
          dayCounter++;
        }
      });
    }
  }
});
