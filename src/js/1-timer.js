'use srict';

// Описаний в документації
import flatpickr from 'flatpickr';
// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const timerInput = document.querySelector('input#datetime-picker');
const startBtnEl = document.querySelector('button[data-start]');
const daysEl = document.querySelector('span[data-days]');
const hoursEl = document.querySelector('span[data-hours]');
const minutesEl = document.querySelector('span[data-minutes]');
const secondsEl = document.querySelector('span[data-seconds]');

startBtnEl.disabled = true;

class Timer {
  constructor({
    onTick,
    showAlert,
    getStartTime,
    startTime = null,
    afterEndAction = null,
  }) {
    this.intervalId = null;
    this.onTick = onTick;
    this.showAlert = showAlert;
    this.getStartTime = getStartTime;
    this.startTime = startTime;
    this.afterEndAction = afterEndAction;
  }

  start() {
    this.stop();

    this.startTime = this.getStartTime();

    if (!this.checkStartTime()) {
      return;
    }

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = this.startTime - currentTime;
      if (deltaTime <= 0) {
        this.reset();
        this.afterEndAction?.();
        return;
      }
      const time = this.convertMs(deltaTime);
      this.onTick(time);
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
  }

  reset() {
    this.stop();
    this.onTick({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }

  checkStartTime(startTime = this.startTime) {
    if (startTime < Date.now()) {
      this.showAlert('Please choose a date in the future');
      this.reset();
      return false;
    }
    return true;
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer({
  onTick: ({ days, hours, minutes, seconds }) => {
    daysEl.textContent = addLeadingZero(days);
    hoursEl.textContent = addLeadingZero(hours);
    minutesEl.textContent = addLeadingZero(minutes);
    secondsEl.textContent = addLeadingZero(seconds);
  },
  showAlert: message => iziToast.error({ message, position: 'topRight' }),
  getStartTime: () => new Date(timerInput.value).getTime(),
  afterEndAction: () => {
    startBtnEl.disabled = true;
    timerInput.disabled = false;
  },
});

function addLeadingZero(value) {
  const normalizedValue = String(value);

  if (normalizedValue.length > 2) {
    return normalizedValue;
  }

  return normalizedValue.padStart(2, '0');
}

startBtnEl.addEventListener('click', () => {
  startBtnEl.disabled = true;
  timerInput.disabled = true;
  timer.start();
});

flatpickr(timerInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const startTime = selectedDates[0].getTime();
    const isStartTimeValid = timer.checkStartTime(startTime);
    startBtnEl.disabled = !isStartTimeValid;
  },
});
