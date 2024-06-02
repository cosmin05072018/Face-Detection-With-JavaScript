const video = document.getElementById("video");

function startVideo() {
  navigator.getUserMedia({
    video: {},
    stream => video.srcObject = stram,
    err => console.log(err);
  });
}
