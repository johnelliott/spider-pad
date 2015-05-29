// Controller
var Barcli = require("barcli");
var five = require("johnny-five");
var controller = new five.Board();
// Drone
var RollingSpider = require("rolling-spider");
var droneOptions = {
  uuid: "RS_W178362"
};
var flightOptions = {
  speed: 50,
  steps: 50
};

controller.on("ready", function() {
  var stepsRange = [0, 100];
  var stepsGraph = new Barcli({
    label: "Steps",
    range: stepsRange
  });

  var speedRange = [0, 100];
  var speedGraph = new Barcli({
    label: "Speed",
    range: speedRange
  });

  // VTL
  var fly = new five.Button(12);
  // steering 8, 9, 10, 11
  var forward = new five.Button(9);
  var backward = new five.Button(11);
  var left = new five.Button(8);
  var right = new five.Button(10);
  var up = new five.Button(6);
  var down = new five.Button(7);
  // flips
  var flip = new five.Button(5);
  // dials for steps and speed
  var steps = new five.Sensor("A0");
  var speed = new five.Sensor("A1");



  // add speed controls
  speed.scale(speedRange).on("change", function() {
    speedGraph.update(this.value);
    flightOptions.speed = this.value;
  });
  steps.scale(stepsRange).on("change", function() {
    stepsGraph.update(this.value);
    flightOptions.steps = this.value;
  });

  // init drone
  var drone = new RollingSpider(droneOptions);
  // hack below
  var randomFlip = function(drone) {
    console.log("↺ flip ↺");

    switch(Math.floor(Math.random() * 4)){
      case 0:
        drone.frontFlip();
        break;
      case 1:
        drone.backFlip();
        break;
      // ONLY DO THESE WITH NO WHEELS
      case 2:
        drone.leftFlip();
        break;
      case 3:
        drone.rightFlip();
        break;
    }
  };
  // hack below
  function signal() {
    drone.signalStrength(function(err, rssi) {
      console.log("drone signal:", rssi);
    });
  }
  drone.connect(function() {
    console.log("drone connect");
    drone.setup(function() {
      console.log("drone setup");

      drone.calibrate();
      drone.startPing();
      console.log("drone battery:", drone.status.battery);
      console.log("drone flying:", drone.status.flying);
      signal();
      // add control listeners
      fly.on("press", function() {
        console.log("↑ fly/land ↓");
        signal();
        if(drone.status.flying) {
          drone.land(function() {
            console.log("drone landed ↓");
          });
        }
        else {
          drone.takeOff(function() {
            console.log("drone took off ↑");
          });
        }
      });
      forward.on("press", function() {
        console.log("↑");
        console.clear
        drone.forward(flightOptions);
      });
      backward.on("press", function() {
        console.log("↓");
        console.clear
        drone.backward(flightOptions);
      });
      left.on("press", function() {
        console.log("←");
        console.clear
        drone.turnLeft(flightOptions);
      });
      right.on("press", function() {
        console.log("→");
        console.clear
        drone.turnRight(flightOptions);
      });
      up.on("press", function() {
        console.log("↑↑↑");
        console.clear
        drone.up(flightOptions);
      });
      down.on("press", function() {
        console.log("↓↓↓");
        console.clear
        drone.down(flightOptions);
      });
      flip.on("press", function() {
        console.log("↺");
        console.clear
        randomFlip(drone);
      });
    });
  });
});
