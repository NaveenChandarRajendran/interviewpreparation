const months = ["Jan", "March", "April", "May"];
// months.splice(1, 0, "Feb");
// months.splice(2, 1, "Sep");
// months.splice(2, 2, "Sep");
months.splice(2, 2, "Sep");
// console.log(months);

const str = "naveen chadnar";
let modifieldStr = "";

for (let i = 0; i < str.length; i++) {
    if (i % 2 !== 0) modifieldStr += str[i].toUpperCase();
    else modifieldStr += str[i];
}
console.log(modifieldStr);

function recFn(i) {
    if (i === 10) return
    recFn(i + 1);
}