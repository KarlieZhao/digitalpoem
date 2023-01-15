//  const { translate } = require('bing-translate-api');

const API_KEY = "AIzaSyClTfUh5VuzTtd5KBM2-uCdgBgmeJZlkYw";
//  const fs = require('fs');

//  let full_text = "離家久了就變成了無家可歸的人因為身體找不到棲身之所而精神無法滿足於苟且一生於是此後每一個陌生機場的茫然無措之中總有發現原來自己和周圍人長得不一樣的須臾新聞裡看到安倍晉三被當街槍擊想到自己被隨機襲擊的片段掙扎著回家躺在地板上後腦的疼痛一波一波如潮水時間流逝得很慢大腦逐漸失去言語能力就像離家許多年的人他的母語也會慢慢死去一樣我從這時候決定用母語寫作語言是國境線而文學自由穿行出生時被迫選擇了護照至少思想可以去探險你能回到哪裡呢唐山徐州河南還是上海事故和故事只發生在手機裡你都不曾錯過卻也不曾出席因為身在異鄉無人傾訴或是因為隻身飄渺居無定所在踽踽獨行的路上你發現自己也是在這獨一無二的悲情文化下悲情的人誰家玉笛暗飛聲在金色音樂廳裡別人聽是小夜曲你聽是故園情這時便明白離家久了就變成了無家可歸的人";
//  async function translator() {
//      let pairs = [];
//      for (let i = 0; i < full_text.length; i++) { //full_text.length
//          let result = await translate(full_text[i], null, 'en', true);
//          pairs.push({ "ch": full_text[i], "en": result.translation });
//      }
//      //  console.log(result.translation);
//      console.log(pairs);
//      fs.writeFile("/Users/karlie/Documents/GitHub/NewChAracters/experiments/exp5/translation.txt", JSON.stringify(pairs), function(err) {
//          if (err) {
//              return console.log(err);
//          }
//          console.log("File saved!");
//      });
//      //  return pairs;
//  }

 //  fs.writeFile("/Users/karlie/Documents/GitHub/NewChAracters/experiments/exp5/translation.txt", JSON.stringify(pairs), function(err) {
 //      if (err) {
 //          return console.log(err);
 //      }
 //      console.log("File saved!");
 //  });

 console.log(translate("这是"));

 async function translate(text) {
     let res = await axios.post(
         `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, { q: text, target: "en-US" }
     );
     let translation = res.data.data.translations[0].translatedText;
     console.log(translation);
     return translation;
 }

 