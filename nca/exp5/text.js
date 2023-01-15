let text = [];
let line = [];

text[0] = "要把一首詩誕生的軌跡\u3000抓拍成慢鏡頭的長篇"
text[1] = "要把歲月的侮辱改造成一個微妙的隱喻";
text[2] = "出生時被編碼了母語";
text[3] = "從此每一首詩裡都是它砍下的痕跡";
text[4] = "詩人從此決定用母語寫作";
text[5] = "語言是國境綫\u3000詩歌遊走其間"
text[6] = "詩人寫海\u3000寫風\u3000寫枯敗的落月";
text[7] = "海和風和落月也寫自己的詩篇"
text[8] = "詩意在\u3000每一次下筆的遲疑中";
text[9] = "每一次迭代的更替中";
text[10] = "每一輪失控的反復中\u3000每一個孤獨的轉瞬中";
text[11] = "詩人老去\u3000海風與落月未完待續";

// for (let i = 0; i < text.length; i++) {
//     console.log(text[i].length);
// }

let colorRange = [];
colorRange = [
    [{ "char": "要", "value": [100, 0, 1] }, { "char": "把", "value": [114, 1, 4] }, { "char": "一", "value": [127, 0, 3] }, { "char": "首", "value": [142, 0, 4] }, { "char": "詩", "value": [159, 0, 0] }, { "char": "誕", "value": [178, 0, 2] }, { "char": "生", "value": [196, 0, 1] }, { "char": "的", "value": [213, 0, 1] }, { "char": "軌", "value": [229, 2, 1] }, { "char": "跡", "value": [244, 1, 0] }, { "char": "　", "value": [252, 1, 3] }, { "char": "抓", "value": [254, 11, 14] }, { "char": "拍", "value": [255, 28, 28] }, { "char": "成", "value": [255, 47, 49] }, { "char": "慢", "value": [253, 66, 69] }, { "char": "鏡", "value": [255, 88, 90] }, { "char": "頭", "value": [253, 109, 112] }, { "char": "的", "value": [253, 132, 133] }, { "char": "長", "value": [255, 150, 152] }, { "char": "篇", "value": [255, 167, 169] }],
    [{ "char": "要", "value": [102, 41, 2] }, { "char": "把", "value": [115, 47, 1] }, { "char": "歲", "value": [131, 54, 3] }, { "char": "月", "value": [149, 57, 0] }, { "char": "的", "value": [171, 62, 0] }, { "char": "侮", "value": [194, 71, 0] }, { "char": "辱", "value": [214, 81, 1] }, { "char": "改", "value": [233, 89, 0] }, { "char": "造", "value": [248, 98, 1] }, { "char": "成", "value": [255, 113, 10] }, { "char": "一", "value": [255, 125, 25] }, { "char": "個", "value": [255, 138, 49] }, { "char": "微", "value": [254, 151, 73] }, { "char": "妙", "value": [254, 165, 97] }, { "char": "的", "value": [253, 179, 123] }, { "char": "隱", "value": [253, 190, 145] }, { "char": "喻", "value": [255, 201, 167] }],
    [{ "char": "出", "value": [102, 96, 3] }, { "char": "生", "value": [131, 125, 3] }, { "char": "時", "value": [167, 160, 4] }, { "char": "被", "value": [209, 198, 4] }, { "char": "編", "value": [244, 233, 6] }, { "char": "碼", "value": [255, 250, 15] }, { "char": "了", "value": [255, 251, 57] }, { "char": "母", "value": [254, 250, 104] }, { "char": "語", "value": [255, 249, 148] }],
    [{ "char": "從", "value": [72, 100, 0] }, { "char": "此", "value": [81, 116, 4] }, { "char": "每", "value": [96, 137, 4] }, { "char": "一", "value": [109, 161, 0] }, { "char": "首", "value": [126, 185, 3] }, { "char": "詩", "value": [142, 213, 0] }, { "char": "裡", "value": [157, 232, 1] }, { "char": "都", "value": [168, 249, 4] }, { "char": "是", "value": [181, 254, 8] }, { "char": "它", "value": [191, 255, 29] }, { "char": "砍", "value": [199, 254, 55] }, { "char": "下", "value": [206, 254, 83] }, { "char": "的", "value": [212, 251, 111] }, { "char": "痕", "value": [219, 253, 138] }, { "char": "跡", "value": [225, 253, 161] }],
    [{ "char": "詩", "value": [5, 100, 2] }, { "char": "人", "value": [5, 122, 1] }, { "char": "從", "value": [3, 151, 0] }, { "char": "此", "value": [1, 189, 0] }, { "char": "決", "value": [7, 216, 0] }, { "char": "定", "value": [0, 245, 2] }, { "char": "用", "value": [10, 255, 5] }, { "char": "母", "value": [43, 255, 41] }, { "char": "語", "value": [81, 255, 75] }, { "char": "寫", "value": [125, 255, 120] }, { "char": "作", "value": [157, 254, 154] }],
    [{ "char": "語", "value": [1, 103, 69] }, { "char": "言", "value": [0, 118, 76] }, { "char": "是", "value": [0, 143, 95] }, { "char": "國", "value": [0, 172, 107] }, { "char": "境", "value": [3, 200, 129] }, { "char": "綫", "value": [0, 228, 147] }, { "char": "　", "value": [2, 245, 160] }, { "char": "詩", "value": [11, 255, 174] }, { "char": "歌", "value": [39, 254, 185] }, { "char": "遊", "value": [65, 255, 200] }, { "char": "走", "value": [101, 255, 208] }, { "char": "其", "value": [134, 254, 218] }, { "char": "間", "value": [163, 254, 226] }],
    [{ "char": "詩", "value": [0, 84, 102] }, { "char": "人", "value": [0, 95, 117] }, { "char": "寫", "value": [1, 115, 140] }, { "char": "海", "value": [3, 135, 166] }, { "char": "　", "value": [0, 158, 191] }, { "char": "寫", "value": [2, 182, 219] }, { "char": "風", "value": [5, 200, 241] }, { "char": "　", "value": [2, 216, 254] }, { "char": "寫", "value": [16, 223, 255] }, { "char": "枯", "value": [42, 231, 254] }, { "char": "敗", "value": [71, 233, 255] }, { "char": "的", "value": [102, 236, 255] }, { "char": "落", "value": [137, 236, 255] }, { "char": "月", "value": [161, 237, 254] }],
    [{ "char": "海", "value": [2, 35, 107] }, { "char": "和", "value": [0, 39, 120] }, { "char": "風", "value": [0, 42, 144] }, { "char": "和", "value": [1, 49, 173] }, { "char": "落", "value": [0, 58, 202] }, { "char": "月", "value": [0, 65, 228] }, { "char": "也", "value": [1, 76, 249] }, { "char": "寫", "value": [5, 91, 254] }, { "char": "自", "value": [32, 108, 255] }, { "char": "己", "value": [62, 131, 255] }, { "char": "的", "value": [96, 150, 253] }, { "char": "詩", "value": [131, 173, 255] }, { "char": "篇", "value": [155, 190, 255] }],
    [{ "char": "詩", "value": [25, 0, 104] }, { "char": "意", "value": [29, 0, 119] }, { "char": "在", "value": [31, 0, 143] }, { "char": "　", "value": [34, 0, 171] }, { "char": "每", "value": [38, 0, 200] }, { "char": "一", "value": [43, 0, 227] }, { "char": "次", "value": [50, 0, 246] }, { "char": "下", "value": [66, 1, 254] }, { "char": "筆", "value": [89, 26, 255] }, { "char": "的", "value": [112, 55, 255] }, { "char": "遲", "value": [138, 93, 255] }, { "char": "疑", "value": [163, 124, 255] }, { "char": "中", "value": [182, 153, 253] }],
    [{ "char": "每", "value": [68, 0, 103] }, { "char": "一", "value": [82, 0, 129] }, { "char": "次", "value": [108, 1, 169] }, { "char": "迭", "value": [134, 0, 211] }, { "char": "代", "value": [158, 0, 243] }, { "char": "的", "value": [174, 9, 254] }, { "char": "更", "value": [193, 50, 255] }, { "char": "替", "value": [208, 98, 255] }, { "char": "中", "value": [220, 142, 255] }],
    [{ "char": "每", "value": [100, 0, 94] }, { "char": "一", "value": [111, 0, 102] }, { "char": "輪", "value": [126, 0, 117] }, { "char": "失", "value": [144, 0, 132] }, { "char": "控", "value": [162, 1, 150] }, { "char": "的", "value": [183, 0, 167] }, { "char": "反", "value": [202, 0, 185] }, { "char": "復", "value": [220, 2, 202] }, { "char": "中", "value": [234, 0, 214] }, { "char": "　", "value": [250, 0, 225] }, { "char": "每", "value": [254, 6, 236] }, { "char": "一", "value": [255, 20, 246] }, { "char": "個", "value": [254, 38, 247] }, { "char": "孤", "value": [253, 55, 248] }, { "char": "獨", "value": [255, 81, 250] }, { "char": "的", "value": [254, 106, 249] }, { "char": "轉", "value": [254, 128, 249] }, { "char": "瞬", "value": [255, 148, 248] }, { "char": "中", "value": [255, 165, 247] }],
    [{ "char": "詩", "value": [103, 0, 44] }, { "char": "人", "value": [117, 0, 47] }, { "char": "老", "value": [140, 0, 56] }, { "char": "去", "value": [163, 1, 64] }, { "char": "　", "value": [193, 1, 74] }, { "char": "海", "value": [217, 2, 85] }, { "char": "風", "value": [241, 1, 98] }, { "char": "與", "value": [255, 0, 109] }, { "char": "落", "value": [254, 18, 122] }, { "char": "月", "value": [255, 44, 136] }, { "char": "未", "value": [255, 71, 154] }, { "char": "完", "value": [255, 103, 171] }, { "char": "待", "value": [255, 132, 187] }, { "char": "續", "value": [255, 161, 201] }]
];
// for (let i = 0; i < text.length; i++) {
//     colorRange[i] = [];
//     for (let j = 0; j < text[i].length; j++) {
//         let char = text[i][j];
//         colorRange[i].push({ 'char': char, 'value': [line[i][j][0], line[i][j][1], line[i][j][2]] });
//     }
// }
// const fs = require('fs');
// fs.writeFile("/Users/karlie/Documents/GitHub/NewChAracters/experiments/exp5/text4.txt", JSON.stringify(colorRange), function(err) {
//     if (err) {
//         return console.log(err);
//     }
//     console.log("File saved!");
// });

// toUnicode();

function toUnicode() {
    let t = [];
    let existing_chars = [];
    for (var i = 0; i < text.length; i++) {
        let unicode_d = text.charCodeAt(i);
        let hexString = unicode_d.toString(16);

        for (var j = 0; j < data.length; j++) {
            if (!existing_chars.includes(text[i])) {
                if (data[j].char === "U+" + hexString.toUpperCase()) {
                    t.push({ "char": text[i], "count": data[j].count });
                    existing_chars.push(text[i]);
                    // console.log(existing_chars);
                    break;
                }
            }
        }
    }
    sorted_text = t.sort((a, b) => a.count - b.count); //b-aforreversesort
    //console.log(sorted_text);
}