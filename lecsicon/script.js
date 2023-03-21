const DISPLAY = document.querySelector("#display");
let typewriter_index = 0;
let count = -1;
let word_data;
let current_text;
const regex = /[.?!]/g;

function setup() {
    loadJSON(display);
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
let refresh_display;

function display(data) {
    typewriter_index = 0;

    let random_index = Math.floor(Math.random() * data.length);
    let text = data[random_index].word + ": " + data[random_index].sentence;
    current_text = text;
    count++;
    if (count === 4) {
        document.getElementById("display").innerHTML = "";
        count = 0;
    }

    typeWriter(text);
    refresh_display = setTimeout(function() {
        display(data);
    }, text.length * 160 + 1000);
}

let type;

function typeWriter(text) {

    if (typewriter_index < text.length) {
        DISPLAY.innerHTML += text.charAt(typewriter_index);
        if (typewriter_index === text.length - 1) {
            DISPLAY.innerHTML += "<br><br>";
        } else if (text.charAt(typewriter_index) === ":") {
            DISPLAY.innerHTML += "<br>";
        }

        typewriter_index++;
        type = setTimeout(function() {
            typeWriter(text);
        }, 70);
    }
}

function typewriterDeleteEffect(text) {
    let index = text.length;
    const intervalId = setInterval(() => {
        if (index === 0) {
            clearInterval(intervalId);
            return;
        }
        text = text.slice(0, index - 1);
        index--;
        document.getElementById("display").innerHTML = text;

    }, 30);
}

document.addEventListener("visibilitychange", function() {
    if (document.hidden) {
        clearTimeout(type);
        clearTimeout(refresh_display);
    } else {
        display(word_data);

        type = setTimeout(function() {
            typeWriter(current_text);
        }, 70);
    }
});