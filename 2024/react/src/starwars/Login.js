import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [starWarHeroList, setStarWarHeroList] = useState([]);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        async function callStarWarsHero() {
            try {
                const response = await axios.get("https://swapi.dev/api/people/");
                console.log(response)
                if (response.status === 200) {
                    setStarWarHeroList(response.data.results)
                }
            } catch (err) {
                console.log("err", err);
            }

        }
        callStarWarsHero()
    }, [])

    const handleSubmit = () => {
        if (!userName || !password) {
            return alert("Please enter the form");
        }

        const getHeroDetails = starWarHeroList.find((hero) => hero.name === userName && hero.birth_year === password);
        if (getHeroDetails) {
           return navigate("/planet")
        }
        alert("Login Failed")

    }

    return (
        <div>
            Login
            <p>Username</p>
            <input type='text' placeholder='Username' value={userName} onChange={(e) => setUserName(e.target.value)} />
            <p>Password</p>
            <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={() => handleSubmit()}>Submit</button>
        </div>
    )
}

export default Login