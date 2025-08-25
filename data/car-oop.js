class Car{
  #brand;
  #model;
  speed = 0;
  isTrunkOpen = true;
  constructor(carDetails){
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
  }
  displayInfo(){
    const trunkStatus = this.isTrunkOpen ? "open" : "closed";
    console.log(`
      ${this.#brand}, 
      ${this.#model}
      ${this.speed} km/h
      Trunk: ${trunkStatus}
      `);
  }
  go(){
    if(!this.isTrunkOpen){
      this.speed += 5;
    }
    if(this.speed > 200){
      this.speed = 0;
    }
  }
  openTrunk(){
    if(this.speed = 0){
      this.isTrunkOpen = true;
    }
  }
  closeTrunk(){
    this.isTrunkOpen = false;
  }
  break(){
    if(this.speed > 0){
    this.speed -= 5;
   } 
  }

}
const car1 = new Car({
  brand: "Toyota",
  model: "Corolla",
  
});


/* car1.openTrunk();
car1.go()
car1.closeTrunk();
car1.go();
car1.displayInfo(); */

class Race extends Car {
acceleration = 0;
constructor(carDetails){
  super(carDetails);
  this.acceleration = carDetails.acceleration;
}
go(){
  this.speed += this.acceleration;
  
  if(this.speed > 300){
    this.speed = 300;
  }
}
openTrunk(){
  console.log("race car do not have trunks ");
}
closeTrunk(){
  console.log("race car do not have trunks");
}


}
const raceCar = new Race({
  brand: "McLaren",
  model: "F1",
  acceleration: 40
})

raceCar.go();
raceCar.go();
raceCar.go();

raceCar.break();
raceCar.openTrunk();

console.log(raceCar);


const carObjects = [{
  brand: "Toyota",
  model: "Corolla"
}, {
  brand: "Tesla",
  model: "Model 3"
}].map(carDetails => {
  return new Car(carDetails);
});
