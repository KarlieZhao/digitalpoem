let crtSentenceIndex = 0;
let leftMargin;
let lineHeight;
let endingMark = /[.?]/;

function generateNewText(text) {
  lastSentence = 0;
  let t = RiTa.tokenize(text);
  let isClickable = false;
  let isPoem = false;
  let isConjunctWord = false;

  text_ypos += lineHeight;
  text_xpos = leftMargin;

  for (let i = 0; i < t.length; i++) {

    if (t[i].charAt(t[i].length - 1) == '[') {
      t[i] = t[i].substr(0, str.length - 1); //get rid of the '['
      isClickable = true;

    } else if (t[i].charAt(t[i].length - 1) == ']') {
      t[i] = t[i].substr(0, str.length - 1); //get rid of the ']'
      isClickable = false;
    } else if (t[i].charAt(t[i].length - 1) == '{') {
      t[i] = t[i].substr(0, str.length - 1);
      isPoem = true;

    } else if (t[i].charAt(t[i].length - 1) == '}') {

      t[i] = t[i].substr(0, str.length - 1);
      isPoem = false;
    } else if (t[i].charAt(t[i].length - 1) == '(') {
      t[i] = t[i].substr(0, str.length - 1);
      isConjunctWord = true;

    } else if (t[i].charAt(t[i].length - 1) == ')') {
      t[i] = t[i].substr(0, str.length - 1);
      isConjunctWord = false;
    }

    if (text_xpos >= width - 1.1 * leftMargin && !RiTa.isPunct(t[i]) && !RiTa.isPunct(t[i + 1])) {
      text_ypos += lineHeight;
      text_xpos = leftMargin;
    }

    let pos = createVector(text_xpos, text_ypos);
    if (t[i] != "") {
      elements.push(new Element(t[i], pos, isClickable, isPoem, isConjunctWord));
      lastSentence++;
    }

    text_xpos += RiTa.isPunct(t[i + 1]) ? textWidth(t[i]) : textWidth(t[i] + " ");

    if (t[i].match(endingMark)) {
      text_xpos = leftMargin;
      text_ypos += lineHeight;
    }
  }
  if (crtSentenceIndex == sentences.length - 2) {
    lastSentence = 0;
  }
}

//-------------------------------------------------
var userLanguage;
var sencondLanguage;

async function loadjson() {
  let f = await fetch('waste.json');
  let response = await f.json();

  for (let i = 0; i < 18; i++) {
    wastesListPairs[i] = {
      "symbol": response[i].symbol,
      "text": response[i].text
    };
  }
  userLanguage = getFirstBrowserLanguage();
  console.log("Browser Language: " + userLanguage);

  for (let i = 0; i < wastesListPairs.length; i++) {
    if (userLanguage.toLowerCase() == wastesListPairs[i].symbol) {
      wordInUserLanguage = wastesListPairs[i].text.split(",");

      break;
    } else {
      if (i == wastesListPairs - 1) {
        console.log("Fail to identify browser language, set language to English.");
        userLanguage = "en";
        wordInUserLanguage = wastesListPairs[0].text.split(","); //default: English;
      }
    }
  }
}

async function getCountryLang() {
  // try {
    const ipresponse = await fetch('https://api.ipify.org/?format=json');
    let response = await ipresponse.json();
    let ip = response.ip;
    console.log("IP:" + ip);

    const country = await fetch('https://json.geoiplookup.io/' + ip);
    let res = await country.json();
    let ctyCode = res.country_code.toLowerCase();
    let cryName = res.country_name;
    console.log("Country code: " + ctyCode);
    const langRes = await fetch('https://restcountries.eu/rest/v2/alpha/' + ctyCode);
    let resp = await langRes.json();
    sencondLanguage = resp.languages[0].iso639_1;

    if (sencondLanguage == userLanguage) {
      if (userLanguage == "en" || userLanguage == "zh-cn") {
        sencondLanguage = "zh-tw";
      } else {
        sencondLanguage = "en";
      }
    }
    console.log("Language code: " + sencondLanguage);

    for (let i = 0; i < wastesListPairs.length; i++) {
      if (sencondLanguage.toLowerCase() == wastesListPairs[i].symbol) {
        wordIncountryLanguage = wastesListPairs[i].text.split(",");
        break;
      }
    }
    if (sencondLanguage.toLowerCase() == "th" || sencondLanguage.toLowerCase() == "ru" || sencondLanguage.toLowerCase() == "vi" ||
      sencondLanguage.toLowerCase() == "ko" || userLanguage.toLowerCase() == "th" || userLanguage.toLowerCase() == "ru" || userLanguage.toLowerCase() == "vi" ||
      userLanguage.toLowerCase() == "ko") {
      firstFont = "Courier New";
    }

    localizedWords = wordInUserLanguage.concat(wordIncountryLanguage);
    console.log(localizedWords);
  // } catch (err) {
  //   console.log('Error -> ', err);
  //   sencondLanguage = "ch-tw";
  //   wordIncountryLanguage = wastesListPairs[1].text.split(","); //default: ch-tw;
  // }
}
