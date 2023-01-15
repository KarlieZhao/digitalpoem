/* Sound source: freesound.org
licensed under the Creative Commons 0 License.
Great thanks to @pulswelle. Link to the file: https://freesound.org/s/339517/ */

let words = [];
let elements = [];
let text_xpos;
let text_ypos = 160;

let wordInUserLanguage = [];
let wordIncountryLanguage = [];
let localizedWords = [];
var wastesListPairs = [];
let canvasW = 1792;
let canvasH = 3500;

let firstFont = "New Tegomin";
let lastSentence = 0;
let waveSound;
let headLine;
let startSound = false;

function preload() {
  loadjson();
   localizedWords=["Takeaway", "Packaging", "Plastic", "Disposable", "Utensils", "Masks", "During", "The epidemic", "What You Neglect", "Everything","Will be", "Buried in", "Plastic", "Suffocated", "To death"]
  getCountryLang();
  waveSound = loadSound('wave.mp3');
}

function setup() {
  frameRate(30);
  if (windowWidth >= 1700 && windowWidth <= 2000) {
    canvasW = windowWidth;
  }
  createCanvas(canvasW, canvasH);
  leftMargin = width / 4;
  textFont(firstFont);
  textSize(19);
  background(0, 0);

  waveSound.amp(0.4);
  lineHeight = 1.7 * (textAscent() + textDescent());
  loadHeading("Listen to the sound of the sea");
  loadSentences();
  generateNewText(sentences[crtSentenceIndex]);
}

function loadHeading(t) {
  let soundButton = t;
  let pos = createVector(leftMargin, 100);
  headLine = new Element(soundButton, pos, true, false, false);
}

function mouseClicked() {
  words = [];
  if (!startSound) {
    startSound = true;
    waveSound.loop();
    loadHeading("Stop listening");
  }
  if (headLine.mouseInsideText()) {
    if (!waveSound.isPlaying()) {
      startSound = true;
      waveSound.loop();
      loadHeading("Stop listening");
    } else {
      waveSound.pause();
      loadHeading("Listen to the sound of the sea");
    }
  }

  if (crtSentenceIndex < sentences.length - 1) {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].mouseInsideText() && elements[i].clickable) {

        if (elements[i].word == "and" || elements[i].word == "everything") {
          crtSentenceIndex += 2;
            for (let j = 0; j < elements.length; j++) {
              elements[j].clickable = false;
            }
            generateNewText(sentences[crtSentenceIndex]);

        } else if (elements[i].word == "fading" || elements[i].word == "away") {
          crtSentenceIndex++;
          generateNewText(sentences[crtSentenceIndex]);
          for (let j = 0; j < elements.length; j++) {
            elements[j].clickable = false;
          }
        } else {
          if (elements[i].word == "memories") {
            generateNewText(inserts[0]);
          } else if (elements[i].word == "responding") {
            generateNewText(inserts[1]);
          }else if (elements[i].word == "lockdown") {
            generateNewText(inserts[2]);
          } else if (elements[i].word == "weightlessness") {
            generateNewText(inserts[3]);
          } else if (elements[i].word == "creature") {
            generateNewText(inserts[4]);
          } else {
            crtSentenceIndex++;
            generateNewText(sentences[crtSentenceIndex]);
          }

          let k = 0;
          while (elements[i - k].clickable && i - k > 0) {
            elements[i - k].clickable = false;
            k++;
          }
          k = 1;
          while (elements[i + k].clickable && i + k < elements.length) {
            elements[i + k].clickable = false;
            k++;
          }
        }
        elements[i].isTouched = false;
      }
    }
  } else {
    restart();
  }
}

function scrollWindow() {
  window.scrollTo(0, 0);
}

function restart() {
  crtSentenceIndex = 0;
  text_xpos = leftMargin;
  text_ypos = 160;

  let newArr = elements.filter(item => (item.isTouched == true && item.isPoem == false));
  elements = newArr;
  scrollWindow();
  generateNewText(sentences[crtSentenceIndex]);
}

function draw() {
  clear();
  createFlowField();
  headLine.render();

  for (let i = 0; i < elements.length; i++) {
    elements[i].render();
  }

  //cursor changed to hand -> clickable
  if (headLine.mouseInsideText()) {
    cursor(HAND);
  } else {
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].clickable && elements[i].mouseInsideText()) {
        cursor(HAND);
        break;
      } else {
        cursor(ARROW);
      }
    }
  }

  for (let i = 0; i < elements.length - lastSentence; i++) {
    if (elements[i].mouseInsideText() && !elements[i].clickable && elements[i].appeared) {
      elements[i].isTouched = true;
    }
  }
  let newArr = elements.filter(item => (item.c > 0));
  elements = newArr;
}
