const video = document.getElementById("video");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.log(err)
  );
}

function setupCanvas() {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight,
  };
  faceapi.matchDimensions(canvas, displaySize);

  return { canvas, displaySize };
}

function resizeCanvas(canvas) {
  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight,
  };
  faceapi.matchDimensions(canvas, displaySize);
  return displaySize;
}

video.addEventListener("play", async () => {
  const { canvas, displaySize } = setupCanvas();

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);

  window.addEventListener("resize", () => {
    resizeCanvas(canvas);
  });
});

video.addEventListener("loadeddata", () => {
  setupCanvas();
});
