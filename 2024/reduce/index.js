const students = [
    { name: "Naveen", rollNumber: 1, marks: 80 },
    { name: "Nandha", rollNumber: 2, marks: 69 },
    { name: "Kamal", rollNumber: 3, marks: 35 },
    { name: "Gopi", rollNumber: 4, marks: 55 },
]

const totalMarks = students.filter((stu) => stu.marks < 60).map((bStu) => bStu.marks + 20).reduce((acc, curr) => {
    acc = acc + curr;
    return acc;
}, 0)
console.log(totalMarks)