
let serviceUuid;
let myCharacteristic;
let myValue;
let myBLE

let button;
function initBLE() {
  let inp = createInput('');
  inp.input(myInputEvent);
  function myInputEvent() {
    console.log('you are typing: ', this.value());
  }
  button = createButton('set server ip');
  
  button.mousePressed(changeBG);
  function changeBG() {
    serverIp=inp.value;
    console.log(inp.value());
  }

  serviceUuid = "19B10010-E8F2-537E-4F6C-D104768A1214";
  
  myValue = 0;
  
  // Create a p5ble class
  myBLE = new p5ble();



  // Create a 'Connect' button
  const connectButton = createButton('Connect')
  connectButton.mousePressed(connectToBle);
}
function connectToBle() {
    // Connect to a device by passing the service UUID
    myBLE.connect(serviceUuid, gotCharacteristics);
}
// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
    if (error) console.log('error: ', error);
    console.log('characteristics: ', characteristics);
    myCharacteristic = characteristics[0];
    // Read the value of the first characteristic
    myBLE.read(myCharacteristic, gotValue);
}

  // A function that will be called once got values
function gotValue(error, value) {
    if (error) console.log('error: ', error);
    console.log('value: ', value);
    myValue = value;
    // After getting a value, call p5ble.read() again to get the value again
    myBLE.read(myCharacteristic, gotValue);
    console.log(myValue);
}
