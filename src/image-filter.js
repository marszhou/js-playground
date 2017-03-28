function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#blah').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

$("#imgInp").change(function() {
  readURL(this);
});

let Filters = {};
Filters.getPixels = function(img) {
  var c = this.getCanvas(img.width, img.height);
  var ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, c.width, c.height);
};

Filters.getCanvas = function(w, h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

Filters.filterImage = function(filter, image, var_args) {
  var args = [this.getPixels(image)];
  for (var i = 2; i < arguments.length; i++) {
    args.push(arguments[i]);
  }
  return filter.apply(null, args);
};

Filters.grayscale = function(pixels, args) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];
    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    d[i] = d[i + 1] = d[i + 2] = v
  }
  return pixels;
};

$('#filter').on('click', () => {
  // let imgData = Filters.filterImage(Filters.grayscale, document.getElementById('img'))
  let imgData = Filters.getPixels(document.getElementById('img'))
  let c = document.getElementById('filtered')
  c.width = imgData.width
  c.height = imgData.height
  let ctx = c.getContext('2d')
  ctx.putImageData(imgData, 0, 0)

  let imgOut = document.getElementById('img_out')

  imgOut.src = c.toDataURL()
  imgOut.onload = () => {
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.scale(0.5, 0.5)
    ctx.drawImage(imgOut, 0, 0)
  }
})

function RGB2HSLC(R, G, B) {
  let var_R = (R / 255) //RGB from 0 to 255
  let var_G = (G / 255)
  let var_B = (B / 255)

  let var_Min = Math.min(var_R, var_G, var_B) //Min. value of RGB
  let var_Max = Math.max(var_R, var_G, var_B) //Max. value of RGB
  let del_Max = var_Max - var_Min //Delta RGB value

  let C = del_Max
  let L = (var_Max + var_Min) / 2
  let H = 0
  let S = 0

  if (del_Max == 0) { //This is a gray, no chroma...
    H = 0 //HSL results from 0 to 1
    S = 0
  } else //Chromatic data...
  {
    if (L < 0.5) S = del_Max / (var_Max + var_Min)
    else S = del_Max / (2 - var_Max - var_Min)

    let del_R = (((var_Max - var_R) / 6) + (del_Max / 2)) / del_Max
    let del_G = (((var_Max - var_G) / 6) + (del_Max / 2)) / del_Max
    let del_B = (((var_Max - var_B) / 6) + (del_Max / 2)) / del_Max

    if (var_R == var_Max) H = del_B - del_G
    else if (var_G == var_Max) H = (1 / 3) + del_R - del_B
    else if (var_B == var_Max) H = (2 / 3) + del_G - del_R

    if (H < 0) H += 1
    if (H > 1) H -= 1
  }

  return {H, S, L, C}
}

function calculateColorDistance(color1, color2) {
  let hslc1 = RGB2HSLC.apply(null, color1)
  let hslc2 = RGB2HSLC.apply(null, color2)

  let x1 = hslc1.C * Math.cos(hslc1.H * Math.PI)
  let x2 = hslc2.C * Math.cos(hslc2.H * Math.PI)
  let y1 = hslc1.C * Math.sin(hslc1.H * Math.PI)
  let y2 = hslc2.C * Math.sin(hslc2.H * Math.PI)
  let z1 = hslc1.L
  let z2 = hslc2.L

  return Math.sqrt(
    Math.pow(x1 - x2, 2) +
    Math.pow(y1 - y2, 2) +
    Math.pow(z1 - z2, 2)
  )
}