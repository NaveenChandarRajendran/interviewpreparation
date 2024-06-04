//Map 
let arr = [1, 2, 3];
arr.map((each, index, arr) => console.log(each, index, arr));
Array.prototype.naveenMap = function (cb) {
    let res = []; for (let i = 0; i < this.length; i++) {
        res.push(cb(this[i], i, this))
    } return res;
}
arr.naveenMap((each) => console.log("nav", each));

//Filter 
Array.prototype.naveenFilter = function (cb) {
    let res = [];
    for (let i = 0; i < this.length; i++) {
        if (cb(this[i], i)) {
            res.push(this[i]);
        }
    } return res;
}
const customFilterValue = name.naveenFilter((each) => each !== 'two');
console.log("filter", customFilterValue); 

//Reduce
const addNo = [1, 2, 3, 4];
const add = addNo.reduce((acc, curr) => {
    return acc + curr;
}, 0)
Array.prototype.naveenReduce = function (cb, initialValue) {
    for (let i = 0; i < this.length; i++) {
        initialValue = cb(initialValue, this[i])
    } return initialValue;
}
const customReduce = addNo.naveenReduce((acc, curr) => { return acc + curr; }, 0)
console.log("customReduce", customReduce);