// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';
// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const selectDate = document.getElementById('datetime-picker');
const btn = document.querySelector('[data-start]');
const daysValue = document.querySelector('[data-days]');
const hoursValue = document.querySelector('[data-hours]');
const minutesValue = document.querySelector('[data-minutes]');
const secondsValue = document.querySelector('[data-seconds]');

btn.disabled = true;

let userSelectedDate = null;
let timerId = null;

const pickerOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      userSelectedDate = null;
      btn.disabled = true;
      iziToast.warning({
        message: 'Please choose a date in the future',
        position: 'topRight',
        color: 'red',
      });
      return;
    }

    userSelectedDate = selectedDates[0];
    btn.disabled = false;
  },
};

flatpickr(selectDate, pickerOptions);

btn.addEventListener('click', () => {
  if (!userSelectedDate) {
    return;
  }

  btn.disabled = true;
  selectDate.disabled = true;

  updateTimerValues(convertMs(userSelectedDate - Date.now()));

  timerId = setInterval(() => {
    const diff = userSelectedDate - Date.now();

    if (diff <= 0) {
      clearInterval(timerId);
      timerId = null;
      updateTimerValues({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      selectDate.disabled = false;
      userSelectedDate = null;
      return;
    }

    updateTimerValues(convertMs(diff));
  }, 1000);
});

function updateTimerValues({ days, hours, minutes, seconds }) {
  daysValue.textContent = addLeadingZero(days);
  hoursValue.textContent = addLeadingZero(hours);
  minutesValue.textContent = addLeadingZero(minutes);
  secondsValue.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
