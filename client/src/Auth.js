import { useState } from 'react';
import { useCookies } from 'react-cookie';
import './App.css'


const Auth = () => {
    return (
        <div>
            <Register/>
            <Login/>
        </div>
    )
}

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () =>{
        await fetch("http://localhost:3001/register", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            username,
            password
        }),

        // Adding headers to the request
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
    }

    return (
            <Form lable="Register"
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            submit={submit}
            />
    )
}

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [_, setCookie] = useCookies(['access-token']);

    const submit = async (e) =>{
        e.preventDefault();
        fetch("http://localhost:3001/login", {

        // Adding method type
        method: "POST",

        // Adding body or contents to send
        body: JSON.stringify({
            username,password
        }),

        // Adding headers to the request
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })

        // Converting to JSON
        .then(response => response.json())

        // Displaying results to console
        .then(json => {setCookie("access_token", json.token)
        window.localStorage.setItem("userID", json.adminID)});
    
    }

    //setCookie("access_token", response.data.token)
    //window.localStorage.setItem("userID", response.data.adminID)
    return (           
            <Form lable="Login"
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
            submit={submit}
            />
    )
}


const Form = (props) => {
    return (
        <div>
            <form className="result"> 
                <h2>{props.lable}</h2>
                <div className="result">
                    <lable htmlFor="username">Username:</lable>
                    <input type="text" id="username" value={props.username} onChange={e => props.setUsername(e.target.value)}></input>
                    <lable htmlFor="password">Password:</lable>
                    <input type="password" id="password" value={props.password} onChange={e => props.setPassword(e.target.value)}></input>
                    <button type="submit" onClick={props.submit}>{props.lable}</button>

                </div>
            </form>
        </div>
    )
}

export default Auth