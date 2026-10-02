const translations = {
  la: {
    title: "Tabulae Memoriae Meae",
    noCardsFront: "Nullae tabulae praesto",
    noCardsBack: "Inporta Codicem",
    counter: (curr, total) => `Tabula ${curr} ex ${total}`,
    prev: "← Retro",
    flip: "Verte",
    next: "Porro →",
    reverse: "Tergum ⇄",
    reversedActive: "Tergum ⇄ (Inversum)",
    importLabel: "Inporta Codicem",
    noFile: "Nullum volumen selectum",
    reset: "Restitue",
    confirmReset: "Restituere codicem ad tabulas initiales?",
    parseError: "Error in volumino perscrutando."
  },
  en: {
    title: "My Memory Cards",
    noCardsFront: "No cards available",
    noCardsBack: "Import a Deck",
    counter: (curr, total) => `Card ${curr} of ${total}`,
    prev: "← Back",
    flip: "Flip",
    next: "Next →",
    reverse: "Reverse ⇄",
    reversedActive: "Reverse ⇄ (Inverted)",
    importLabel: "Import Deck",
    noFile: "No file selected",
    reset: "Reset",
    confirmReset: "Reset the deck to initial cards?",
    parseError: "Error parsing the file."
  }
};

const defaultCards = [
  { front: "Salve", back: "Hello" },
  { front: "Vale", back: "Bye" },
  { front: "Quid agis?", back: "How are you?" },
  { front: "Gratias tibi ago", back: "Thank you" }
];

// SVGs from Heroicons
const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>`;
const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>`;

// Centralized Application State
const state = {
  flashcards: JSON.parse(localStorage.getItem("flashcards")) || defaultCards,
  isDarkMode: localStorage.getItem("darkMode") === "true",
  currentLang: localStorage.getItem("appLang") || "la",
  currentIndex: 0,
  isFlipped: false,
  isReversed: false
};

// DOM Elements
const card = document.getElementById("card");
const cardFront = document.getElementById("cardFront");
const cardBack = document.getElementById("cardBack");
const cardContainer = document.getElementById("cardContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const flipBtn = document.getElementById("flipBtn");
const reverseBtn = document.getElementById("reverseBtn");
const themeBtn = document.getElementById("themeBtn");
const langBtn = document.getElementById("langBtn");
const appTitle = document.getElementById("appTitle");
const cardCounter = document.getElementById("cardCounter");
const fileInput = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileNameDisplay");
const importLabel = document.getElementById("importLabel");
const resetDeckBtn = document.getElementById("resetDeckBtn");

function saveToStorage() {
  localStorage.setItem("flashcards", JSON.stringify(state.flashcards));
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", state.isDarkMode);
  themeBtn.innerHTML = state.isDarkMode ? sunIcon : moonIcon;
}

function applyLanguage() {
  const t = translations[state.currentLang];
  appTitle.textContent = t.title;
  prevBtn.textContent = t.prev;
  flipBtn.textContent = t.flip;
  nextBtn.textContent = t.next;
  reverseBtn.textContent = state.isReversed ? t.reversedActive : t.reverse;
  importLabel.textContent = t.importLabel;
  if (fileInput.files.length === 0) {
    fileNameDisplay.textContent = t.noFile;
  }
  resetDeckBtn.textContent = t.reset;
  langBtn.textContent = state.currentLang.toUpperCase();
  renderCard();
}

function toggleLanguage() {
  state.currentLang = state.currentLang === "la" ? "en" : "la";
  localStorage.setItem("appLang", state.currentLang);
  applyLanguage();
}

function renderCard() {
  const t = translations[state.currentLang];

  if (state.flashcards.length === 0) {
    cardFront.textContent = t.noCardsFront;
    cardBack.textContent = t.noCardsBack;
    cardCounter.textContent = t.counter(0, 0);
    return;
  }

  // Instantly reset rotation visual state without asynchronous timers
  card.classList.remove("flipped");
  state.isFlipped = false;

  const currentCard = state.flashcards[state.currentIndex];
  
  cardFront.textContent = state.isReversed ? currentCard.back : currentCard.front;
  cardBack.textContent = state.isReversed ? currentCard.front : currentCard.back;
  
  cardCounter.textContent = t.counter(state.currentIndex + 1, state.flashcards.length);
}

function toggleFlip() {
  if (state.flashcards.length === 0) return;
  state.isFlipped = !state.isFlipped;
  card.classList.toggle("flipped", state.isFlipped);
}

function toggleReverse() {
  const t = translations[state.currentLang];
  state.isReversed = !state.isReversed;
  reverseBtn.classList.toggle("active", state.isReversed);
  reverseBtn.textContent = state.isReversed ? t.reversedActive : t.reverse;
  renderCard();
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  localStorage.setItem("darkMode", state.isDarkMode);
  applyTheme();
}

function nextCard() {
  if (state.flashcards.length === 0) return;
  state.currentIndex = (state.currentIndex + 1) % state.flashcards.length;
  renderCard();
}

function prevCard() {
  if (state.flashcards.length === 0) return;
  state.currentIndex = (state.currentIndex - 1 + state.flashcards.length) % state.flashcards.length;
  renderCard();
}

// Event Listeners
cardContainer.addEventListener("click", toggleFlip);
flipBtn.addEventListener("click", toggleFlip);
nextBtn.addEventListener("click", nextCard);
prevBtn.addEventListener("click", prevCard);
reverseBtn.addEventListener("click", toggleReverse);
themeBtn.addEventListener("click", toggleTheme);
langBtn.addEventListener("click", toggleLanguage);

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); toggleFlip(); }
  else if (e.code === "ArrowRight") { nextCard(); }
  else if (e.code === "ArrowLeft") { prevCard(); }
  else if (e.key.toLowerCase() === "r") { toggleReverse(); }
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  fileNameDisplay.textContent = file.name;
  const reader = new FileReader();

  reader.onload = function(event) {
    const text = event.target.result;
    try {
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          state.flashcards = parsed.map(item => ({
            front: item.front || item.term || Object.values(item)[0],
            back: item.back || item.definition || Object.values(item)[1]
          }));
        }
      } else {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        const newCards = lines.map(line => {
          // Robust split checking tab, colon, or comma
          const parts = line.split(/[\t:]|,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
          return {
            front: parts[0] ? parts[0].replace(/^"|"$/g, '').trim() : "",
            back: parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : ""
          };
        }).filter(c => c.front && c.back);

        if (newCards.length > 0) state.flashcards = newCards;
      }

      state.currentIndex = 0;
      saveToStorage();
      renderCard();
    } catch (err) {
      alert(translations[state.currentLang].parseError);
    }
  };
  reader.readAsText(file);
});

resetDeckBtn.addEventListener("click", () => {
  const t = translations[state.currentLang];
  if (confirm(t.confirmReset)) {
    state.flashcards = [...defaultCards];
    state.currentIndex = 0;
    fileNameDisplay.textContent = t.noFile;
    saveToStorage();
    renderCard();
  }
});

// Initialization
applyTheme();
applyLanguage();
