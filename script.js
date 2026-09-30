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

let flashcards = JSON.parse(localStorage.getItem("flashcards")) || defaultCards;
let isDarkMode = localStorage.getItem("darkMode") === "true";
let currentLang = localStorage.getItem("appLang") || "la";
let currentIndex = 0;
let isFlipped = false;
let isReversed = false;

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
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function applyTheme() {
  document.body.classList.toggle("dark-mode", isDarkMode);
  themeBtn.innerHTML = isDarkMode ? sunIcon : moonIcon;
}

function applyLanguage() {
  const t = translations[currentLang];
  appTitle.textContent = t.title;
  prevBtn.textContent = t.prev;
  flipBtn.textContent = t.flip;
  nextBtn.textContent = t.next;
  reverseBtn.textContent = isReversed ? t.reversedActive : t.reverse;
  importLabel.textContent = t.importLabel;
  if (fileInput.files.length === 0) {
    fileNameDisplay.textContent = t.noFile;
  }
  resetDeckBtn.textContent = t.reset;
  langBtn.textContent = currentLang.toUpperCase();
  renderCard();
}

function toggleLanguage() {
  currentLang = currentLang === "la" ? "en" : "la";
  localStorage.setItem("appLang", currentLang);
  applyLanguage();
}

function renderCard() {
  const t = translations[currentLang];

  if (flashcards.length === 0) {
    cardFront.textContent = t.noCardsFront;
    cardBack.textContent = t.noCardsBack;
    cardCounter.textContent = t.counter(0, 0);
    return;
  }

  card.classList.remove("flipped");
  isFlipped = false;

  setTimeout(() => {
    const currentCard = flashcards[currentIndex];
    
    cardFront.textContent = isReversed ? currentCard.back : currentCard.front;
    cardBack.textContent = isReversed ? currentCard.front : currentCard.back;
    
    cardCounter.textContent = t.counter(currentIndex + 1, flashcards.length);
  }, 150);
}

function toggleFlip() {
  if (flashcards.length === 0) return;
  isFlipped = !isFlipped;
  card.classList.toggle("flipped", isFlipped);
}

function toggleReverse() {
  const t = translations[currentLang];
  isReversed = !isReversed;
  reverseBtn.classList.toggle("active", isReversed);
  reverseBtn.textContent = isReversed ? t.reversedActive : t.reverse;
  renderCard();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  localStorage.setItem("darkMode", isDarkMode);
  applyTheme();
}

function nextCard() {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex + 1) % flashcards.length;
  renderCard();
}

function prevCard() {
  if (flashcards.length === 0) return;
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  renderCard();
}

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
          flashcards = parsed.map(item => ({
            front: item.front || item.term || Object.values(item)[0],
            back: item.back || item.definition || Object.values(item)[1]
          }));
        }
      } else {
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
        const newCards = lines.map(line => {
          const delimiter = line.includes(",") ? "," : line.includes("\t") ? "\t" : ":";
          const parts = line.split(delimiter);
          return {
            front: parts[0] ? parts[0].trim() : "",
            back: parts[1] ? parts[1].trim() : ""
          };
        }).filter(c => c.front && c.back);

        if (newCards.length > 0) flashcards = newCards;
      }

      currentIndex = 0;
      saveToStorage();
      renderCard();
    } catch (err) {
      alert(translations[currentLang].parseError);
    }
  };
  reader.readAsText(file);
});

resetDeckBtn.addEventListener("click", () => {
  const t = translations[currentLang];
  if (confirm(t.confirmReset)) {
    flashcards = [...defaultCards];
    currentIndex = 0;
    fileNameDisplay.textContent = t.noFile;
    saveToStorage();
    renderCard();
  }
});

applyTheme();
applyLanguage();
