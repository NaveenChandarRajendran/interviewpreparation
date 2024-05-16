//global scope
var name = "Naveen";
function makeFunc() {
    var name = "gopi"
    //Outter function scope
    function displayName() {
        console.log(name) //local function scope
    }
    return displayName;
}
let myFunc = makeFunc();
myFunc();


//Interview questions

function creatBase(num) {
    return function (num2) {
        console.log(num + num2)
    }
}

var addSix = creatBase(6);
addSix(10);// return 16
addSix(21);// return 27

function a() {
    var i =0;
    return function(){
        for (var i = 0; i < 3; i++) {
            setTimeout(() => {
                console.log(i)
            }, i * 1000);
        }
    }
}

a();