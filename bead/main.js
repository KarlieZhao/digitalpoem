let joinedText = " aAH AAhSS AypS SS G~lse llehh lorh hh r~o.r llree luee ee a~n.. ..s.. .nm. .. n~gh. . e.. .ga. .. d~.ew .tlhh setc c. m~.ro phfaa hsuo oc a~t.r oa.dd etru uo .~hbd st... ..el lu m~ees s.t.n .g.d dl a~.a. iwoao hi.. nd d~bd. ba.c. ard. ’n e~rsf lshcm dlen t‘ .~o.a e.iuo ..ao .t .~k.l ..dsr ..t. .. m~efl .gete wth. d. e~nai ei.o. ah.l o. .~.ln nv.mt sr.o .w a~tlg detee .oon .r .~hi. inhda .ufg mi d~rn  n.e.r tg.e at r~ego g.m s ihhr te e~a.u s . . m.e. h. s~d t .h. . eer. .. s~. . ha. o  n.d AA .~    asi r  d r ll .~  h v.n .  l e ll w~  e e.. .  e a .. i~  r .b. a  s m ss t~  . bew n  s . hh h~  . eer g  . . ee .~  b eni e  l o .. b~  r n.n r  u r .. e~  o .tk    c . dd a~  k wal    i . ii d~  e rke    d m dd s~  n ies    . o .. .~  . tn.    . u ww~  . t.     n r aa~  b e      i n ss~  r n      g . ..~  e .      h t cs~  a        t h ot~  t        s e ui~  h            nt~  e            tc~                h ";
let posX, posY;
let drawLetters;
let drawLines = false;
let drawText = true;
let initY;
let initX = 270;
let alphabet;
let timeout = 120;
let speed = [];
let yPos = [];
let setSpeed = false;
let lineHeight = 12.5;
let spacing = 2.7;
let randomIndex = 1000;
let monoFont;

function preload() {
    monoFont = loadFont('RobotoMono-VariableFont_wght.ttf');
}

function setup() {
    createCanvas(1000, 900);
    background(255);
    textFont(monoFont, 15);
    alphabet = getUniqCharacters();
    drawLetters = new Array(alphabet.length).fill(true);
    speed = new Array(joinedText.length).fill(0.0);
    yPos = new Array(joinedText.length).fill(0.0);

    noStroke();
    fill(0);
}

function draw() {
    background(255);
    posX = initX;
    initY = 250;

    text("Press space bar.", 450, 890)

    if (keyIsPressed) {
        if (key === ' ') {
            if (!setSpeed) {
                for (let i = 0; i < speed.length; i++) {
                    speed[i] = random(0.005, 0.02);
                }
                setSpeed = true;
            } else {
                for (let i = 0; i < speed.length; i++) {
                    yPos[i] += speed[i];
                    yPos[i] = constrain(yPos[i], 0, 1);
                }
            }
            timeout = 120;
            randomIndex--;
        }
    } else {
        if (timeout <= 0) {
            for (let i = 0; i < speed.length; i++) {
                speed[i] = (random(randomIndex) < 1) ? random(-0.01, 0) : speed[i];
                yPos[i] += speed[i];
                yPos[i] = constrain(yPos[i], 0, 1);
            }
            randomIndex--;
        } else {
            for (let i = 0; i < speed.length; i++) {
                speed[i] -= (speed[i] > 0 ? 0.0003 : 0);
                yPos[i] += (yPos[i] < 1 && yPos[i] > 0.0001) ? speed[i] : 0;
            }
            timeout--;
        }
    }
    for (let i = 0; i < joinedText.length; i++) {
        let upperCaseChar = joinedText.charAt(i).toUpperCase();
        let index = alphabet.indexOf(upperCaseChar);
        if (index < 0) continue;
        let sortY = index * 15 + 20;
        if ((posX >= width - initX && upperCaseChar === ' ') || joinedText.charAt(i) === '~') {
            initY += lineHeight;
            posX = initX;
        }
        let interY = lerp(sortY, initY, yPos[i]);
        if (drawLetters[index]) {
            if (drawText && joinedText.charAt(i) !== '~') {
                text(joinedText.charAt(i), posX, interY);
            }
        }
        posX += textWidth(joinedText.charAt(i)) * spacing;
    }
}

function getUniqCharacters() {
    let chars = joinedText.toUpperCase();
    let uniqChars = "";
    for (let i = 0; i < chars.length; i++) {
        if (!uniqChars.includes(chars.charAt(i))) {
            uniqChars += chars.charAt(i);
        }
    }
    return uniqChars.split('').sort().join('');
}

function keyReleased() {
    randomIndex = 1000;
    setSpeed = false;
}