// Controller
var Barcli = require("barcli");
var five = require("johnny-five");
var controller = new five.Board();
// Drone
var RollingSpider = require("rolling-spider");
var temporal = require("temporal");

controller.on("ready", function() {
  var altRange = [0, 100];
  var altGraph = new Barcli({
    label: "Potentiometer",
    range: altRange,
  });

  var led = new five.Led(13);
  // VTL
  var fly = new five.Button(2);
  // steering 8, 9, 10, 11
  var forward = new five.Button(9);
  var backward = new five.Button(11);
  var left = new five.Button(8);
  var right = new five.Button(10);
  // altitude
  var altitude = new five.Sensor("A0");


  altitude.scale(altRange).on("change", function() {
    altGraph.update(this.value);
  });

  fly.on("press", function() {
    console.log("* fly");
    if(drone.fly) {
      drone.land(function() {
        console.log("landed");
      });
    }
    else {
      drone.flatTrim(function() {
        console.log("flatTrim");
      });
      drone.startPing(function() {
        console.log("startPing");
      });
      drone.takeOff(function() {
        console.log("took off");
      });
    }
  });
  forward.on("press", function() {
    console.log("* forward");
    drone.forward({
      speed: 50,
      steps: 10
    });
  });
  backward.on("press", function() {
    console.log("* backward");
  });
  left.on("press", function() {
    console.log("* left");
  });
  right.on("press", function() {
    console.log("* right");
  });

  var drone = new RollingSpider();

  drone.connect(function() {
    drone.setup(function() {
      // NEW CODE
      temporal.queue([
        {
          delay: 0,
          task: function () {
            drone.flatTrim();
            drone.startPing();
            drone.takeOff();
          }
        },
        {
          delay: 3000,
          task: function () {
            drone.forward();
          }
        },
        {
          delay: 500,
          task: function () {
            drone.land();
          }
        }]);
    });
  });

});
