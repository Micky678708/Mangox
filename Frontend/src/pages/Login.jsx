import React, { useState } from "react"
import FlotingInput from "../components/FlotingInput"
import "../styles/auth.css"
import { useNavigate } from "react-router-dom"

const Login = () => {

const navigate = useNavigate()

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

return (

<div className="authContainer">

<div className="authBox">

<div className="logo">MangoX</div>

<FlotingInput
label="Mobile number, username or email"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

<FlotingInput
type="password"
label="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button className="authButton">
Log in
</button>

<div
className="authLink"
onClick={()=>navigate("/forgot")}
>
Forgot password?
</div>

<div
className="authLink"
onClick={()=>navigate("/signup")}
>
Create new account
</div>

</div>

</div>

)

}

export default Login