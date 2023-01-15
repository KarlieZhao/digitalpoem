const canvas_2 = document.getElementById(`canvas2`);
const ctx_2 = canvas_2.getContext('2d');
let canvas2_scale = 650;
let w_2 = canvas2_scale;
let h_2 = canvas2_scale-50;
canvas_2.width = w_2* pixel_density;
canvas_2.height = h_2* pixel_density;

ctx_2.scale(pixel_density, pixel_density);

canvas_2.style.width = `${w_2}px`;
canvas_2.style.height = `${h_2}px`;
canvas_2.style.display = 'inline-block';
let fontsz = canvas2_scale / 12;
ctx_2.font = fontsz + 'px Noto Serif TC';
ctx_2.textBaseline = "top";

function drawBorders() {

    ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height);
    // ctx_2.fillStyle = "#e8dfc5";
    // ctx_2.fillRect(10, 10, canvas_2.width - 20, canvas_2.height - 20);

    ctx_2.setLineDash([10, 10]);
    ctx_2.lineWidth = 2;
    ctx_2.strokeStyle = "#82050566";
    ctx_2.strokeStyle =  "#7B2D26";
    // ctx_2.strokeRect(1, 1, canvas_2.width-2, canvas_2.height-2);

    // -
    for (let i = 0; i < 4; i++) {
        ctx_2.beginPath();
        ctx_2.moveTo(0, canvas_2.height * (i + 1) / 5);
        ctx_2.lineTo(canvas_2.width, canvas_2.height * (i + 1) / 5);
        ctx_2.stroke();
        ctx_2.closePath();
    }

    // |
    ctx_2.beginPath();
    ctx_2.moveTo(canvas_2.width / 3, 0);
    ctx_2.lineTo(canvas_2.width / 3, canvas_2.height);
    ctx_2.stroke();
    ctx_2.closePath();

    ctx_2.beginPath();
    ctx_2.moveTo(canvas_2.width * 2 / 3, 0);
    ctx_2.lineTo(canvas_2.width * 2 / 3, canvas_2.height);
    ctx_2.stroke();
    ctx_2.closePath();

    // /
    // ctx_2.setLineDash([7, 10]);
    // ctx_2.beginPath();
    // ctx_2.moveTo(10, canvas_2.height - 10);
    // ctx_2.lineTo(canvas_2.width - 10, 10);
    // ctx_2.stroke();
    // ctx_2.closePath();
    // // \
    // ctx_2.beginPath();
    // ctx_2.moveTo(10, 10);
    // ctx_2.lineTo(canvas_2.width - 10, canvas_2.height - 10);
    // ctx_2.stroke();
    // ctx_2.closePath();

    // \
    // ctx_2.beginPath();
    // ctx_2.moveTo(canvas_2.width / 2, 10);
    // ctx_2.lineTo(canvas_2.width - 10, canvas_2.height / 2);
    // ctx_2.stroke();
    // ctx_2.closePath();

    // ctx_2.beginPath();
    // ctx_2.moveTo(10, canvas_2.height / 2);
    // ctx_2.lineTo(canvas_2.width / 2, canvas_2.height - 10);
    // ctx_2.stroke();
    // ctx_2.closePath();

    // /
    // ctx_2.beginPath();
    // ctx_2.moveTo(10, canvas_2.height / 2);
    // ctx_2.lineTo(canvas_2.width / 2, 10);
    // ctx_2.stroke();
    // ctx_2.closePath();

    // ctx_2.beginPath();
    // ctx_2.moveTo(canvas_2.width / 2, canvas_2.height - 10);
    // ctx_2.lineTo(canvas_2.width - 10, canvas_2.height / 2);
    // ctx_2.stroke();
    // ctx_2.closePath();

}