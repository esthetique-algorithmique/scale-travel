// -------------------
//     Parameters
// -------------------

const ai = new rw.HostedModel({
    url: "https://stylegan-99d4e615.hosted-models.runwayml.cloud/v1/",
    token: "qnPdQqjGgmh/KmlNajeD0A==",
 });
 let img: p5.Element;
 const z = [];
 const a = [];
 let angle = 0;
 let frameNB = 0;

// -------------------
//       Drawing
// -------------------

function draw() {
    if (img) {
        image(img, 0, 0, width, height);
    }
}

// -------------------
//    Initialization
// -------------------

function make_request() {
    for (let i = 0; i < 512; i++) {
        a[i] = z[i].value(angle);
    }
    angle += TWO_PI / (24*60);

    const inputs = {
        "z": a,
        "truncation": 0.5,
    }

    ai.query(inputs).then(outputs => {
        const { image } = outputs;
        img = createImg(image);
        img.hide();

        // p5.prototype.downloadFile(image, "butterfly" + frameNB.toString(), "png");
        frameNB++;
        if (frameNB < 50) {
            // setTimeout(make_request, 200);
            make_request();
        }
    });
}

function setup() {
    p6_CreateCanvas();
    for (let i = 0; i < 512; i++) {
        z[i] = new NoiseLoop(20, -1, 1);
        console.log(z[i]);
    }
    make_request();
}

function windowResized() {
    p6_ResizeCanvas();
}

class NoiseLoop { //introduces the randomness we need to generate images from the latent space
    diameter: number;    
    min: number;
    max: number;
    cy: number; 
    cx: number;
    constructor(diameter, min, max) {
      this.diameter = diameter;
      this.min = min;
      this.max = max;
      this.cx = random(1000);
      this.cy = random(1000);
    }
    value(a) {
      let xoff = map(cos(a), -1, 1, this.cx, this.cx + this.diameter);
      let yoff = map(sin(a), -1, 1, this.cy, this.cy + this.diameter);
      let r = toxi.math.noise.simplexNoise.noise(xoff,yoff); //requires toxic libs library
      return map(r, -1, 1, this.min, this.max);
    }
}