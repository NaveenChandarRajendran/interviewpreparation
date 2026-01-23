import React, { useState } from 'react'
const tmpAnswers = {};

const MCQ = () => {
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: "Question one",
            options: ["One", "Two", "Three"],
            answer: ["Two"]
        },
        {
            id: 2,
            question: "Question Two",
            options: ["Four", "Five", "Six"],
            answer: ["Five", "Six"]
        },
        {
            id: 3,
            question: "Question Three",
            options: ["Seven", "Eight", "Nine"],
            answer: ["Seven", "Nine"]
        }
    ]);
    const [errors, setErrors] = useState({})

    const handleChange = (event, id) => {
        const { value, checked } = event.target;
        if (tmpAnswers.hasOwnProperty(id)) {
            if (tmpAnswers[id].includes(value)) {
                tmpAnswers[id] = tmpAnswers[id].filter((ans) => ans !== value);
            } else {
                tmpAnswers[id] = [...tmpAnswers[id], value]
            }
        } else {
            tmpAnswers[id] = [value];
        }
    }

    const handleSubmit = () => {
        let tmpErrors = {};

        for (let tmp in tmpAnswers) {
            const findQuestion = questions.find((each) => each.id === Number(tmp));
            if (findQuestion) {
                tmpAnswers[tmp].forEach((tmpAns) => {
                    if (!findQuestion.answer.includes(tmpAns)) {
                        tmpErrors[tmp] = "Wrong answer";
                    }
                })
            } else {
                throw new Error("Please answer all the questions");
            }
        }
        setErrors(tmpErrors);
        if (Object.keys(tmpErrors).length === 0) alert("All answer correcr");

    }

    return (
        <div>
            {questions.map((ques) => {
                return (
                    <React.Fragment>
                        <h3>{ques.question}</h3>
                        {ques.options.map((opt) => (
                            <React.Fragment>
                                <input type='checkbox' value={opt} onChange={(evnt) => handleChange(evnt, ques.id)} />
                                <label>{opt}</label><br />

                            </React.Fragment>
                        ))}
                        {errors[ques.id] && <p style={{ color: 'red' }}>{errors[ques.id]}</p>}
                    </React.Fragment>

                )
            })}
            <button onClick={() => handleSubmit()}>Submit</button>

        </div>
    )
}

export default MCQ