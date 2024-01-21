// import {useDispatch} from "react-redux";
import React, {useState} from "react";

interface LoginPageProps {}

const LoginPage:React.FC<LoginPageProps> =()=>{
    // const dispatch=useDispatch()
    const [username,setUsername]=useState<string>('')
    const [password,setPassword]=useState<string>('')

    const handleLogin = (e:React.FormEvent)=>{
        e.preventDefault()
        // dispatch(login(username,password))
    }

    return(
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <label>
                    Username:
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>
                <br />
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginPage

