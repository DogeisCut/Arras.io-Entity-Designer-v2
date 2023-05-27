let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let selectedStyle = 'normal',
color = {
    normal: {
        "teal": "#7ADBBC",
        "lgreen": "#B9E87E",
        "orange": "#E7896D",
        "yellow": "#FDF380",
        "lavender": "#B58EFD",
        "pink": "#EF99C3",
        "vlgrey": "#E8EBF7",
        "lgrey": "#AA9F9E",
        "guiwhite": "#FFFFFF",
        "black": "#484848",
        "blue": "#3CA4CB",
        "green": "#8ABC3F",
        "red": "#E03E41",
        "gold": "#EFC74B",
        "purple": "#8D6ADF",
        "magenta": "#CC669C",
        "grey": "#A7A7AF",
        "dgrey": "#726F6F",
        "white": "#DBDBDB",
        "guiblack": "#000000",
        "paletteSize": 10,
        "border": 0.65
    }
};

function fillStrokeContainer(context, inversedRender, path) {
    if (inversedRender) {
        context.stroke(path);
        context.fill(path);
    } else {
        context.fill(path);
        context.stroke(path);
    }
}

function drawPolygon(context, centerX, centerY, size, shape, angle = 0, inversedRender, sharpPolygons, curvyTraps, sharpTraps) {
    let useMiter = false;
    context.beginPath();
    if (!shape) {
        context.arc(centerX, centerY, size, 0, 2 * Math.PI);
    } else if ("string" === typeof shape) {
        context.save();
        context.translate(centerX, centerY);
        context.scale(size, size);
        context.lineWidth /= size;
        context.rotate(angle);
        fillStrokeContainer(context, inversedRender, new Path2D(shape));
        context.restore();
        return;
    } else if (shape instanceof Array) {
        let ax = Math.cos(angle),
            ay = Math.sin(angle);
        for (let [x, y] of shape) {
            context.lineTo(centerX + size * (x * ax - y * ay), centerY + size * (y * ax + x * ay));
        }
    } else if (0 < shape) {
        if (0 === shape % 2) angle += Math.PI / shape;
        for (let i = 0; i < shape; i++) {
            let a = i / shape * 2 * Math.PI;
            context.lineTo(centerX + size * Math.cos(a + angle), centerY + size * Math.sin(a + angle));
        }
    } else if (0 > shape) {
        if (0 === shape % 2) angle += Math.PI / shape;
        shape = -shape;
        let inner = 1 - 6 / (shape * shape);
        context.moveTo(centerX + size * Math.cos(angle), centerY + size * Math.sin(angle));
        for (let i = 0; i < shape; i++) {
            let h = (i + 0.5) / shape * 2 * Math.PI,
                c = (i + 1  ) / shape * 2 * Math.PI,
                xin = centerX + size * inner * Math.cos(h + angle),
                yin = centerY + size * inner * Math.sin(h + angle),
                xout = centerX + size * Math.cos(c + angle),
                yout = centerY + size * Math.sin(c + angle);
            if (curvyTraps) {
                context.quadraticCurveTo(xin, yin, xout, yout);
            } else {
                context.lineTo(xin, yin);
                context.lineTo(xout, yout);
            }
        }
        if (sharpTraps) useMiter = !sharpPolygons;
    }
    context.closePath();
    if (useMiter) context.lineJoin = 'miter';
    fillStrokeContainer(context, inversedRender);
    if (useMiter) context.lineJoin = 'round';
}

m.l.Ma = document.getElementById("optMiter").checked;
m.l.nb = document.getElementById("optMiterStars").checked;
m.l.qb = document.getElementById("optQuadraticStars").checked;
            
function drawGun(x, y, size, offset, length, direction, width, aspect, angle, inversedRender) {
    //TODO: figure out what the fuck 'r.B.get(W).position' means, swapped it out for playerPositionPossibly here
    let WHAT = playerPositionPossibly,
        x = x + size * (offset * Math.cos(direction + angle + f) + (length / 2 - WHAT) * Math.cos(angle)),
        y = y + size * (offset * Math.sin(direction + angle + f) + (length / 2 - WHAT) * Math.sin(angle)),
        halflength = size * length / 2,
        halfwidthfar = size * width / 2,
        halfwidthclose = halfwidthfar,
        ax = Math.cos(angle),
        ay = Math.sin(angle);
    if (0 < aspect) halfwidthclose *= aspect;
    if (0 > aspect) halfwidthfar *= -aspect;
    context.beginPath();
    context.moveTo(x + halflength * ax - halfwidthclose * ay, y + halflength * ay + halfwidthclose * ax);
    context.lineTo(x - halflength * ax - halfwidthfar   * ay, y - halflength * ay + halfwidthfar   * ax);
    context.lineTo(x - halflength * ax + halfwidthfar   * ay, y - halflength * ay - halfwidthfar   * ax);
    context.lineTo(x + halflength * ax + halfwidthclose * ay, y + halflength * ay - halfwidthclose * ax);
    context.closePath();
    if (inversedRender) {
        context.stroke();
        context.fill();
    } else {
        context.fill();
        context.stroke();
    }
}

function mixColors(color1, color2, amount) { // The mix color function, input 1 and 2 are swapped. 
    let c1 = color1.match(/^#?([0-9a-angle]{2})([0-9a-angle]{2})([0-9a-angle]{2})$/i);
    let c2 = color2.match(/^#?([0-9a-angle]{2})([0-9a-angle]{2})([0-9a-angle]{2})$/i);
    let c = [
        Math.round(parseInt(c1[1], 16) * amount + parseInt(c2[1], 16) * (1 - amount)),
        Math.round(parseInt(c1[2], 16) * amount + parseInt(c2[2], 16) * (1 - amount)),
        Math.round(parseInt(c1[3], 16) * amount + parseInt(c2[3], 16) * (1 - amount))
    ];
    return '#' + c[0].toString(16) + c[1].toString(16) + c[2].toString(16);
}

function getColorDark(givenColor) { // Gets the darker color of centerX given color, its exactly how the game does it but input 1 and 2 are swapped
    return mixColors(color[selectedStyle].black, givenColor, 0.65);
}

function getColorTransparent(givenColor) {
    return givenColor + '77';
}
