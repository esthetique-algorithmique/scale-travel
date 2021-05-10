// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
}
gui.add(params, "Download_Image")

// You need to change this and use the values given to you by Runway for your own model
const ai = new rw.HostedModel({
    url: "https://earth-image-generator-48b3c158.hosted-models.runwayml.cloud/v1/",
    token: "woX1y2sRQnFkGxG+qkwwoA==",
});

let img: p5.Element
//// You can use the info() method to see what type of input object the model expects
// model.info().then(info => console.log(info));

let z = [];
let a = [];
let angle = 0;
let frameNB = 0;
// -------------------
//       Drawing
// -------------------

function draw() {
    if (img)
        image(img, 0, 0, width, height)    
}


function makeRequest(){
    
    for (let i = 0; i < 512; i++) { //loop through all pixels, and select the corresponding value for the vector with the randomness generated from our Noise Loop function
        a[i] = z[i].value(angle); 
    }

    

    const inputs = {
        "z": a,
        "truncation": 0.5,
    };

    ai.query(inputs).then(outputs => {
        const { image } = outputs;
        img = createImg(image)
        img.hide()
        
        p5.prototype.downloadFile(image, frameNB.toString(), "png");
        frameNB++
        let da = TWO_PI / (24*60); //MH - not sure why these values are used (1440 = 360*4)
        angle += da;
        //z = z.map(el=>el+random(-.2,.2));
        if (frameNB < 50) { //once we have traversed all pixels, generated a new image
            setTimeout(makeRequest, 200);
        }
        
    });
}
// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()    
    for (let i = 0; i < 512; i++) {
       z[i] = new NoiseLoop(20, -1, 1);
    }
    
    makeRequest();
}

function windowResized() {
    p6_ResizeCanvas()
}

class NoiseLoop {//introduces the randomness we need to generate images from the latent space
    
    diameter : number;
    min : number;
    max: number;
    cy : number;
    cx : number;

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

