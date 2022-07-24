class Alien {
  //The Constructor method will take a number of parameters and assign those parameters as properties to the created object
  constructor(name, phrase) {
    this.name = name;
    this.phrase = phrase;
    this.specie = "alien";
  }
  //These will be the objects methods
  fly = () => console.log("zzzzzzzzllllllllllllnnnnng");
  sayPhrase = () => console.log(this.phrase);
}

const alian1 = new Alien("butty", "hello dear");
console.log(alian1);
alian1.fly();
alian1.sayPhrase();

class Bug {
  constructor(name, phrase) {
    this.name = name;
    this.phrase = phrase;
    this.specie = "bug";
  }
  hide = () => console.log("you cant catch me now");
  sayPhrase = () => console.log(this.phrase);
}

const bug1 = new Bug("buggy", "bbbuuuussxzzzzzzz");
bug1.hide();
bug1.sayPhrase();

class Robot {
  constructor(name, phrase) {
    this.name = name;
    this.phrase = phrase;
    this.specie = "robot";
  }

  transform = () => console.log("Optimus Prime");
  sayPhrase = () => console.log(this.phrase);
}

//Inheritance
class Enemy {
  constructor(power) {
    this.power = power;
  }
  attack = () => console.log("Attack");
}
//**This inherits the Enemy class  properties and methods */
class Human extends Enemy {
  constructor(name, phrase, power) {
    super(power);
    this.name = name;
    this.phrase = phrase;
  }
  fly = () => console.log("zzzllllyyyyy");
  sayPhrase = () => console.log(this.phrase);
}
const bright = new Human("Bright", "stay jiggy", "flying");
bright.fly();

//REFACTORING
class Character {
  constructor(speed) {
    this.speed = speed;
  }
  move = () => console.log(`I'm moving at the speed of ${this.speed}!`);
}

class Enemy extends Character {
  constructor(name, Phrase, power, speed) {
    super(speed);
    this.name = name;
    this.phrase = phrase;
    this.power = power;
  }

  sayPhrase = () => console.log(this.phrase);
  attack = () => console.log(`I'm attacking with a power of ${this.power}`);
}

class Alien extends Enemy {
  constructor(name, phrase, power, speed) {
    super(name, phrase, power, speed);
    this.specie = "alien";
  }
  fly = () => console.log("zzzllllyyyyy");
}

class Bug extends Enemy {
  constructor(name, phrase, power, speed) {
    super(name, phrase, power, speed);
    this.specie = "bug";
  }
  hide = () => console.log("You cant catch me now");
}

class Robot extends Enemy {
  constructor(name, phrase, power, speed) {
    super(name, phrase, power, speed);
    this.specie = "Robot";
  }
  transform = () => console.log("Optimus Prime");
}

const jab = new Robot("jab", "yuuuuggguy", 50, 30);
jab.specie();

//ENCAPSULATION
class Alien extends Enemy {
  #birthYear; //We first need to declare the private property, always using the '#' symbol at the start of its name

  constructor(name, phrase, power, speed, birthYear) {
    super(name, phrase, power, speed);
    this.specie = "alien";
    this.#birthYear = birthYear;
  }
  fly = () => console.log("zzzllllyyyyy");
  howOld = () => console.log(`I was born in ${this.#birthYear}`);
}
