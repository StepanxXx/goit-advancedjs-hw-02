'use srict';

// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('form.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const delay = formData.get('delay');
  const state = formData.get('state');

  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else {
        reject(`❌ Rejected promise in ${delay}ms`);
      }
    }, delay);
  })
    .then((message, icon = '', position = 'topRight') =>
      iziToast.success({ icon, message, position })
    )
    .catch((message, icon = '', position = 'topRight') =>
      iziToast.error({ icon, message, position })
    );
});
