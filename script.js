'use strict';

// 1. Елементи першого пароля
const passwordScreen = document.getElementById('passwordScreen');
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitBtn');
const errorMsg = document.getElementById('errorMsg');

// 2. Елементи фото-модалки
const photoModal = document.getElementById('photoModal');
const closeModalBtn = document.getElementById('closeModal');
const modalCityName = document.getElementById('modalCityName');
const modalImage = document.getElementById('modalImage');
const modalLetter = document.getElementById('modalLetter');

// 3. Елементи фінального слова
const finalGuessBtn = document.getElementById('finalGuessBtn');
const finalScreen = document.getElementById('finalScreen');
const finalInput = document.getElementById('finalInput');
const submitFinalBtn = document.getElementById('submitFinalBtn');
const finalErrorMsg = document.getElementById('finalErrorMsg');
const successMessage = document.getElementById('successMessage');
const closeFinalModal = document.getElementById('closeFinalModal');
const finalTextElements = document.getElementById('finalTextElements');

// 4. Елементи підказки
const hintBtn = document.getElementById('hintBtn');
const hintScreen = document.getElementById('hintScreen');
const closeHintModal = document.getElementById('closeHintModal');

const cities = [
  {
    name: 'Стокгольм',
    coords: [59.3293, 18.0686],
    letter: 'E',
    image: 'stockholm.png',
  },
  {
    name: 'Кельн',
    coords: [50.9375, 6.9603],
    letter: 'L',
    image: 'cologne.png',
  },
  {
    name: 'Кордова',
    coords: [37.8882, -4.7794],
    letter: '*Пробіл*',
    image: 'cordoba.png',
  },
  {
    name: 'Валенсія',
    coords: [39.4699, -0.3774],
    letter: 'T',
    image: 'valencia.png',
  },
  { name: 'Кадіс', coords: [36.5298, -6.292], letter: 'O', image: 'cadiz.png' },
  {
    name: 'Мадрид',
    coords: [40.4168, -3.7038],
    letter: 'R',
    image: 'madrid.png',
  },
  {
    name: 'Сінтра',
    coords: [38.7992, -9.39],
    letter: 'O',
    image: 'sintra.png',
  },
];

class App {
  #map;
  #mapZoomLevel = 3;
  #centerCoords = [48.0, 5.0];

  constructor() {
    this._attachEventListeners();
  }

  _attachEventListeners() {
    // Перший пароль
    submitBtn.addEventListener('click', this._checkPassword.bind(this));
    passwordInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._checkPassword();
    });

    // Фото-модалка
    closeModalBtn.addEventListener('click', () => {
      photoModal.classList.add('hidden');
    });
    photoModal.addEventListener('click', e => {
      if (e.target === photoModal) photoModal.classList.add('hidden');
    });

    // Фінальна перевірка слова
    finalGuessBtn.addEventListener('click', () => {
      finalScreen.classList.remove('hidden');
    });
    closeFinalModal.addEventListener('click', () => {
      finalScreen.classList.add('hidden');
    });
    submitFinalBtn.addEventListener('click', this._checkFinalWord.bind(this));
    finalInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') this._checkFinalWord();
    });

    // Логіка підказки
    hintBtn.addEventListener('click', () => {
      hintScreen.classList.remove('hidden');
    });
    closeHintModal.addEventListener('click', () => {
      hintScreen.classList.add('hidden');
    });
    hintScreen.addEventListener('click', e => {
      if (e.target === hintScreen) {
        hintScreen.classList.add('hidden');
      }
    });
  }

  _checkPassword() {
    const guess = passwordInput.value.trim().toLowerCase();

    if (guess === 'десна' || guess === 'desna' || guess === 'десни') {
      passwordScreen.classList.add('hidden');
      finalGuessBtn.classList.remove('hidden'); // Показуємо кнопку фіналу на карті
      
      // НОВЕ: Показуємо кнопку підказки після правильного пароля
      hintBtn.classList.remove('hidden');
      
      this._loadMap();
    } else {
      errorMsg.classList.remove('hidden');
      passwordInput.value = '';
      setTimeout(() => errorMsg.classList.add('hidden'), 3000);
    }
  }

  _checkFinalWord() {
    // Видаляємо всі пробіли та переводимо в нижній регістр для перевірки
    const guess = finalInput.value.toLowerCase().replace(/\s+/g, '');

    if (guess === 'eltoro') {
      // Ховаємо інпути, помилку ТА зайвий текст
      finalErrorMsg.classList.add('hidden');
      finalInput.classList.add('hidden');
      submitFinalBtn.classList.add('hidden');
      finalTextElements.classList.add('hidden'); 

      // Показуємо переможний блок з фото
      successMessage.classList.remove('hidden');
    } else {
      // Помилка
      finalErrorMsg.classList.remove('hidden');
      finalInput.value = '';
      setTimeout(() => finalErrorMsg.classList.add('hidden'), 3000);
    }
  }

  _loadMap() {
    this.#map = L.map('map').setView(this.#centerCoords, this.#mapZoomLevel);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri &mdash; Source: Esri' },
    ).addTo(this.#map);

    this._renderMarkers();
  }

  _renderMarkers() {
    cities.forEach(city => {
      const marker = L.marker(city.coords).addTo(this.#map);
      marker.on('click', () => {
        modalCityName.textContent = city.name;
        modalImage.src = city.image;
        modalLetter.textContent = city.letter;
        photoModal.classList.remove('hidden');
      });
    });
  }
}

const app = new App();
