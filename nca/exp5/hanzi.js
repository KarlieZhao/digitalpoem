  "use strict";
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const API_KEY = "AIzaSyClTfUh5VuzTtd5KBM2-uCdgBgmeJZlkYw";

  let pixel_density = 2;
  let current_chars = [];


  //color pallette: #19535f; #0b7a75; #c4ab75; #7b2d26; #f0f3f5;

  //TODO:
  //canvas (2?) dissolve effect
  //instruction (mouse interaction)
  //credits:
  //Logic, DNA, and Poetry, Stephen L. Talbott, https://www.thenewatlantis.com/publications/logic-dna-and-poetry
  //Ludwig Wittgenstein


  const parseConsts = model_graph => {
      const dtypes = {
          'DT_INT32': ['int32', 'intVal', Int32Array], //Int32Array: 32 bytes, signed, int array
          'DT_FLOAT': ['float32', 'floatVal', Float32Array]
      };

      const consts = {};

      model_graph.modelTopology.node.filter(n => n.op == 'Const').forEach((node => {
          const v = node.attr.value.tensor;
          const [dtype, field, arrayType] = dtypes[v.dtype];
          if (!v.tensorShape.dim) { //=> dim > 0
              consts[node.name] = [tf.scalar(v[field][0], dtype)];
          } else {
              // if there is a 0-length dimension, the exported graph json lacks "size"
              const shape = v.tensorShape.dim.map(d => (!d.size) ? 0 : parseInt(d.size)); //dimension => size?

              let arr;

              if (v.tensorContent) { //if it's not empty
                  const data = atob(v.tensorContent); //atob => "decode" in some way...
                  const buf = new Uint8Array(data.length); //new ArrayBuffer(length): byte

                  for (var i = 0; i < data.length; ++i) {
                      //data => integer values
                      buf[i] = data.charCodeAt(i);
                      // Size must match the product of shape
                  }

                  arr = new arrayType(buf.buffer);

              } else { //if v.tensorContent is null => 40 nodes in total
                  const size = shape.reduce((a, b) => a * b);
                  arr = new arrayType(size);
                  if (size) {
                      arr.fill(v[field][0]);
                  }
              }

              consts[node.name] = [tf.tensor(arr, shape, dtype)];
              //consts =>{node.name: tensor}
          }
      }));
      return consts;
  }

  const setup = async() => {
      var file = "short_color"
          //   "colors_corner3";
      const D = 32;

      let seed = new Array(16).fill(0).map((x, i) => i < 3 ? 0 : 1);
      seed = tf.tensor(seed, [1, 1, 1, 16]);

      const initState = tf.tidy(() => {
          const a = seed.pad([
              [0, 0],
              [15, 16], //height
              [D / 2 + 1, D / 2 - 2], //width
              [0, 0]
          ]);
          return a;
      });

      var consts;
      var model;

      var r = await fetch("data/" + file + ".json");
      consts = parseConsts(await r.json());
      model = await tf.loadGraphModel("data/" + file + ".json");
      Object.assign(model.weights, consts);

      //model weights are all the parameters (including trainable and non-trainable) of the model
      // which are in turn all the parameters used in the layers of the model

      const state = tf.variable(initState);
      //   const half_state = tf.variable(half_initState);
      const [_, h, w, ch] = state.shape; // => shape of the initial state tensor: (4,2)

      const damage = (x, y, r) => {
          tf.tidy(() => {
              const rx = tf.range(0, w).sub(x).div(r).square().expandDims(0);
              const ry = tf.range(0, h).sub(y).div(r).square().expandDims(1);

              const mask = rx.add(ry).greater(1).expandDims(2);
              state.assign(state.mul(mask));
          });
      }

      const scale = 24;
      const canvas = document.getElementById(`canvas0`);
      const ctx = canvas.getContext('2d');
      let renderOriginal = false;
      if (renderOriginal) {
          canvas.width = w;
          canvas.height = h;
          canvas.style.width = `${w*scale}px`;
          canvas.style.height = `${h*scale}px`;
          canvas.style.display = 'inline-block';

      } else {
          canvas.width = 0;
          canvas.height = 0;
          canvas.style.width = `0px`;
          canvas.style.height = `0px`;
      }

      const canvas_char = document.getElementById(`canvas1`);
      const ctx_char = canvas_char.getContext('2d');
      let w_char = scale * w;
      let h_char = scale * h * 0.85;
      canvas_char.width = w_char * pixel_density;
      canvas_char.height = h_char * pixel_density;

      canvas_char.style.width = `${w_char}px`;
      canvas_char.style.height = `${h_char}px`;

      ctx_char.font = scale - 2 + 'px Noto Serif TC';
      ctx_char.textBaseline = "top";

      ctx_char.scale(pixel_density, pixel_density);

      function step() {
          //state => shape=[1,96(h),96(w),16]
          tf.tidy(() => {
              state.assign(model.execute({ //.execute(inputs, outputs)
                  x: state,
                  fire_rate: tf.tensor(0.5), //borning rate?
                  angle: tf.tensor(0.0), //rotation angle
                  step_size: tf.tensor(0.6),
              }, ['Identity']));
          });
          if (timer < 1000) {
              timer += 10;
          }

      }

      canvas_char.onmousedown = e => {
          if (!isStart) {
              isStart = true;
              getColorData();
          } else {
              const rect = canvas_char.getBoundingClientRect();
              const x = Math.floor((e.clientX - rect.left) / scale);
              const y = Math.floor((e.clientY - rect.top) / scale);
              if (e.buttons == 1) {
                  damage(x, y, 2);
              }
          }
      }

      canvas_char.onmousemove = e => {
          const rect = canvas_char.getBoundingClientRect();
          const x = Math.floor((e.clientX - rect.left) / scale);
          const y = Math.floor((e.clientY - rect.top) / scale);
          if (e.buttons == 1 && !e.shiftKey) {
              damage(x, y, 2);
          }
      }

      let last_text = [];

      let mousey = canvas_char.width / (2 * pixel_density);

      window.addEventListener('keydown', move, false);

      function move(e) {
          //   returnImageData = !returnImageData;
          if (["Space", "ArrowUp", "ArrowDown"].indexOf(e.code) > -1) {
              e.preventDefault();
          }
          if (e.keyCode === 38) {
              mousey -= scale;
          } else if (e.keyCode === 40) {
              mousey += scale;
          }
          mousey = (mousey <= scale * 5) ? scale * 5 : mousey;
          mousey = (mousey >= 23 * scale) ? 23 * scale : mousey;
      }

      function drawCanvas() {
          ctx_char.lineWidth = 3;
          ctx_char.strokeStyle = "#820505";

          ctx_char.setLineDash([15, 20]);
          ctx_char.beginPath();
          ctx_char.moveTo(0, 0);
          ctx_char.lineTo(canvas_char.width / 2, canvas_char.height / 2);
          ctx_char.stroke();

          ctx_char.beginPath();
          ctx_char.moveTo(0, canvas_char.height / 4);
          ctx_char.lineTo(canvas_char.width / 2, canvas_char.height / 4);
          ctx_char.stroke();

          ctx_char.beginPath();
          ctx_char.moveTo(canvas_char.width / 4, 0);
          ctx_char.lineTo(canvas_char.width / 4, canvas_char.height / 2);
          ctx_char.stroke();

          ctx_char.beginPath();
          ctx_char.moveTo(0, canvas_char.height / 2);
          ctx_char.lineTo(canvas_char.width / 2, 0);
          ctx_char.stroke();
          ctx_char.closePath();
      }
      let returnImageData = false;

      function computeText(r, g, b) {
          let min_dist = 1000;
          let c = '';
          let thisColor = rgbToHsl(r, g, b);
          if (thisColor[2] < 0.99) {
              let x_index = 0;
              let y_index = 0;
              for (let i = 0; i < colorRange.length; i++) {
                  for (let j = 0; j < colorRange[i].length; j++) {
                      let r1 = colorRange[i][j].value[0];
                      let g1 = colorRange[i][j].value[1];
                      let b1 = colorRange[i][j].value[2];
                      let dist = Math.sqrt(Math.pow((r - r1), 2) + Math.pow((g - g1), 2) + Math.pow((b - b1), 2));

                      if (dist < min_dist) {
                          min_dist = dist;
                          x_index = i;
                          y_index = j;
                      }
                  }
              }
              c = colorRange[x_index][y_index].char;
          } else {
              c = String.fromCharCode(0x3000);
          }
          return c;
      }

      let timer = 600;

      function getColorData() {
          let print_text = '';

          if (isStart) {
              setTimeout(function() {
                  ctx_char.clearRect(0, 0, canvas_char.width, canvas_char.height);

                  step();
                  const imageData = tf.tidy(() => {
                      const rgba = state.slice([0, 0, 0, 0], [-1, -1, -1, 4]);
                      const a = state.slice([0, 0, 0, 3], [-1, -1, -1, 1]);
                      const img = tf.tensor(1.0).sub(a).add(rgba).mul(255);
                      const rgbaBytes = new Uint8ClampedArray(img.dataSync()); //length: 4*w*h => rgba
                      return new ImageData(rgbaBytes, w, h);
                  });
                  if (returnImageData) console.log(imageData.data);
                  //   drawCanvas();
                  for (let i = 0; i <= imageData.data.length; i += 4) { //ignore alpha channels
                      let hsl = rgbToHsl(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);
                      let hue = hsl[0];
                      let char = '';

                      if (isNaN(hue)) {
                          hsl = [0, 0, 1];
                      }
                      if (last_text[i] === undefined || hsl[2] < 0.95) {
                          char = computeText(imageData.data[i], imageData.data[i + 1], imageData.data[i + 2]);
                          print_text += char;

                      } else if (hsl[2] > 0.95) {
                          char = String.fromCharCode(0x3000);
                          print_text += char;
                      } else {
                          print_text += last_text[i];
                          char = last_text[i];
                      }
                      if (i % (4 * w) === 0 && i != 0) {
                          print_text += "\n";
                      }
                      last_text[i] = char;
                  }

                  if (renderOriginal) ctx.putImageData(imageData, 0, 0);

                  var lines = print_text.split('\n');

                  for (var i = 0; i < lines.length; i++) {
                      for (var j = 0; j < lines[i].length; j++) {
                          if (i * scale === mousey - scale) {
                              ctx_char.fillStyle = "#820505";
                          } else {
                              ctx_char.fillStyle = "#36342f";
                          }
                          ctx_char.fillText(lines[i][j], j * scale, i * scale);
                      }
                  }

                  ctx_2.clearRect(0, 0, canvas_2.width / pixel_density, canvas_2.height / (2 * pixel_density)); //canvas_2.width, canvas_2.height / 2);
                  //   console.log(canvas_2.height);


                  ctx_2.fillStyle = "#820505";
                  ctx_2.font = '12px Courier New';
                  ctx_2.font = fontsz + 'px Noto Serif TC';
                  let selected = lines[Math.floor((mousey - scale) / scale)];
                  while (selected[0] === String.fromCharCode(0x3000)) {
                      selected = selected.slice(1, -1);
                  }
                  let line_1 = selected.substring(0, 9);
                  let line_2 = selected.substring(10, 20);
                  ctx_2.fillText(line_1, 20, (canvas_2.height / 2) / pixel_density - 150);
                  ctx_2.fillText(line_2, 20, (canvas_2.height / 2) / pixel_density - 80);

                  // let trans_en = translate(selected); //promise?
                  //   if (timer >= 500) {
                  translate(selected).then(result => displayTranslation(result));
                  //   }
                  requestAnimationFrame(getColorData);
              }, timer);
          }
      }
      ctx_char.fillStyle = "#36342f";
      ctx_char.fillText("單機以開始。", (w / 2 - 2.3) * scale, ((h * 0.85) / 2 - 2) * scale);
      ctx_char.fillText("Click to start.", (w / 2 - 2.6) * scale, ((h * 0.85) / 2) * scale);
  }
  setup();
  let isStart = false;
  let coolingTime = 0;
  let cooling = true;

  let stepcount = 0;
  let timeout = 370;
  let isPlaying = true;


  async function translate(text) {
      let res = await axios.post(
          `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, { q: text, source: "zh-TW", target: "en-US" }
      );
      let translation = await res.data.data.translations[0].translatedText;
      //   console.log(translation);

      return translation;
  }

  function displayTranslation(result) {

      ctx_2.fillStyle = "#820505";
      ctx_2.font = '28px Courier New';

      result = result.replaceAll("&#39;", "\'");

      if (!PUNCT.test(result[result.length - 1]) && result[0].toUpperCase() === result[0]) {
          result += ".";
      }
      //   console.log(result);
      let line = getLines(ctx_2, result, (canvas_2.width / pixel_density) * 0.9);
      ctx_2.clearRect(0, canvas_2.height / (2 * pixel_density),
          canvas_2.width / pixel_density, canvas_2.height / pixel_density);

      for (var i = 0; i < line.length; i++) {
          ctx_2.fillText(line[i], 20, (canvas_2.height / 2) / pixel_density + i * 40 + 15);
      }
  }

  function getLines(ctx, text, maxWidth) {
      var words = text.split(" ");
      var lines = [];
      var currentLine = words[0];

      for (var i = 1; i < words.length; i++) {
          var word = words[i];
          var width = ctx.measureText(currentLine + " " + word).width;
          if (width < maxWidth) {
              currentLine += " " + word;
          } else {
              lines.push(currentLine);
              currentLine = word;
          }
      }
      lines.push(currentLine);
      return lines;
  }

  function playPause() {
      isPlaying = !isPlaying;
      if (isPlaying) {
          document.getElementById("bt").innerHTML = "Click me to pause";
      } else {
          document.getElementById("bt").innerHTML = "Click again to continue";
      }
  }

  function unicodeToChar(text) {
      return text.replace(/\\u[\dA-F]{4}/gi,
          function(match) {
              return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
          });
  }

  function map(value, in_min, in_max, out_min, out_max) {
      return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  function getColorDist(r1, g1, b1, r2, g2, b2) {
      let d = Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(b2 - b1, 2) + Math.pow(g2 - g1, 2));
      //   console.log(d);
      return d
  }

  function rgbToHsl(r, g, b) {
      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b),
          min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max == min) {
          h = s = 0; // achromatic
      } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
              case r:
                  h = (g - b) / d + (g < b ? 6 : 0);
                  break;
              case g:
                  h = (b - r) / d + 2;
                  break;
              case b:
                  h = (r - g) / d + 4;
                  break;
          }
          h /= 6;
      }
      return [h, s, l];
  }

  const PUNCT = /([?.!;'"])/g;