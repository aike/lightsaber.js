/*
 * lightsaber.js
 * MIT licensed
 * Copyright (C) 2015 aike, http://github.com/aike
 */

/*window.onerror = function(error) {
    alert(error);
};
*/

var mousedown, mouseup;
if ("ontouchstart" in window) {
  mousedown = "touchstart";
  mouseup = "touchend";
} else {
  mousedown = "mousedown";
  mouseup = "mouseup";
}

var handle = document.querySelector("#handle");
var beam = document.querySelector("#beam");

handle.style.left = ((window.innerWidth - 30) / 2) + "px"; 
beam.style.left = ((window.innerWidth - 20) / 2) + "px"; 


var beamOn = false;
var beamMax = 360;
var beamLen = 0;
beam.style.top = (400 - beamLen) + "px";
beam.style.height = beamLen + "px";

var cnt = 0;
var beamanim = function() {
  if (beamOn) {
    if (beamLen < beamMax) {
      beamLen += 30;
      beam.style.top = (400 - beamLen) + "px";
      beam.style.height = beamLen + "px";
    }
  } else {
    if (beamLen > 0) {
      beamLen -= 30;
      beam.style.top = (400 - beamLen) + "px";
      beam.style.height = beamLen + "px";
    }
  }
}
setInterval(beamanim, 20);
handle.addEventListener(mousedown, function(){beamOn = true;});
handle.addEventListener(mouseup,   function(){beamOn = false;});

///////////////////////////
var ctx = new webkitAudioContext();
var gain = ctx.createGain();
gain.gain.value = 0.5;
var gainBase = 0.3;
var lpf = ctx.createBiquadFilter();
lpf.type = "lowpass";
lpf.frequency.value = 2000;
var delay = ctx.createDelay();
delay.delayTime.value = 0.2;
var feedback = ctx.createGain();
feedback.gain.value = 0.3;
var wet = ctx.createGain();
wet.gain.value = 0.2;
gain.connect(lpf);
lpf.connect(delay);
delay.connect(feedback);
feedback.connect(delay);
lpf.connect(ctx.destination);
delay.connect(wet);
wet.connect(ctx.destination);

var osc = null;

handle.addEventListener(mousedown, function(){
  osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.value = 90;
  osc.connect(gain);
  osc.start(0);
});

handle.addEventListener(mouseup, function(){
  osc.stop(0);
  osc = null;
});

setInterval(function() {
  gain.gain.value = gainBase + (gainBase * Math.random() * 0.2);
}, 100);

window.addEventListener("devicemotion", function(e) {
  var ac = e.acceleration;
  mag = ac.y;
  gainBase = Math.min(Math.max(mag / 10, 0.05), 1);

  if (osc != null)
    osc.frequency.value = 90 + mag * 0.1;

});





