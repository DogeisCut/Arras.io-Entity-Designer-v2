let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let color = {
  "normal": {
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

function drawPoly(context, centerX, centerY, radius, sides, angle = 0, fill = true) { //the function that Arras.io uses to draw the tank
  angle += (sides % 2) ? 0 : Math.PI / sides;
  // Start drawing
  context.beginPath();
  if (!sides) { // Circle
      let fillcolor = context.fillStyle;
      let strokecolor = context.strokeStyle;
      radius += context.lineWidth / 4;
      context.arc(centerX, centerY, radius + context.lineWidth / 4, 0, 2 * Math.PI, false);
      context.fillStyle = strokecolor;
      context.fill();
      context.closePath();
      context.beginPath();
      context.arc(centerX, centerY, radius - context.lineWidth / 4, 0, 2 * Math.PI, false);
      context.fillStyle = fillcolor;
      context.fill();
      context.closePath();
      return;
  } else if (sides < 0) { // Star
      if (pointyGraphics) context.lineJoin = 'miter';
      let dip = 1 - (6 / sides / sides);
      sides = -sides;
      context.moveTo(centerX + radius * Math.cos(angle), centerY + radius * Math.sin(angle));
      for (let i = 0; i < sides; i++) {
          let theta = (i + 1) / sides * 2 * Math.PI;
          let htheta = (i + 0.5) / sides * 2 * Math.PI;
          let c = {
              x: centerX + radius * dip * Math.cos(htheta + angle),
              y: centerY + radius * dip * Math.sin(htheta + angle),
          };
          let p = {
              x: centerX + radius * Math.cos(theta + angle),
              y: centerY + radius * Math.sin(theta + angle),
          };
          context.quadraticCurveTo(c.x, c.y, p.x, p.y);
      }
  } else if (sides === 600) {
      for (let i = 0; i < 6; i++) {
          let theta = (i / 6) * 2 * Math.PI,
              x = centerX + radius * 1.1 * Math.cos(180 / 6 + theta + angle + 0.385),
              y = centerY + radius * 1.1 * Math.sin(180 / 6 + theta + angle + 0.385);
          context.lineTo(x, y);
      } 
  } else if (sides > 0) { // Polygon
      for (let i = 0; i < sides; i++) {
          let theta = (i / sides) * 2 * Math.PI;
          let x = centerX + radius * Math.cos(theta + angle);
          let y = centerY + radius * Math.sin(theta + angle);
          context.lineTo(x, y);
      }
  } 
  context.closePath();
  context.stroke();
  if (fill) {
      context.fill();
  }
  context.lineJoin = 'round';
}

function drawTrapezoid(context, x, y, length, height, aspect, angle) { //The function that Arras.io uses to draw guns
  let h = [];
  h = (aspect > 0) ? [height * aspect, height] : [height, -height * aspect];
  let r = [
      Math.atan2(h[0], length),
      Math.atan2(h[1], length)
  ];
  let l = [
      Math.sqrt(length * length + h[0] * h[0]),
      Math.sqrt(length * length + h[1] * h[1])
  ];
  context.beginPath();
  context.lineTo(x + l[0] * Math.cos(angle + r[0]), y + l[0] * Math.sin(angle + r[0]));
  context.lineTo(x + l[1] * Math.cos(angle + Math.PI - r[1]), y + l[1] * Math.sin(angle + Math.PI - r[1]));
  context.lineTo(x + l[1] * Math.cos(angle + Math.PI + r[1]), y + l[1] * Math.sin(angle + Math.PI + r[1]));
  context.lineTo(x + l[0] * Math.cos(angle - r[0]), y + l[0] * Math.sin(angle - r[0]));
  context.closePath();
  context.stroke();
  context.fill();
}

function mixColors(color1, color2, amount) { // The mix color function, input 1 and 2 are swapped. 
  let c1 = color1.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  let c2 = color2.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  let c = [
      Math.round(parseInt(c1[1], 16) * amount + parseInt(c2[1], 16) * (1 - amount)),
      Math.round(parseInt(c1[2], 16) * amount + parseInt(c2[2], 16) * (1 - amount)),
      Math.round(parseInt(c1[3], 16) * amount + parseInt(c2[3], 16) * (1 - amount))
  ];
  return '#' + c[0].toString(16) + c[1].toString(16) + c[2].toString(16);
}

function getColorDark(givenColor) { // Gets the darker color of a given color, its exactly how the game does it but input 1 and 2 are swapped
  return mixColors(color.normal.black, givenColor, 0.65);
}

function getColorTransparent(givenColor) {
  return givenColor + '77';
}
