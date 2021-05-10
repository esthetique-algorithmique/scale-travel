var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
};
gui.add(params, "Download_Image");
var ai = new rw.HostedModel({
    url: "https://earth-image-generator-48b3c158.hosted-models.runwayml.cloud/v1/",
    token: "woX1y2sRQnFkGxG+qkwwoA==",
});
var img;
var z = [];
var a = [];
var angle = 0;
var frameNB = 0;
function draw() {
    if (img)
        image(img, 0, 0, width, height);
}
function makeRequest() {
    for (var i = 0; i < 512; i++) {
        a[i] = z[i].value(angle);
    }
    var inputs = {
        "z": a,
        "truncation": 0.5,
    };
    ai.query(inputs).then(function (outputs) {
        var image = outputs.image;
        img = createImg(image);
        img.hide();
        p5.prototype.downloadFile(image, frameNB.toString(), "png");
        frameNB++;
        var da = TWO_PI / (24 * 60);
        angle += da;
        if (frameNB < 50) {
            setTimeout(makeRequest, 200);
        }
    });
}
function setup() {
    p6_CreateCanvas();
    for (var i = 0; i < 512; i++) {
        z[i] = new NoiseLoop(20, -1, 1);
    }
    makeRequest();
}
function windowResized() {
    p6_ResizeCanvas();
}
var NoiseLoop = (function () {
    function NoiseLoop(diameter, min, max) {
        this.diameter = diameter;
        this.min = min;
        this.max = max;
        this.cx = random(1000);
        this.cy = random(1000);
    }
    NoiseLoop.prototype.value = function (a) {
        var xoff = map(cos(a), -1, 1, this.cx, this.cx + this.diameter);
        var yoff = map(sin(a), -1, 1, this.cy, this.cy + this.diameter);
        var r = toxi.math.noise.simplexNoise.noise(xoff, yoff);
        return map(r, -1, 1, this.min, this.max);
    };
    return NoiseLoop;
}());
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map