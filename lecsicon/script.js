const DISPLAY = document.querySelector("#display");
const PAUSE = document.querySelector("#pause");
const SLIDER = document.querySelector("#temp");

let word_data, keyword_list = [];
const regex = /[.?!]/g;
let textsize = 17;
let lineHeight = 30;
let init_x = 20,
    init_y = 50;
let displayed_word = [];
let timers = [];
let timers_type = [];
let isPaused = false;
let current_index = 0;

const display = document.querySelector("#display");
const ctx = display.getContext("2d");
let scaleFactor = window.devicePixelRatio;

let delay = 70; // milliseconds
let temperature = 1.3;

function setup() {
    if (isMobileDevice()) {
        let scaleFactor = window.devicePixelRatio;
        display.width = window.innerWidth * scaleFactor;
        display.height = window.innerHeight / 2 * scaleFactor;
        display.style.width = window.innerWidth + 'px';
        display.style.height = window.innerHeight / 2 + 'px';
        ctx.scale(scaleFactor, scaleFactor);
        textsize = 30;
        lineHeight = 55;
    } else {
        let scaleFactor = window.devicePixelRatio;
        display.width = window.innerWidth / 1.9 * scaleFactor;
        display.height = window.innerHeight * scaleFactor;
        display.style.width = window.innerWidth / 1.9 + 'px';
        display.style.height = window.innerHeight + 'px';
        ctx.scale(scaleFactor, scaleFactor);
        init_y = display.height / (scaleFactor * 5);
    }
    ctx.font = textsize + "px Special Elite";

    ctx.textBaseline = 'top';

    loadJSON(init);
}
async function loadJSON(callback) {
    try {
        const response = await fetch('./words.json');
        const data = await response.json();

        word_data = data;
        callback(data);
    } catch (error) {
        console.error(error);
    }
}

function pauseAndResume() {
    if (PAUSE.innerText === "Pause") {
        isPaused = true;
        pauseTimeouts();
        PAUSE.innerText = "Resume";
    } else {
        isPaused = false;
        resumeTimeouts();
        PAUSE.innerText = "Pause";
    }
}

function pauseTimeouts() {
    for (let i in timers) {
        clearTimeout(timers[i].timer);
    }
    for (let i in timers_type) {
        clearTimeout(timers_type[i].timer);
    }
}

function resumeTimeouts() {
    if (current_index === 0) { timers[timers.length - 1].delayTime = delay * 2; } else {
        timers[timers.length - 1].delayTime -= delay * (current_index * 1.3);
    }
    let newTimer = setTimeout(timers[timers.length - 1].callback, timers[timers.length - 1].delayTime);
    timers[timers.length - 1].timer = newTimer;
    if (timers_type.length > 1) {
        newTimer = setTimeout(timers_type[timers_type.length - 1].callback, delay);
        timers_type[timers_type.length - 1].timer = newTimer;
    }
}

function init() {
    isPaused = false;
    PAUSE.innerText = "Pause";
    current_index = 0;
    ctx.clearRect(0, 0, display.width, display.height);
    for (let i in timers) clearTimeout(timers[i]);
    for (let i in timers_type) clearTimeout(timers_type[i]);
    timers = [];
    timers_type = [];
    keyword_list = word_data.map(item => item.word);
    let randomWord = word_data[Math.floor(Math.random() * word_data.length)].word;
    horizontalDisplay(randomWord, init_x, init_y);
}

function horizontalDisplay(keyword, startx, starty) {
    displayed_word.push(keyword);
    if (displayed_word.length > 100) displayed_word.slice(0, 1);

    if (starty >= display.height / scaleFactor * 0.8) {
        startx = init_x;
        starty = display.height / (scaleFactor * 5);
        for (let i in timers) clearTimeout(timers[i]);
        for (let i in timers_type) clearTimeout(timers_type[i]);
        timers = timers_type = [];
        ctx.clearRect(0, 0, display.width, display.height);
    }
    let sentence = keyword[0].toUpperCase() + keyword.slice(1, keyword.length) + ": $" + findSentenceByWord(keyword);
    let max_width = display.width / scaleFactor * 0.8;

    let words = sentence.split(" ");
    let line, newSentence = "";
    let block_h = lineHeight * 3;

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        if (ctx.measureText(line + word).width <= max_width) {
            line += word + " ";
            newSentence += word + " ";
        } else {
            block_h += lineHeight;
            line = "$" + word + " ";
            newSentence += "$" + word + " ";
        }
    }
    renderHorizontalText(newSentence, startx, starty, 0);
    starty += block_h;
    let newTimer = setTimeout(() => {
        horizontalDisplay(wander(keyword), startx, starty);
    }, delay * (40 + sentence.length * 1.3));

    timers.push({
        timer: newTimer,
        delayTime: delay * (40 + (sentence.length) * 1.3),
        callback: () => {
            horizontalDisplay(wander(keyword), startx, starty);
        }
    });
}

function wander(keyword) {
    let randomWord = word_data[Math.floor(Math.random() * word_data.length)].word;
    let batch = [];
    batch = findSimilarWords(keyword, temperature);
    // console.log("temperature: " + temperature);
    // console.log("batch: " + batch);
    
    if (batch.length > 1) {
        batch = RemoveAppearedWordsFromBatch(batch);
        if (batch.length) return batch[Math.floor(Math.random() * batch.length)];
    } else {
        batch = [...RiTa.spellsLike(keyword), ...RiTa.soundsLike(keyword)];
        batch = batch.filter(function(word, index) {
            return batch.splice(index, 1).includes(word);
        });
        batch = batch.filter(word => keyword_list.includes(word));
        batch = RemoveAppearedWordsFromBatch(batch);
        if (batch.length) {
            return batch[Math.floor(Math.random() * batch.length)]
        } else {
            batch = findSimilarWords(keyword, temperature * 2);
            if (batch.length > 1) {
                batch = RemoveAppearedWordsFromBatch(batch);
                if (batch.length) return batch[Math.floor(Math.random() * batch.length)];
            }
        }
    }
    console.log("a random word");
    return randomWord;
}

function RemoveAppearedWordsFromBatch(batch) {
    for (let i in displayed_word) {
        let index = batch.indexOf(displayed_word[i]);
        if (index >= 0) {
            batch.splice(index, 1);
        }
    }
    return batch;
}

function findSentenceByWord(word) {
    for (let i in word_data) {
        if (word_data[i].word.toLowerCase() === word.toLowerCase()) {
            return word_data[i].sentence;
        }
    }
    return undefined;
}

function renderHorizontalText(text, x, y, index) {

    const partialText = text[index];

    if (text[index - 1] === " " || text[index - 1] === "$") {
        ctx.fillStyle = `rgb(150, 0, 0)`;
    } else {
        ctx.fillStyle = `rgb(0, 0, 0)`;
    }

    if (text[index] === '$') {
        y += lineHeight;
        x = init_x;
    } else {
        x += textsize * 0.8;
        ctx.fillText(partialText, x, y);
    }
    index++;
    current_index++;

    if (index < text.length) {
        let newTimer = setTimeout(() => {
            renderHorizontalText(text, x, y, index);
        }, delay);
        timers_type.push({
            timer: newTimer,
            callback: () => {
                renderHorizontalText(text, x, y, index);
            }
        });
    } else {
        timers_type = [];
        current_index = 0;
    }
}

function findSimilarWords(word, threshold) {
    const similarWords = [];

    for (let i = 0; i < keyword_list.length; i++) {
        const candidate = keyword_list[i];
        const distance = levenshteinDistance(word, candidate);

        if (distance <= threshold) {
            similarWords.push(candidate);
        }
    }
    return similarWords;
}

function levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Calculate distances
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1],
                    matrix[i][j - 1],
                    matrix[i - 1][j]
                ) + 1;
            }
        }
    }

    return matrix[b.length][a.length];
}

document.addEventListener("visibilitychange", function() {
    if (!isPaused) {
        document.hidden ? pauseTimeouts() : resumeTimeouts();
    }
});

SLIDER.oninput = function() {
    document.getElementById("temperature_val").innerText = this.value;
};

SLIDER.onmouseup = function() {
    temperature = parseFloat(this.value) + 0.3;
    document.getElementById("temperature_val").innerText = this.value;
    let old_delay = delay;
    delay = (2.3 - parseFloat(this.value)) * 70;

    timers[timers.length - 1].delayTime += (delay - old_delay) * current_index;
    console.log(timers[timers.length - 1].delayTime);
};

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}